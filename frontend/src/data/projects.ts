import { Zap, type LucideIcon } from 'lucide-react'

export type Project = {
  title: string
  description: string
  path: string
  detail: string
  stack: string[]
  highlights: string[]
  repo?: string
  icon?: LucideIcon
  status: 'ok' | 'down' | 'progress' | 'deprecated'
}

const projects: Project[] = [
  {
    title: 'Flowstate',
    description: 'Realtime API Orchestrator',
    icon: Zap,
    path: 'https://example-flowstate.amplifyapp.com', // TODO: replace with live URL
    detail:
      'Flowstate is a real-time collaborative whiteboard and task-flow tool. It explores WebSocket-driven state sync, optimistic UI updates, and conflict-free editing between concurrent users.',
    stack: ['Vite', 'Python FastAPI', 'WebSockets', 'Tailwind CSS', 'Amazon DynamoDB', 'AWS Amplify', 'Render'],
    highlights: [
      'Sub-100ms latency state sync via WebSockets',
      'Optimistic updates with rollback on conflict',
      'Presence indicators and cursor sharing',
    ],
    repo: 'https://github.com/ctrl-V-R/flowstate',
    status: 'ok',
  },
]

export default projects
