import Image from 'next/image'
import type { Education } from '@/lib/types'

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Education</h2>
      <div className="flex flex-col gap-6">
        {education.map((e) => (
          <div key={e.id} className="flex gap-4">
            {e.logo_url && (
              <Image src={e.logo_url} alt={e.institution} width={40} height={40}
                className="rounded border border-border object-contain flex-shrink-0 mt-1 bg-surface p-1" />
            )}
            <div>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="font-semibold text-sm">{e.degree}</h3>
                <span className="text-xs font-mono text-muted">{e.years}</span>
              </div>
              <p className="text-sm text-text-dim">{e.institution}</p>
              {e.abroad_program && (
                <p className="text-xs text-muted mt-1 italic">{e.abroad_program}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {e.website && (
                  <a href={e.website} target="_blank" rel="noopener noreferrer" title="Website"
                    className="text-xs font-mono text-muted hover:text-accent transition-colors">↗</a>
                )}
                {e.linkedin && (
                  <a href={e.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <Image src="/socials/linkdn.png" alt="LinkedIn" width={14} height={14} className="opacity-50 hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {e.twitter && (
                  <a href={e.twitter} target="_blank" rel="noopener noreferrer" title="X / Twitter">
                    <Image src="/socials/x.png" alt="X" width={14} height={14} className="opacity-50 hover:opacity-100 transition-opacity" />
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
