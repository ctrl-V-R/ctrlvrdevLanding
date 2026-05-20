import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'

/* ── command registry ───────────────────────────────────────────── */
type Output = { text: string; className?: string }

const RESPONSES: Record<string, () => Output[] | '__clear__'> = {
  help: () => [
    { text: 'Available commands:', className: 'text-foreground font-semibold' },
    { text: '  whoami          — who built this' },
    { text: '  skills          — tech stack' },
    { text: '  projects        — project list' },
    { text: '  contact         — how to reach me' },
    { text: '  ls              — list directory' },
    { text: '  cat <file>      — read a file' },
    { text: '  pwd             — current directory' },
    { text: '  uname           — system info' },
    { text: '  date            — current date' },
    { text: '  clear           — clear terminal' },
    { text: '  (psst: there are a couple of easter eggs too)', className: 'text-muted-foreground text-xs' },
  ],

  whoami: () => [
    { text: 'ctrl-V-R', className: 'text-emerald-400 font-semibold' },
    { text: 'Software engineer. Builder of real-time tools, VR experiments,' },
    { text: 'and whatever else seems interesting at 2am.' },
    { text: 'Currently obsessed with WebXR, edge compute, and clean APIs.' },
  ],

  ls: () => [
    { text: 'projects/   skills.txt   readme.md   .secrets' },
  ],

  'ls -la': () => [
    { text: 'drwxr-xr-x   projects/' },
    { text: '-rw-r--r--   skills.txt' },
    { text: '-rw-r--r--   readme.md' },
    { text: '----------   .secrets      (nice try)', className: 'text-rose-400' },
  ],

  'cat readme.md': () => [
    { text: '# ctrl-V-R', className: 'text-foreground font-semibold' },
    { text: 'Developer. Builder. Occasional chaos agent.' },
    { text: '' },
    { text: 'This portfolio is built with React + Vite, Tailwind CSS,' },
    { text: 'shadcn/ui components, and a FastAPI reverse-proxy gateway.' },
    { text: '' },
    { text: 'Source → https://github.com/ctrl-V-R/ctrlvrdevLanding', className: 'text-sky-400 underline' },
  ],

  'cat skills.txt': () => [
    { text: 'Languages  :  TypeScript · Python · C++ · Rust (learning)', className: 'text-foreground' },
    { text: 'Frontend   :  React · Vite · Tailwind · WebGL / WebXR' },
    { text: 'Backend    :  FastAPI · Node.js · WebSockets' },
    { text: 'Cloud      :  AWS (Amplify · DynamoDB · Lambda) · Render' },
    { text: 'Tooling    :  Git · Docker · shadcn/ui · Figma' },
  ],

  'cat .secrets': () => [
    { text: 'cat: .secrets: Permission denied', className: 'text-rose-400' },
  ],

  skills: () => RESPONSES['cat skills.txt'](),

  projects: () => [
    { text: 'NAME         STATUS   DESCRIPTION', className: 'text-foreground font-semibold' },
    { text: '──────────────────────────────────────────────' },
    { text: 'flowstate    live     Realtime API orchestrator', className: 'text-emerald-400' },
    { text: '(more shipping soon)', className: 'text-muted-foreground text-xs' },
  ],

  contact: () => [
    { text: 'GitHub  :  https://github.com/ctrl-V-R', className: 'text-sky-400' },
    { text: 'Email   :  (not public — open a GitHub issue or discussion)' },
  ],

  pwd: () => [{ text: '/home/ctrl-V-R/dev' }],

  date: () => [{ text: new Date().toUTCString() }],

  uname: () => [
    { text: 'ctrlvrdev-os 2.6.0 #1 SMP dark-minimal build — All rights reserved', className: 'text-foreground' },
  ],

  clear: () => '__clear__',

  /* easter eggs */
  'sudo rm -rf /': () => [
    { text: 'sudo: seriously? no.', className: 'text-rose-400 font-semibold' },
    { text: "This isn't that kind of portfolio." },
  ],
  'sudo rm -rf *': () => [
    { text: 'sudo: permission denied (thankfully)', className: 'text-rose-400' },
  ],
  hack: () => [
    { text: 'Initialising exploit...', className: 'text-rose-400' },
    { text: '[████████████████████] 100%' },
    { text: 'ACCESS GRANTED — just kidding, this is a static site.', className: 'text-emerald-400 font-semibold' },
  ],
  'exit 0': () => [
    { text: 'logout', className: 'text-muted-foreground' },
    { text: "You can't quit — there's no shell to exit from :)", className: 'text-yellow-400' },
  ],
  vim: () => [
    { text: "vim: this terminal doesn't support vim. Use :q! to exit. (just kidding)", className: 'text-yellow-400' },
  ],
  nano: () => [{ text: 'nano: not installed. Real devs use vim anyway.', className: 'text-yellow-400' }],
  emacs: () => [{ text: 'emacs: not installed. Let the editor wars begin.', className: 'text-yellow-400' }],
}

const UNKNOWN = (cmd: string): Output[] => [
  { text: `command not found: ${cmd}`, className: 'text-rose-400' },
  { text: "Type 'help' to see available commands.", className: 'text-muted-foreground text-xs' },
]

const WELCOME: Output[] = [
  { text: '╭──────────────────────────────────────╮', className: 'text-emerald-400/60' },
  { text: "│   ctrl-V-R dev terminal  v1.0.0      │", className: 'text-emerald-400/60' },
  { text: '╰──────────────────────────────────────╯', className: 'text-emerald-400/60' },
  { text: "Type 'help' to see available commands.", className: 'text-muted-foreground' },
]

/* ── types ──────────────────────────────────────────────────────── */
type HistoryEntry = { input: string; outputs: Output[] }

/* ── component ──────────────────────────────────────────────────── */
export default function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (history.length === 0) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    setCmdHistory(h => [cmd, ...h])
    setCmdIndex(-1)

    const handler = RESPONSES[cmd]
    if (!handler) {
      setHistory(h => [...h, { input: raw, outputs: UNKNOWN(cmd) }])
      return
    }

    const result = handler()
    if (result === '__clear__') {
      setHistory([])
      return
    }
    setHistory(h => [...h, { input: raw, outputs: result as Output[] }])
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
      setCmdIndex(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdIndex - 1, -1)
      setCmdIndex(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = Object.keys(RESPONSES).find(k => k.startsWith(input) && k !== input)
      if (match) setInput(match)
    }
  }

  return (
    <div
      className="rounded-xl border bg-black/80 text-sm font-mono shadow-2xl overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5 select-none">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs text-muted-foreground">ctrl-V-R — bash</span>
      </div>

      {/* Output area */}
      <div className="h-72 overflow-y-auto p-4 space-y-0.5 cursor-text">
        {/* Welcome banner */}
        {WELCOME.map((line, i) => (
          <div key={`w${i}`} className={line.className ?? 'text-emerald-400/60'}>{line.text || '\u00A0'}</div>
        ))}

        {history.length > 0 && <div className="mt-2" />}

        {history.map((entry, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400/70 shrink-0">~/dev $</span>
              <span className="text-foreground">{entry.input}</span>
            </div>
            {entry.outputs.map((line, j) => (
              <div key={j} className={`pl-1 ${line.className ?? 'text-muted-foreground'}`}>
                {line.text || '\u00A0'}
              </div>
            ))}
          </div>
        ))}

        {/* Input row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-emerald-400/70 shrink-0">~/dev $</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground caret-emerald-400 placeholder:text-muted-foreground/40"
            placeholder="type a command…"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
