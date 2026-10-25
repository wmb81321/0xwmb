import { debtTotals, fmt, monthlyFixed, paidThisYear, todayISO, upcoming, type Row } from '@/lib/overview'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const shortDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(8, 10)}`

const KIND_LABEL: Record<string, string> = { subscription: 'sub', debt: 'debt', task: 'task', entity: 'entity', phone: 'line' }
const AFF_LABEL: Record<string, string> = { eps: 'HEALTH · EPS', pension: 'PENSION · AFP', cesantias: 'CESANTÍAS', arl: 'ARL', caja: 'CAJA', other: 'OTHER' }

function Totals({ totals, unknown, empty }: { totals: Record<string, number>; unknown: number; empty: string }) {
  const entries = Object.entries(totals)
  return (
    <>
      <div className="text-2xl md:text-3xl font-semibold text-primary mt-2 flex flex-col">
        {entries.length ? entries.map(([c, v]) => <span key={c}>{fmt(v)} <span className="text-sm text-on-surface-variant">{c}</span></span>) : <span className="text-outline">—</span>}
      </div>
      <div className="font-mono text-xs text-on-surface-variant mt-1">
        {unknown ? `${unknown} without amount yet` : entries.length ? 'all amounts filled' : empty}
      </div>
    </>
  )
}

export default function Overview(props: {
  subscriptions: Row[]; debts: Row[]; tasks: Row[]; entities: Row[]; phones: Row[]; affiliations: Row[]; payments: Row[]
}) {
  const today = todayISO()
  const next = upcoming(props)
  const fixed = monthlyFixed(props.subscriptions, props.debts)
  const debt = debtTotals(props.debts)
  const ytd = paidThisYear(props.payments)
  const open = props.tasks.filter((t) => t.status !== 'done')
  const high = open.filter((t) => t.priority === 'high')

  return (
    <div className="flex flex-col gap-6 mb-12">
      <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary">
        <span className="data-pulse" />Personal overview
      </h1>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-0.5">
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">PAID THIS YEAR</div>
          <Totals totals={ytd.totals} unknown={0} empty="log payments (or send invoices to Jarvis)" />
        </div>
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">FIXED SPEND / MONTH</div>
          <Totals totals={fixed.totals} unknown={fixed.unknown} empty="add amounts to subscriptions" />
        </div>
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">TOTAL DEBT</div>
          <Totals totals={debt.totals} unknown={debt.unknown} empty="add balances to debts" />
        </div>
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">OPEN TASKS</div>
          <div className="text-3xl font-semibold text-primary-container mt-2">{String(open.length).padStart(2, '0')}</div>
          <div className="font-mono text-xs text-on-surface-variant mt-1">{high.length} high priority</div>
        </div>
        <div className="bg-surface-container-low p-5">
          <div className="font-mono text-xs text-outline tracking-[0.08em]">NEXT 30 DAYS</div>
          <div className="text-3xl font-semibold text-primary mt-2">{String(next.length).padStart(2, '0')}</div>
          <div className="font-mono text-xs text-on-surface-variant mt-1">payments, renewals, deadlines</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Next 30 days */}
        <section className="bg-surface-container-low p-5 md:p-6">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xl font-semibold text-primary">Next 30 days</h2>
            <span className="font-mono text-xs text-outline">from {shortDate(today)}</span>
          </div>
          {next.length === 0 ? (
            <p className="font-mono text-sm text-outline">Nothing scheduled. Add billing days, due days or renewal dates below.</p>
          ) : (
            <ul className="flex flex-col gap-0.5 font-mono text-sm">
              {next.map((i, idx) => (
                <li key={idx} className="bg-surface-container px-3 py-3 flex gap-4 items-center">
                  <span className={`w-16 shrink-0 ${i.date === today || i.flag === 'OVERDUE' ? 'text-primary-container' : 'text-on-surface-variant'}`}>{shortDate(i.date)}</span>
                  <span className="flex-1 min-w-0 truncate text-on-surface">
                    {i.title}
                    {i.flag && <span className="text-tertiary-container"> · {i.flag}</span>}
                  </span>
                  <span className="text-on-surface-variant shrink-0">{i.amount ?? KIND_LABEL[i.kind]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Social security */}
        <section className="bg-surface-container-low p-5 md:p-6 flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-primary">Social security</h2>
          {props.affiliations.map((a) => {
            const unknown = a.status === 'unknown'
            return (
              <div key={a.id as number}
                className={`bg-surface-container p-4 flex flex-col gap-1 ${unknown ? 'shadow-[inset_0_0_0_1px_rgba(242,210,255,.35)]' : ''}`}>
                <div className="font-mono text-xs flex justify-between tracking-[0.08em]">
                  <span className="text-outline">{AFF_LABEL[a.kind as string] ?? a.kind as string}</span>
                  <span className={unknown ? 'text-tertiary-container' : a.status === 'active' ? 'text-primary-container' : 'text-outline'}>
                    {unknown ? '◌ UNKNOWN' : a.status === 'active' ? '● ACTIVE' : '○ INACTIVE'}
                  </span>
                </div>
                <div className="font-semibold text-primary">{(a.entity as string) || 'Not found yet'}</div>
                {!!a.regime && <div className="font-mono text-xs text-on-surface-variant">{a.regime as string}</div>}
                {!!a.next_action && <div className="font-mono text-xs text-tertiary-container">→ {a.next_action as string}</div>}
              </div>
            )
          })}
        </section>
      </div>

      {/* Open tasks */}
      <section className="bg-surface-container-low p-5 md:p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Open tasks</h2>
        <ul className="flex flex-col gap-0.5">
          {open.sort((a, b) => (a.priority === 'high' ? -1 : 0) - (b.priority === 'high' ? -1 : 0)).map((t) => (
            <li key={t.id as number} className="bg-surface-container px-4 py-3">
              <div className="flex justify-between gap-4">
                <span className="text-on-surface font-medium">{t.title as string}</span>
                <span className={`font-mono text-xs shrink-0 ${t.priority === 'high' ? 'text-tertiary-container' : 'text-outline'}`}>
                  {(t.priority as string).toUpperCase()} · {t.domain as string}
                </span>
              </div>
              {(t.steps as string[])?.length > 0 && (
                <ol className="mt-2 font-mono text-xs text-on-surface-variant list-decimal list-inside flex flex-col gap-0.5">
                  {(t.steps as string[]).map((s) => <li key={s}>{s}</li>)}
                </ol>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
