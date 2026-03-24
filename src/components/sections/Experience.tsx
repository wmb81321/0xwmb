import Image from 'next/image'
import type { Experience } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-anchor py-20 px-6 max-w-6xl mx-auto">
      <SectionHeader label="Experience_Logs" />

      <div className="flex flex-col gap-px">
        {experiences.map((exp) => (
          <div key={exp.id}
            className="bg-surface-container-low border border-outline-variant/20 px-6 py-5 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors">
            <div className="flex items-start gap-5">

              {/* Logo */}
              {exp.logo_url && (
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container border border-outline-variant/20 p-2">
                  <Image src={exp.logo_url} alt={exp.company} width={40} height={40}
                    className="object-contain w-full h-full grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* Role row */}
                <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
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

                {/* Bullet points */}
                <ul className="flex flex-col gap-1">
                  {exp.points.map((pt, i) => (
                    <li key={i} className="text-xs text-on-surface-variant flex gap-2 leading-relaxed">
                      <span className="text-primary-container flex-shrink-0 mt-px">▸</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
