import type { Experience } from '@/lib/types'
import { domainOf } from '@/lib/portfolio-format'
import { DocLink, DocSection, OrgMark } from '@/components/home/primitives'

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
    <DocSection id="experience" title="Experience">
      <ol>
        {experiences.map((exp, i) => (
          <li key={exp.id} className={`group reveal grid gap-2 py-6 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
            <p className="figures text-ui text-ink-muted md:col-span-2 md:whitespace-nowrap md:pt-1.5">{period(exp.years)}</p>
            <div className="md:col-span-7">
              <div className="flex items-center gap-4 md:gap-5">
                <OrgMark src={exp.logo_url} size="size-10 md:size-12" />
                <div className="min-w-0">
                  <h3 className="font-display text-title-md font-semibold">{exp.role}</h3>
                  <p className="mt-0.5 text-ui">
                    <DocLink href={exp.website}>{exp.company}</DocLink>
                    {exp.website && <span className="ml-3 text-mono-xs text-ink-muted">{domainOf(exp.website)}</span>}
                  </p>
                </div>
              </div>
              {exp.points?.length > 0 && (
                <ul className="mt-3 flex max-w-2xl flex-col gap-1.5 text-ink-muted md:pl-17">
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
