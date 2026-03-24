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
            className="bg-surface-container-low border border-outline-variant/20 group hover:border-outline-variant/50 transition-colors flex flex-col overflow-hidden">

            {/* Logo banner — fixed height, image covers it completely */}
            <div className="relative h-48 w-full bg-surface-container border-b border-outline-variant/30 overflow-hidden flex-shrink-0">
              {p.logo_url ? (
                <Image src={p.logo_url} alt={p.name} fill
                  className="object-cover grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline text-xs tracking-widest">
                  NO_IMAGE
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3 flex-1">

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-on-surface truncate">{p.name}</h3>
                  <p className="text-xs text-on-surface-variant">{p.role}</p>
                </div>
                <span className="text-xs text-outline font-mono flex-shrink-0">{p.years}</span>
              </div>

              {/* Brief */}
              {p.brief && (
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">{p.brief}</p>
              )}

              {/* Footer links */}
              <div className="flex gap-2 pt-2 border-t border-outline-variant/20 mt-auto items-center">
                {Object.entries(p.socials || {}).map(([key, url]) => {
                  const iconMap: Record<string, string> = {
                    linkedin: '/socials/linkdn.png',
                    twitter: '/socials/x.png',
                    github: '/socials/github.png',
                    farcaster: '/socials/farcaster.png',
                    telegram: '/socials/telegram.png',
                  }
                  const icon = iconMap[key.toLowerCase()]
                  return icon ? (
                    <a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center w-7 h-7 border border-outline-variant/20 hover:border-primary-container transition-colors">
                      <Image src={icon} alt={key} width={13} height={13} className="opacity-50 hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-outline hover:text-primary-container transition-colors capitalize">
                      {key}
                    </a>
                  )
                })}
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-outline hover:text-primary-container transition-colors ml-auto">
                    site ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
