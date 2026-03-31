import Image from 'next/image'
import type { Achievement } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'
import WebIcon from '@/components/WebIcon'

export default function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null

  return (
    <section id="achievements" className="section-anchor py-10 px-6 max-w-6xl mx-auto">
      <SectionHeader label="Achievements" />

      <div className="flex flex-col gap-px">
        {achievements.map((a) => (
          <div key={a.id}
            className="bg-surface-container-low border border-outline-variant/20 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors flex items-center gap-5 px-6 py-5">

            {a.logo_url && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src={a.logo_url} alt={a.title} fill
                  className="object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <p className="text-sm font-semibold text-on-surface">{a.title}</p>
                {a.year && (
                  <span className="text-xs text-outline font-mono flex-shrink-0">{a.year}</span>
                )}
              </div>
              {a.description && (
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{a.description}</p>
              )}
            </div>

            {a.link && (
              <a href={a.link} target="_blank" rel="noopener noreferrer"
                className="text-outline hover:text-primary-container transition-colors flex-shrink-0">
                <WebIcon />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
