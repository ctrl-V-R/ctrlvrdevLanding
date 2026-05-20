import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, PlainTextResponse, StreamingResponse

LOG = logging.getLogger("gateway")
logging.basicConfig(level=logging.INFO)

ROOT = Path(__file__).parent
MAPPINGS_FILE = ROOT / "mappings.json"


def load_mappings() -> List[Dict[str, Any]]:
    if not MAPPINGS_FILE.exists():
        return []
    with MAPPINGS_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)
    # normalize
    for entry in data:
        entry["path_prefix"] = entry["path_prefix"].rstrip("/")
        entry["upstream"] = entry["upstream"].rstrip("/")
    return data


def find_mapping(path: str, mappings: List[Dict[str, Any]]) -> Optional[Tuple[Dict[str, Any], str]]:
    # Find the longest matching path_prefix
    candidates = []
    for m in mappings:
        p = m["path_prefix"]
        if path == p or path.startswith(p + "/"):
            candidates.append((len(p), m))
    if not candidates:
        return None
    candidates.sort(reverse=True)
    m = candidates[0][1]
    prefix = m["path_prefix"]
    remainder = path[len(prefix):]
    if not remainder:
        remainder = "/"
    return m, remainder


app = FastAPI(title="ctrlvrdev Gateway")
_mappings: List[Dict[str, Any]] = load_mappings()


@app.on_event("startup")
async def startup_event() -> None:
    global _mappings
    LOG.info("Loading mappings from %s", MAPPINGS_FILE)
    _mappings = load_mappings()


@app.get("/__health")
async def health() -> JSONResponse:
    results = {}
    async with httpx.AsyncClient(timeout=3.0) as client:
        tasks = []
        for m in _mappings:
            url = m["upstream"] + m.get("origin_path", "")

            async def check(u: str, name: str):
                try:
                    r = await client.get(u, timeout=3.0)
                    return name, r.status_code
                except Exception:
                    return name, None

            tasks.append(check(url, m["path_prefix"]))
        done = await asyncio.gather(*tasks)
        for name, status in done:
            results[name] = status
    return JSONResponse(results)


async def stream_response(resp: httpx.Response) -> StreamingResponse:
    async def gen() -> bytes:
        async for chunk in resp.aiter_bytes():
            yield chunk

    headers = {
        k: v
        for k, v in resp.headers.items()
        if k.lower() not in (
            "content-encoding",
            "transfer-encoding",
            "connection",
        )
    }
    return StreamingResponse(gen(), status_code=resp.status_code, headers=headers)


@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy(request: Request, full_path: str) -> Response:
    path = "/" + full_path
    m_res = find_mapping(path, _mappings)
    if not m_res:
        return PlainTextResponse("Not found", status_code=404)
    mapping, remainder = m_res
    upstream = mapping["upstream"]
    origin_path = mapping.get("origin_path", "")
    target = upstream + origin_path.rstrip("/") + remainder

    LOG.info("Proxy %s -> %s", path, target)

    # Prepare headers
    headers = dict(request.headers)
    # Remove Host to let httpx set correct host for upstream
    headers.pop("host", None)

    # request body
    body = await request.body()

    async with httpx.AsyncClient(http2=True, timeout=30.0) as client:
        try:
            upstream_resp = await client.request(
                request.method,
                target,
                headers=headers,
                params=request.query_params,
                content=body,
                follow_redirects=True,
            )
        except httpx.RequestError as exc:
            LOG.error("Upstream request failed: %s", exc)
            return PlainTextResponse("Upstream request failed", status_code=502)

        return await stream_response(upstream_resp)
