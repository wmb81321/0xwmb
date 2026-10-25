import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { expiringDocs, isExpiryMilestone, todayISO, upcoming, type UpcomingItem } from '@/lib/overview'

// Daily Telegram digest, built from the data alone (no model call, no cost). Spanish, short lines.

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const short = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`
const fmt = (n: number, c: string) => `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(n)} ${c}`

function addDays(iso: string, d: number) {
  const x = new Date(`${iso}T12:00:00Z`)
  x.setUTCDate(x.getUTCDate() + d)
  return x.toISOString().slice(0, 10)
}

const line = (i: UpcomingItem) => `• ${i.title}${i.amount ? ` — ${i.amount}` : ''}${i.flag === 'OVERDUE' ? ' ⚠️ vencido' : ''}`

export async function buildDigest(): Promise<string> {
  const db = createAdminSupabaseClient()
  const today = todayISO()
  const yesterday = addDays(today, -1)

  const [subs, debts, tasks, entities, phones, pending, paidYesterday, inbox, documents] = await Promise.all([
    db.from('personal_subscriptions').select('*'),
    db.from('personal_debts').select('*'),
    db.from('personal_tasks').select('*'),
    db.from('personal_entities').select('*'),
    db.from('personal_phone_lines').select('*'),
    db.from('personal_payments').select('provider, amount, currency, due_at, status').eq('status', 'pending'),
    db.from('personal_payments').select('provider, amount, currency').eq('status', 'paid').eq('paid_at', yesterday),
    db.from('personal_inbox').select('id', { count: 'exact', head: true }).eq('status', 'needs_you'),
    db.from('personal_documents').select('id, title, area, expires_at, renew_lead_days, status'),
  ])

  const items = upcoming({
    subscriptions: subs.data ?? [], debts: debts.data ?? [], tasks: tasks.data ?? [],
    entities: entities.data ?? [], phones: phones.data ?? [], pendingBills: pending.data ?? [],
  }, 7, today)
  const todayItems = items.filter((i) => i.date === today)
  const weekItems = items.filter((i) => i.date !== today)
  const overdue = (pending.data ?? []).filter((b) => b.due_at && b.due_at < today)
  const high = (tasks.data ?? []).filter((t) => t.status !== 'done' && t.priority === 'high')

  const d = new Date(`${today}T12:00:00Z`)
  const out: string[] = [`☀️ Buenos días, William — ${DAYS[d.getUTCDay()]} ${short(today)}`]

  out.push('', todayItems.length ? '📅 Hoy' : '📅 Hoy: nada programado')
  todayItems.forEach((i) => out.push(line(i)))

  if (weekItems.length) {
    out.push('', '🗓 Próximos 7 días')
    weekItems.forEach((i) => out.push(`${line(i).replace('• ', `• ${short(i.date)} · `)}`))
  }

  if (overdue.length) {
    out.push('', `⚠️ Facturas vencidas (${overdue.length})`)
    overdue.forEach((b) => out.push(`• ${b.provider}${b.amount ? ` — ${fmt(Number(b.amount), b.currency)}` : ''} · vencía ${short(b.due_at)}`))
  }

  if (high.length) {
    out.push('', `🎯 Prioridad alta (${high.length})`)
    high.slice(0, 5).forEach((t) => out.push(`• ${t.title}`))
  }

  const docs = expiringDocs(documents.data ?? [], today).filter((d) => isExpiryMilestone(d.daysLeft))
  if (docs.length) {
    out.push('', '🪪 Documentos')
    docs.forEach((d) => out.push(`• ${d.title} — ${d.expired ? `venció hace ${-d.daysLeft} días` : d.daysLeft === 0 ? 'vence hoy' : `vence en ${d.daysLeft} días (${short(d.expires_at)})`}`))
  }

  const paid = paidYesterday.data ?? []
  if (paid.length) {
    out.push('', '💸 Pagado ayer')
    paid.forEach((p) => out.push(`• ${p.provider} — ${fmt(Number(p.amount), p.currency)}`))
  }

  if (inbox.count) out.push('', `📨 ${inbox.count} correo(s) en el inbox te necesitan`)

  if (!todayItems.length && !weekItems.length && !overdue.length && !high.length && !inbox.count && !docs.length) {
    out.push('', '✨ Nada urgente esta semana.')
  }
  out.push('', 'Escríbeme si quieres registrar algo o revisar un tema.')
  return out.join('\n')
}
