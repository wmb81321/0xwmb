export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { AREAS } from '../../../areas'
import { areaSummaries } from '@/lib/areas-status'
import AdminDashboard from '../../../AdminDashboard'

const STATUS: Record<string, { label: string; cls: string }> = {
  alert: { label: '◌ NEEDS YOU', cls: 'text-tertiary-container' },
  ok: { label: '● UP TO DATE', cls: 'text-primary-container' },
  empty: { label: '○ NOT STARTED', cls: 'text-outline' },
}

// One template for every area: header, three cards, then the area's editor tabs.
export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = AREAS.find((a) => a.slug === slug)
  if (!area) notFound()
  const s = (await areaSummaries()).find((x) => x.slug === slug)!
  const st = STATUS[s.status]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary">
            <span className="data-pulse" />{area.name}
          </h1>
          <p className="text-on-surface-variant mt-2">{area.blurb}</p>
        </div>
        <span className={`font-mono text-xs tracking-[0.08em] ${st.cls}`}>{st.label}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5">
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">NEXT DEADLINE</div>
          <div className="text-xl font-semibold text-primary mt-2">{s.nextDeadline?.date ?? '—'}</div>
          <div className="font-mono text-xs text-on-surface-variant mt-1 truncate">{s.nextDeadline?.title ?? 'no dated tasks'}</div>
        </div>
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">OPEN TASKS</div>
          <div className="text-3xl font-semibold text-primary-container mt-2">{String(s.openTasks).padStart(2, '0')}</div>
          <div className="font-mono text-xs text-on-surface-variant mt-1">{s.highTasks} high priority</div>
        </div>
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">RECORDS</div>
          <div className="text-3xl font-semibold text-primary mt-2">{String(s.records).padStart(2, '0')}</div>
          <div className="font-mono text-xs text-on-surface-variant mt-1">across {area.tabs.length} lists</div>
        </div>
      </div>

      <div className="bg-surface-container-low p-4 font-mono text-xs text-on-surface-variant">
        <span className="text-primary-container">ASK JARVIS · {area.name.toUpperCase()}</span> — message @williamartinezbot on Telegram,
        e.g. “{area.slug === 'taxes' ? '¿Cuándo vence mi declaración de renta?' : area.slug === 'finances' ? '¿Cuánto llevo pagado este año?' : `Agrega algo en ${area.name}`}”
      </div>

      {area.tabs.length ? (
        <AdminDashboard key={area.slug} tabs={area.tabs} title="" />
      ) : (
        <div className="bg-surface-container-low p-6 font-mono text-sm text-outline">
          Not started yet. Tell Jarvis about it, or this area gets its own lists in a later phase.
        </div>
      )}
    </div>
  )
}
