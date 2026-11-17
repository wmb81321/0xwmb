import type { Project } from '@/lib/types'
import { DocSection, RecordRow } from '@/components/home/primitives'

const year = (d?: string | null) => d?.match(/\d{4}/)?.[0] ?? ''

/** Same period format as Experience: "2025 to Present". */
function period(p: Project): string {
  const start = year(p.start_date) || year(p.years)
  const end = !p.end_date || /present/i.test(p.end_date) ? 'Present' : year(p.end_date)
  return [start, end].filter(Boolean).join(' to ')
}

/** Ventures, current first in admin order, set exactly like Experience rows. */
export default function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null
  const sorted = [...projects].sort((a, b) => a.order - b.order)
  return (
    <DocSection id="projects" title="Projects founded">
      <ol>
        {sorted.map((p, i) => (
          <RecordRow key={p.id} first={i === 0} period={period(p)} logo={p.logo_url}
            role={p.role} org={p.name} href={p.website}>
            {p.brief && <p>{p.brief}</p>}
          </RecordRow>
        ))}
      </ol>
    </DocSection>
  )
}
