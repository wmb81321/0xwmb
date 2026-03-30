import Image from 'next/image'
import type { Education } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="section-anchor">
      <SectionHeader label="Education" />

      <div className="flex flex-col gap-px">
        {education.map((e) => {
          const period = (e.start_date || e.end_date)
            ? `${e.start_date ?? ''}${e.end_date ? ` – ${e.end_date}` : ''}`
            : e.years

          return (
            <div key={e.id}
              className="bg-surface-container-low border border-outline-variant/20 px-5 py-4 flex items-start gap-4 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors">
              {e.logo_url && (
                <div className="relative w-10 h-10 flex-shrink-0 mt-0.5">
                  <Image src={e.logo_url} alt={e.institution} fill
                    className="object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="text-sm font-semibold text-on-surface">{e.degree}</h3>
                  <span className="text-xs text-outline font-mono flex-shrink-0">{period}</span>
                </div>
                {e.field_of_study && (
                  <p className="text-xs text-primary-container mt-0.5">{e.field_of_study}</p>
                )}
                <p className="text-xs text-on-surface-variant mt-0.5">{e.institution}</p>
                {e.abroad_program && (
                  <p className="text-xs text-outline mt-1">{e.abroad_program}</p>
                )}
                {(e.website || e.linkedin || e.twitter) && (
                  <div className="flex items-center gap-3 mt-2">
                    {e.website && (
                      <a href={e.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-outline hover:text-primary-container transition-colors">↗</a>
                    )}
                    {e.linkedin && (
                      <a href={e.linkedin} target="_blank" rel="noopener noreferrer">
                        <Image src="/socials/linkdn.png" alt="LinkedIn" width={12} height={12}
                          className="opacity-40 hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {e.twitter && (
                      <a href={e.twitter} target="_blank" rel="noopener noreferrer">
                        <Image src="/socials/x.png" alt="X" width={12} height={12}
                          className="opacity-40 hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
