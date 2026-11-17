import type { Experience } from '@/lib/types'
import { DocSection, RecordRow } from '@/components/home/primitives'

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
          <RecordRow key={exp.id} first={i === 0} period={period(exp.years)} logo={exp.logo_url}
            role={exp.role} org={exp.company} href={exp.website}>
            {exp.points?.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {exp.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            )}
          </RecordRow>
        ))}
      </ol>
    </DocSection>
  )
}
