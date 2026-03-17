import Image from 'next/image'
import type { Project } from '@/lib/types'

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3 hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {p.logo_url && (
                  <Image src={p.logo_url} alt={p.name} width={32} height={32}
                    className="rounded border border-border object-contain bg-surface-2 p-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <span className="text-xs text-text-dim">{p.role}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-muted flex-shrink-0">{p.years}</span>
            </div>
            <p className="text-xs text-text-dim">{p.brief}</p>
            <ul className="flex flex-col gap-1">
              {p.points.slice(0, 2).map((pt, i) => (
                <li key={i} className="text-xs text-text-dim flex gap-2">
                  <span className="text-accent flex-shrink-0">·</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-auto pt-2 border-t border-border">
              {Object.entries(p.socials || {}).map(([key, url]) => (
                <a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-muted hover:text-accent transition-colors capitalize">{key}</a>
              ))}
              <a href={p.website} target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono text-muted hover:text-accent transition-colors ml-auto">site →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
