import Link from 'next/link'
import { AREAS } from '../areas'
import type { AreaSummary } from '@/lib/areas-status'

const DOT: Record<string, string> = {
  alert: 'bg-tertiary-container', ok: 'bg-primary-container', empty: 'bg-surface-bright',
}

// Grid of area tiles with status, open tasks and next deadline.
export default function AreaTiles({ summaries }: { summaries: AreaSummary[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-0.5">
      {AREAS.map((a) => {
        const s = summaries.find((x) => x.slug === a.slug)
        return (
          <Link key={a.slug} href={`/admin/areas/${a.slug}`}
            className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">{a.name}</span>
              <span className={`w-2 h-2 rounded-full ${DOT[s?.status ?? 'empty']}`} />
            </div>
            <span className="text-sm text-on-surface-variant">{a.blurb}</span>
            <span className="font-mono text-xs text-outline">
              {s?.status === 'empty' ? 'not started' : `${s?.records ?? 0} records · ${s?.openTasks ?? 0} open tasks`}
              {s?.nextDeadline ? ` · next ${s.nextDeadline.date}` : ''}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
