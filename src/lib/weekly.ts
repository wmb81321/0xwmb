import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { debtTotals, expiringDocs, monthlyFixed, todayISO, upcoming, type Row } from '@/lib/overview'

// Weekly Telegram summary (Sundays), built from the data alone — no model call. Spanish, short lines.

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const short = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`
const money = (n: number, c: string) => `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(n)} ${c}`

function addDays(iso: string, d: number) {
  const x = new Date(`${iso}T12:00:00Z`)
  x.setUTCDate(x.getUTCDate() + d)
  return x.toISOString().slice(0, 10)
}

// Sum amounts per currency, optionally only rows paid on or after `from`.
function byCurrency(rows: Row[], from?: string) {
  const t: Record<string, number> = {}
  for (const r of rows) {
    if (from && (r.paid_at as string) < from) continue
    const c = (r.currency as string) || '?'
    t[c] = (t[c] ?? 0) + Number(r.amount ?? 0)
  }
  return t
}
const totalsLine = (t: Record<string, number>) => Object.entries(t).map(([c, v]) => money(v, c)).join(' · ') || '—'

export async function buildWeekly(): Promise<string> {
  const db = createAdminSupabaseClient()
  const today = todayISO()
  const weekStart = addDays(today, -6) // the last 7 days including today
  const monthStart = `${today.slice(0, 7)}-01`
  const yearStart = `${today.slice(0, 4)}-01-01`

  const [paid, subs, debts, tasks, entities, phones, pending, documents, health, inboxWeek, inboxNeeds, usage] = await Promise.all([
    db.from('personal_payments').select('provider, amount, currency, paid_at').eq('status', 'paid').gte('paid_at', yearStart),
    db.from('personal_subscriptions').select('*'),
    db.from('personal_debts').select('*'),
    db.from('personal_tasks').select('*'),
    db.from('personal_entities').select('*'),
    db.from('personal_phone_lines').select('*'),
    db.from('personal_payments').select('provider, amount, currency, due_at, status').eq('status', 'pending'),
    db.from('personal_documents').select('id, title, area, expires_at, renew_lead_days, status'),
    db.from('personal_health').select('title, provider, scheduled_at, status').eq('status', 'scheduled'),
    db.from('personal_inbox').select('category, status').gte('received_at', `${weekStart}T00:00:00-05:00`),
    db.from('personal_inbox').select('id', { count: 'exact', head: true }).eq('status', 'needs_you'),
    db.from('personal_ai_usage').select('cost_usd, route').gte('at', `${weekStart}T00:00:00-05:00`),
  ])

  const payments = paid.data ?? []
  const week = payments.filter((p) => (p.paid_at as string) >= weekStart)
  const allTasks = tasks.data ?? []
  const done = allTasks.filter((t) => t.status === 'done' && t.done_at && String(t.done_at).slice(0, 10) >= weekStart)
  const open = allTasks.filter((t) => t.status !== 'done')
  const fixed = monthlyFixed(subs.data ?? [], debts.data ?? [])
  const debt = debtTotals(debts.data ?? [])
  const next = upcoming({
    subscriptions: subs.data ?? [], debts: debts.data ?? [], tasks: allTasks, entities: entities.data ?? [],
    phones: phones.data ?? [], pendingBills: pending.data ?? [], health: health.data ?? [],
  }, 7, addDays(today, 1))
  const docs = expiringDocs(documents.data ?? [], today)
  const mail = inboxWeek.data ?? []
  const bills = mail.filter((m) => m.category === 'bill' || m.category === 'receipt').length
  const noise = mail.filter((m) => m.category === 'noise').length
  const aiCost = (usage.data ?? []).reduce((s, u) => s + Number(u.cost_usd ?? 0), 0)

  const out: string[] = [`📊 Resumen semanal — ${short(weekStart)} al ${short(today)}`]

  out.push('', '💸 Gastos')
  out.push(`• Esta semana: ${totalsLine(byCurrency(week))}${week.length ? ` (${week.length} pagos)` : ''}`)
  week.slice(0, 8).forEach((p) => out.push(`   – ${p.provider} ${money(Number(p.amount), p.currency as string)} · ${short(p.paid_at as string)}`))
  out.push(`• Este mes: ${totalsLine(byCurrency(payments, monthStart))}`)
  out.push(`• Este año: ${totalsLine(byCurrency(payments))}`)
  out.push(`• Fijos por mes: ${totalsLine(fixed.totals)}${fixed.unknown ? ` (+${fixed.unknown} sin monto)` : ''}`)
  if (Object.keys(debt.totals).length) out.push(`• Deuda total: ${totalsLine(debt.totals)}`)

  out.push('', '✅ Tareas')
  out.push(`• Completadas esta semana: ${done.length}`)
  done.slice(0, 5).forEach((t) => out.push(`   – ${t.title}`))
  out.push(`• Abiertas: ${open.length} (${open.filter((t) => t.priority === 'high').length} de prioridad alta)`)

  out.push('', next.length ? '🗓 La próxima semana' : '🗓 La próxima semana: nada programado')
  next.forEach((i) => out.push(`• ${short(i.date)} · ${i.title}${i.amount ? ` — ${i.amount}` : ''}${i.flag === 'OVERDUE' ? ' ⚠️ vencido' : ''}`))

  if (docs.length) {
    out.push('', '🪪 Documentos por renovar')
    docs.forEach((d) => out.push(`• ${d.title} — ${d.expired ? `venció hace ${-d.daysLeft} días` : `vence en ${d.daysLeft} días (${short(d.expires_at)})`}`))
  }

  out.push('', '📨 Inbox')
  out.push(`• Esta semana: ${mail.length} correos (${bills} facturas/recibos, ${noise} promociones archivadas)`)
  if (inboxNeeds.count) out.push(`• ${inboxNeeds.count} te necesitan`)

  out.push('', `🤖 Jarvis: ${(usage.data ?? []).length} mensajes · ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 }).format(aiCost)} esta semana`)
  out.push('', '¡Buen domingo! Escríbeme si quieres revisar algo.')
  return out.join('\n')
}
