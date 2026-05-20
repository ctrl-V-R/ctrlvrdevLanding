import React from 'react'
import { ExternalLink, GitBranch } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Project } from '@/data/projects'

type Props = Project & {
  icon?: React.ComponentType<{ className?: string }>
}

const statusConfig = {
  ok:      { variant: 'success'   as const, label: 'Live - Deployed' },
  down:    { variant: 'error'     as const, label: 'Down' },
  deprecated: { variant: 'warning'   as const, label: 'Deprecated' },
  progress: { variant: 'secondary' as const, label: 'In Progress' },
}

export default function ProjectCard({ title, description, path, detail, stack, highlights, repo, icon: Icon, status }: Props) {
  const { variant, label } = statusConfig[status] ?? statusConfig.down

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col transition-colors hover:bg-accent/50 cursor-pointer text-left">
          <CardHeader className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                {Icon
                  ? <Icon className="h-4 w-4 text-foreground" />
                  : <span className="text-sm font-semibold">{title.slice(0, 2).toUpperCase()}</span>
                }
              </div>
              <Badge variant={variant}>{label}</Badge>
            </div>
            <CardTitle className="mt-3 text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <span className="text-xs text-muted-foreground -ml-0.5">Click for details →</span>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
              {Icon
                ? <Icon className="h-4 w-4 text-foreground" />
                : <span className="text-sm font-semibold">{title.slice(0, 2).toUpperCase()}</span>
              }
            </div>
            <Badge variant={variant}>{label}</Badge>
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-5">
          {/* Overview */}
          <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>

          {/* Tech stack */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Highlights</p>
            <ul className="space-y-1.5">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {repo && (
            <Button variant="outline" size="sm" asChild>
              <a href={repo} target="_blank" rel="noreferrer">
                <GitBranch className="h-3.5 w-3.5" />
                Repository
              </a>
            </Button>
          )}
          <Button size="sm" asChild>
            <a href={path} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Open project
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


