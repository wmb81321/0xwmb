// Pure helpers for the Personal overview: upcoming events and monthly totals.
// Dates are computed in America/Bogota so "today" matches where William lives.

export type Row = Record<string, unknown>

export interface UpcomingItem {
  date: string // YYYY-MM-DD
  title: string
  kind: 'subscription' | 'debt' | 'task' | 'entity' | 'phone'
  amount?: string
  flag?: string
}

const TZ = 'America/Bogota'
const MONTHLY: Record<string, number> = { weekly: 52 / 12, monthly: 1, quarterly: 1 / 3, yearly: 1 / 12 }

export function todayISO(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Next occurrence of a day-of-month on or after `from` (clamped to month length).
function nextMonthlyDate(day: number, from: string): string {
  const [y, m] = from.split('-').map(Number)
  for (let i = 0; i < 2; i++) {
    const year = y + Math.floor((m - 1 + i) / 12)
    const month = ((m - 1 + i) % 12) + 1
    const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(Math.min(day, last)).padStart(2, '0')}`
    if (iso >= from) return iso
  }
  return from
}

const num = (v: unknown) => (v === null || v === undefined || v === '' ? null : Number(v))
const money = (amount: unknown, currency: unknown) => {
  const n = num(amount)
  if (n === null) return undefined
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)} ${currency ?? ''}`.trim()
}

export function upcoming(
  data: { subscriptions: Row[]; debts: Row[]; tasks: Row[]; entities: Row[]; phones: Row[]; pendingBills?: Row[] },
  days = 30,
  from = todayISO(),
): UpcomingItem[] {
  const until = addDays(from, days)
  const items: UpcomingItem[] = []
  const inRange = (d?: string | null) => !!d && d >= from && d <= until

  for (const s of data.subscriptions) {
    if (s.status === 'cancelled' || s.status === 'paused') continue
    const date = (s.next_renewal as string) || (num(s.billing_day) ? nextMonthlyDate(num(s.billing_day)!, from) : null)
    if (inRange(date)) items.push({ date: date!, title: s.provider as string, kind: 'subscription', amount: money(s.amount, s.currency) })
  }
  for (const d of data.debts) {
    if (d.status === 'paid' || !num(d.due_day)) continue
    const date = nextMonthlyDate(num(d.due_day)!, from)
    if (inRange(date)) items.push({ date, title: `${d.creditor} payment`, kind: 'debt', amount: money(d.min_payment, d.currency) })
  }
  for (const b of data.pendingBills ?? []) {
    const date = b.due_at as string | null
    // Unpaid bills surface by their last day to pay; overdue ones are pinned to today.
    if (date && date <= until) items.push({ date: date < from ? from : date, title: `${b.provider} bill due`, kind: 'debt', amount: money(b.amount, b.currency), flag: date < from ? 'OVERDUE' : 'UNPAID' })
  }
  for (const t of data.tasks) {
    if (t.status === 'done' || !t.due_at) continue
    const date = t.due_at as string
    // Overdue tasks surface too, pinned to today.
    if (date <= until) items.push({ date: date < from ? from : date, title: t.title as string, kind: 'task', flag: date < from ? 'OVERDUE' : undefined })
  }
  for (const e of data.entities) {
    const date = e.next_obligation_due as string | null
    if (inRange(date)) items.push({ date: date!, title: `${e.name}: ${e.next_obligation ?? 'obligation'}`, kind: 'entity' })
  }
  for (const p of data.phones) {
    const date = (p.expires_at as string) || (num(p.billing_day) ? nextMonthlyDate(num(p.billing_day)!, from) : null)
    const twofa = (p.used_for_2fa as string[] | null)?.length ? '2FA LINE' : undefined
    if (inRange(date)) items.push({ date: date!, title: `${p.label} renews`, kind: 'phone', flag: twofa })
  }
  return items.sort((a, b) => a.date.localeCompare(b.date))
}

// Fixed monthly cost per currency: active subscriptions (normalized by cadence) + debt minimum payments.
export function monthlyFixed(subscriptions: Row[], debts: Row[]) {
  const totals: Record<string, number> = {}
  let unknown = 0
  for (const s of subscriptions) {
    if (s.status === 'cancelled' || s.status === 'paused') continue
    const a = num(s.amount)
    if (a === null) { unknown++; continue }
    const c = (s.currency as string) || '?'
    totals[c] = (totals[c] ?? 0) + a * (MONTHLY[s.cadence as string] ?? 1)
  }
  for (const d of debts) {
    if (d.status === 'paid') continue
    const a = num(d.min_payment)
    if (a === null) { unknown++; continue }
    const c = (d.currency as string) || '?'
    totals[c] = (totals[c] ?? 0) + a
  }
  return { totals, unknown }
}

export function debtTotals(debts: Row[]) {
  const totals: Record<string, number> = {}
  let unknown = 0
  for (const d of debts) {
    if (d.status === 'paid') continue
    const b = num(d.balance)
    if (b === null) { unknown++; continue }
    const c = (d.currency as string) || '?'
    totals[c] = (totals[c] ?? 0) + b
  }
  return { totals, unknown, count: debts.filter((d) => d.status !== 'paid').length }
}

export const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

// Sum of payments since Jan 1 (Bogota time) per currency.
export function paidThisYear(payments: Row[], from = todayISO()) {
  const start = `${from.slice(0, 4)}-01-01`
  const totals: Record<string, number> = {}
  let count = 0
  for (const p of payments) {
    if (p.status === 'pending' || !p.paid_at || (p.paid_at as string) < start) continue
    const a = num(p.amount)
    if (a === null) continue
    const c = (p.currency as string) || '?'
    totals[c] = (totals[c] ?? 0) + a
    count++
  }
  return { totals, count }
}
