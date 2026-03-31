'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { Project } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

const iconMap: Record<string, string> = {
  linkedin: '/socials/linkdn.png',
  twitter: '/socials/x.png',
  github: '/socials/github.png',
  farcaster: '/socials/farcaster.png',
  telegram: '/socials/telegram.png',
}

function ProjectRow({ p }: { p: Project }) {
  const [expanded, setExpanded] = useState(false)
  const hasPoints = p.points && p.points.length > 0

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors flex">

      {/* Logo — contained pillar, same style as Experience */}
      {p.logo_url && (
        <div className="flex-shrink-0 w-28 self-stretch bg-surface-container border-r border-outline-variant/30 flex items-center justify-center p-3">
          <div className="relative w-full h-16">
            <Image src={p.logo_url} alt={p.name} fill
              className="object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all" />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 px-6 py-5">
        {/* Header row */}
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="font-semibold text-on-surface text-sm">{p.name}</span>
            <span className="text-outline text-xs">—</span>
            {p.website
              ? <a href={p.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-on-surface-variant hover:text-primary-container transition-colors truncate">
                  {p.role}
                </a>
              : <span className="text-xs text-on-surface-variant truncate">{p.role}</span>
            }
          </div>
          <span className="text-xs text-outline tracking-widest flex-shrink-0 font-mono">
            {(p.start_date || p.end_date)
              ? `${p.start_date ?? ''}${p.end_date ? ` – ${p.end_date}` : ''}`
              : p.years}
          </span>
        </div>

        {/* Brief */}
        {p.brief && (
          <p className="text-xs text-on-surface-variant leading-relaxed mb-2">{p.brief}</p>
        )}

        {/* Expandable bullet points */}
        {hasPoints && (
          <>
            {expanded && (
              <ul className="flex flex-col gap-1 mb-2">
                {p.points.map((pt, i) => (
                  <li key={i} className="text-xs text-on-surface-variant flex gap-2 leading-relaxed">
                    <span className="text-primary-container flex-shrink-0 mt-px">▸</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-mono text-outline hover:text-primary-container transition-colors tracking-widest mb-2"
            >
              {expanded ? '− collapse' : '+ details'}
            </button>
          </>
        )}

        {/* Social icons */}
        {Object.keys(p.socials || {}).length > 0 && (
          <div className="flex gap-2 mt-1">
            {Object.entries(p.socials || {}).map(([key, url]) => {
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
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section-anchor py-10 px-6 max-w-6xl mx-auto">
      <SectionHeader label="PROJECTS" />

      <div className="flex flex-col gap-px">
        {projects.map((p) => (
          <ProjectRow key={p.id} p={p} />
        ))}
      </div>
    </section>
  )
}
