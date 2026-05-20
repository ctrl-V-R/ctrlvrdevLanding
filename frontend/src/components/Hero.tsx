import React from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTypewriter } from '@/hooks/useTypewriter'

const PHRASES = [
  'building real-time tools',
  'crafting immersive experiences',
  'shipping developer utilities',
  'exploring WebXR and beyond',
  'wiring APIs end-to-end',
]

export default function Hero() {
  const typed = useTypewriter(PHRASES)

  return (
    <section className="py-12 pb-8">
      <div className="space-y-4 max-w-2xl">

        {/* Status pill */}
        <div className="fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Engineering portfolio &amp; project gateway
          </div>
        </div>

        {/* Heading */}
        <div className="fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Ctrl-V-R
          </h1>
        </div>

        {/* Typewriter terminal line */}
        <div className="fade-in-up" style={{ animationDelay: '0.25s' }}>
          <p className="font-mono text-sm text-emerald-400/75 flex items-center gap-1">
            <span className="text-muted-foreground/40 select-none">~/dev $</span>
            <span>{typed}</span>
            <span className="cursor-blink inline-block w-[2px] h-[0.9em] bg-emerald-400/75 rounded-sm align-middle" />
          </p>
        </div>

        {/* Description */}
        <div className="fade-in-up" style={{ animationDelay: '0.35s' }}>
          <p className="text-md text-muted-foreground leading-relaxed">
            Feel free to explore my projects, ranging from experimental VR prototypes to real-time collaboration demos. This is a space where I share my work in progress, side projects, and creative experiments.
          </p>
        </div>

        {/* CTA */}
        <div className="fade-in-up flex items-center gap-3 pt-2" style={{ animationDelay: '0.45s' }}>
          <Button asChild>
            <a href="#projects">
              <FolderOpen className="h-4 w-4" />
              Explore projects
            </a>
          </Button>
        </div>

      </div>
    </section>
  )
}


