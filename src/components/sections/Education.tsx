import Image from 'next/image'
import type { Education } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="section-anchor">
      <SectionHeader label="Education_Cert" />

      <div className="flex flex-col gap-px">
        {education.map((e) => (
          <div key={e.id}
            className="bg-surface-container-low border border-outline-variant/20 px-5 py-4 flex gap-4 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors">
            {e.logo_url && (
              <Image src={e.logo_url} alt={e.institution} width={32} height={32}
                className="object-contain flex-shrink-0 mt-0.5 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="text-sm font-semibold text-on-surface">{e.degree}</h3>
                <span className="text-xs text-outline font-mono flex-shrink-0">{e.years}</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{e.institution}</p>
              {e.abroad_program && (
                <p className="text-xs text-outline mt-1">{e.abroad_program}</p>
              )}
              {e.website && (
                <a href={e.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-outline hover:text-primary-container transition-colors mt-1 inline-block">↗</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
