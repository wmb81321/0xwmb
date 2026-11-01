import type { Experience } from '@/lib/types'
import { domainOf } from '@/lib/portfolio-format'
import { DocLink, DocSection } from '@/components/home/primitives'

/** "June 2025 - December 2025" → "Jun 2025 to Dec 2025" (no dashes in copy). */
function period(years?: string | null): string {
  if (!years) return ''
  return years
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g, (m) => m.slice(0, 3))
    .replace(/\s*[-–—]\s*/g, ' to ')
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null
  return (
    <DocSection id="track-record" title="Track record">
      <ol>
        {experiences.map((exp, i) => (
          <li key={exp.id} className={`reveal grid gap-3 py-8 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
            <p className="figures text-ui text-ink-muted md:col-span-2 md:whitespace-nowrap md:pt-1.5">{period(exp.years)}</p>
            <div className="md:col-span-7">
              <h3 className="font-display text-title-md font-semibold">{exp.role}</h3>
              <p className="mt-1 text-ui">
                <DocLink href={exp.website}>{exp.company}</DocLink>
                {exp.website && <span className="ml-3 text-mono-xs text-ink-muted">{domainOf(exp.website)}</span>}
              </p>
              {exp.points?.length > 0 && (
                <ul className="mt-4 flex max-w-2xl flex-col gap-2 text-ink-muted">
                  {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </DocSection>
  )
}
