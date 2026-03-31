'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { Experience } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

function ExperienceRow({ exp }: { exp: Experience }) {
  const [expanded, setExpanded] = useState(false)
  const hasPoints = exp.points && exp.points.length > 0

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors flex">

      {/* Logo — contained pillar */}
      {exp.logo_url && (
        <div className="flex-shrink-0 w-28 self-stretch bg-surface-container border-r border-outline-variant/30 flex items-center justify-center p-3">
          <div className="relative w-full h-16">
            <Image src={exp.logo_url} alt={exp.company} fill
              className="object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all" />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 px-6 py-5">
        {/* Role row */}
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="font-semibold text-on-surface text-sm">{exp.role}</span>
            <span className="text-outline text-xs">—</span>
            {exp.website
              ? <a href={exp.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-on-surface-variant hover:text-primary-container transition-colors truncate">
                  {exp.company}
                </a>
              : <span className="text-xs text-on-surface-variant truncate">{exp.company}</span>
            }
          </div>
          <span className="text-xs text-outline tracking-widest flex-shrink-0 font-mono">{exp.years}</span>
        </div>

        {/* Expandable bullets */}
        {hasPoints && (
          <>
            {expanded && (
              <ul className="flex flex-col gap-1 mt-3">
                {exp.points.map((pt, i) => (
                  <li key={i} className="text-xs text-on-surface-variant flex gap-2 leading-relaxed">
                    <span className="text-primary-container flex-shrink-0 mt-px">▸</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs font-mono text-outline hover:text-primary-container transition-colors tracking-widest"
            >
              {expanded ? '− collapse' : '+ expand'}
            </button>
          </>
        )}

        {/* Social icons */}
        {(exp.linkedin || exp.twitter) && (
          <div className="flex gap-2 mt-3">
            {exp.linkedin && (
              <a href={exp.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 border border-outline-variant/20 hover:border-primary-container transition-colors">
                <Image src="/socials/linkdn.png" alt="LinkedIn" width={13} height={13} className="opacity-50 hover:opacity-100 transition-opacity" />
              </a>
            )}
            {exp.twitter && (
              <a href={exp.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 border border-outline-variant/20 hover:border-primary-container transition-colors">
                <Image src="/socials/x.png" alt="X / Twitter" width={13} height={13} className="opacity-50 hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-anchor py-10 px-6 max-w-6xl mx-auto">
      <SectionHeader label="Experience_Logs" />

      <div className="flex flex-col gap-px">
        {experiences.map((exp) => (
          <ExperienceRow key={exp.id} exp={exp} />
        ))}
      </div>
    </section>
  )
}
