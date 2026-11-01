import type { Project } from '@/lib/types'
import { domainOf } from '@/lib/portfolio-format'
import { DocLink, DocSection } from '@/components/home/primitives'

const isRunning = (p: Project) => !p.end_date || /present/i.test(p.end_date)
const startYear = (p: Project) => p.start_date?.match(/\d{4}/)?.[0] ?? p.years?.match(/\d{4}/)?.[0] ?? ''

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null
  const sorted = [...projects].sort((a, b) => startYear(a).localeCompare(startYear(b)) || a.order - b.order)

  return (
    <DocSection id="ventures" title="Ventures founded">
      <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
        {sorted.map((p) => (
          <li key={p.id} className="flex flex-col">
            <div className="h-px bg-rule" aria-hidden />
            <h3 className="mt-4 font-display text-title-md font-semibold">{p.name}</h3>
            <p className="figures mt-1 text-mono-xs text-ink-muted">
              {[p.role, startYear(p) && `Since ${startYear(p)}`, isRunning(p) ? 'Active' : 'Closed'].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-3 text-ink-muted">{p.brief}</p>
            {p.website && <DocLink href={p.website} className="mt-4 text-ui">{domainOf(p.website)}</DocLink>}
          </li>
        ))}
      </ul>
    </DocSection>
  )
}
