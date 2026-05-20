import React from 'react'
import { Header, ProjectCard, Hero, Footer } from './components'
import AmbientBackground from './components/AmbientBackground'
import InteractiveTerminal from './components/InteractiveTerminal'
import projectsData from './data/projects'

export default function App() {
  const projects = projectsData

  return (
    <div className="min-h-screen bg-background">
      <AmbientBackground />
      <div className="max-w-4xl mx-auto px-6 py-4">
        <Header />

        <Hero />

        <section id="projects">
          <h2 className="fade-in-up text-xs text-muted-foreground uppercase tracking-widest mb-4" style={{ animationDelay: '0.1s' }}>Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p, i) => (
              <div key={p.path} className="fade-in-up" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                <ProjectCard {...p} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Terminal</h2>
          <InteractiveTerminal />
        </section>

        <Footer />
      </div>
    </div>
  )
}
