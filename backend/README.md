# ctrlvrdev Gateway (uvicorn FastAPI)

This service implements a small path-prefix reverse-proxy gateway to route `www.ctrlvrdev.site/<project>` requests to upstream origins (Amplify, Render, etc.). Designed to run on Render or any host that runs `uvicorn`.

Quick start (local):

```bash
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Deploy to Render:
- Create a new Web Service in Render using this repository and point root to `/backend` (or set build command to `pip install -r backend/requirements.txt`).
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT` (Procfile included).

Edit `mappings.json` to add project entries (path_prefix, upstream, origin_path).
