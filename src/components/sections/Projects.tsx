import Image from 'next/image'
import type { Project } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section-anchor py-20 px-6 max-w-6xl mx-auto">
      <SectionHeader label="PROJECTS" />

      <div className="grid md:grid-cols-3 gap-px">
        {projects.map((p) => (
          <div key={p.id}
            className="bg-surface-container-low border border-outline-variant/20 p-5 flex flex-col gap-4 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors">

            {/* Card header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {p.logo_url && (
                  <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-surface-container border border-outline-variant/20 p-2">
                    <Image src={p.logo_url} alt={p.name} width={36} height={36}
                      className="object-contain w-full h-full grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-on-surface truncate">{p.name}</h3>
                  <p className="text-xs text-on-surface-variant">{p.role}</p>
                </div>
              </div>
              <span className="text-xs text-outline font-mono flex-shrink-0">{p.years}</span>
            </div>

            {/* Brief */}
            {p.brief && (
              <p className="text-xs text-on-surface-variant leading-relaxed">{p.brief}</p>
            )}

            {/* Bullets */}
            <ul className="flex flex-col gap-1 flex-1">
              {p.points.slice(0, 2).map((pt, i) => (
                <li key={i} className="text-xs text-on-surface-variant flex gap-2 leading-relaxed">
                  <span className="text-primary-container flex-shrink-0">▸</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Footer links */}
            <div className="flex gap-3 pt-3 border-t border-outline-variant/20 mt-auto">
              {Object.entries(p.socials || {}).map(([key, url]) => (
                <a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-outline hover:text-primary-container transition-colors capitalize tracking-widest">
                  {key}
                </a>
              ))}
              {p.website && (
                <a href={p.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-outline hover:text-primary-container transition-colors ml-auto">
                  site ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
