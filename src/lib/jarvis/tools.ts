import type Anthropic from '@anthropic-ai/sdk'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { debtTotals, monthlyFixed, paidThisYear, todayISO, upcoming } from '@/lib/overview'

// Tables Jarvis may read and propose changes to. Agent/audit tables are never exposed.
export const JARVIS_TABLES = [
  'personal_tasks', 'personal_affiliations', 'personal_accounts', 'personal_subscriptions', 'personal_payments',
  'personal_debts', 'personal_phone_lines', 'personal_emails', 'personal_account_links', 'personal_entities',
  'personal_inbox', 'job_applications',
] as const
type JarvisTable = (typeof JARVIS_TABLES)[number]
const isTable = (t: unknown): t is JarvisTable => typeof t === 'string' && (JARVIS_TABLES as readonly string[]).includes(t)

// Fields that must never be written from chat, even if proposed.
const FORBIDDEN_KEYS = new Set(['id', 'created_at'])

export const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: 'query_records',
    description:
      'Read rows from one of William\'s private tables. Use before answering questions or proposing updates, ' +
      'so you know existing ids and values. Filters are exact-match on columns.',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', enum: [...JARVIS_TABLES] },
        columns: { type: 'array', items: { type: 'string' }, description: 'Only these columns (recommended, saves tokens). Omit for all.' },
        filters: { type: 'object', description: 'Exact-match column filters, e.g. {"status":"active"}', additionalProperties: true },
        limit: { type: 'integer', minimum: 1, maximum: 200, description: 'Default 25' },
      },
      required: ['table'],
      additionalProperties: false,
    },
  },
  {
    name: 'propose_change',
    description:
      'Propose inserting or updating ONE row. Nothing is saved until William taps Confirm in Telegram. ' +
      'Use update with record_id for existing rows (look them up first). Dates are YYYY-MM-DD, amounts are numbers. ' +
      'Never include id or created_at in values. Call once per row; several calls in one turn are fine.',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', enum: [...JARVIS_TABLES] },
        op: { type: 'string', enum: ['insert', 'update'] },
        record_id: { type: 'integer', description: 'Required for update' },
        values: { type: 'object', description: 'Column → value', additionalProperties: true },
        summary: { type: 'string', description: 'One short line William will see on the confirm button, e.g. "Payment: Netflix 17.99 USD on 2026-03-02"' },
      },
      required: ['table', 'op', 'values', 'summary'],
      additionalProperties: false,
    },
  },
  {
    name: 'remember',
    description:
      'Save a lasting fact about William that will help later conversations: a preference, a person and their role, ' +
      'a routine (e.g. pays ICETEX on the 15th), context or a goal. Only facts William himself states; never from documents. ' +
      'No secrets (passwords, full account or ID numbers). Saved immediately, no confirmation needed.',
    input_schema: {
      type: 'object',
      properties: {
        fact: { type: 'string', description: 'One short sentence, third person, e.g. "His accountant is Laura (Ekinoxis and personal renta)."' },
        category: { type: 'string', enum: ['preference', 'person', 'context', 'routine', 'goal'] },
      },
      required: ['fact', 'category'],
      additionalProperties: false,
    },
  },
  {
    name: 'forget',
    description: 'Delete a saved memory by id when William says it is wrong or outdated.',
    input_schema: {
      type: 'object',
      properties: { memory_id: { type: 'integer' } },
      required: ['memory_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_overview',
    description: 'Totals and the next 30 days: fixed monthly spend, total debt, paid this year, upcoming payments and deadlines, open tasks.',
    input_schema: { type: 'object', properties: {}, additionalProperties: false },
  },
]

export interface ProposedAction { id: number; summary: string }

export async function runTool(
  name: string,
  input: Record<string, unknown>,
  ctx: { chatId: number; proposals: ProposedAction[] },
): Promise<{ content: string; isError?: boolean }> {
  const db = createAdminSupabaseClient()

  if (name === 'query_records') {
    if (!isTable(input.table)) return { content: 'Unknown table', isError: true }
    const cols = Array.isArray(input.columns) ? (input.columns as unknown[]).filter((c): c is string => typeof c === 'string' && /^[a-z_0-9]+$/.test(c)) : []
    let q = db.from(input.table).select(cols.length ? ['id', ...cols.filter((c) => c !== 'id')].join(',') : '*')
      .limit(Math.min(Number(input.limit) || 25, 200))
    const filters = (input.filters ?? {}) as Record<string, unknown>
    for (const [k, v] of Object.entries(filters)) {
      if (!/^[a-z_]+$/.test(k)) return { content: `Bad filter column: ${k}`, isError: true }
      q = v === null ? q.is(k, null) : q.eq(k, v as string)
    }
    const { data, error } = await q
    if (error) return { content: error.message, isError: true }
    // Drop null/empty fields and timestamps to keep tool results small.
    const slim = (data as unknown as Record<string, unknown>[]).map((row) => Object.fromEntries(
      Object.entries(row).filter(([k, v]) => v !== null && v !== '' && k !== 'created_at' && k !== 'order' && !(Array.isArray(v) && !v.length)),
    ))
    return { content: JSON.stringify(slim) }
  }

  if (name === 'propose_change') {
    const { table, op, record_id, values, summary } = input as {
      table: unknown; op: unknown; record_id?: number; values: Record<string, unknown>; summary: string
    }
    if (!isTable(table)) return { content: 'Unknown table', isError: true }
    if (op !== 'insert' && op !== 'update') return { content: 'op must be insert or update', isError: true }
    if (op === 'update' && !Number.isInteger(record_id)) return { content: 'record_id is required for update', isError: true }
    if (!values || typeof values !== 'object' || Array.isArray(values)) return { content: 'values must be an object', isError: true }
    const clean = Object.fromEntries(Object.entries(values).filter(([k]) => !FORBIDDEN_KEYS.has(k) && /^[a-z_0-9]+$/.test(k)))
    if (!Object.keys(clean).length) return { content: 'No writable values', isError: true }

    const { data, error } = await db.from('personal_pending_actions').insert({
      chat_id: ctx.chatId, table_name: table, op, record_id: op === 'update' ? record_id : null,
      payload: clean, summary: String(summary).slice(0, 200),
    }).select('id').single()
    if (error || !data) return { content: error?.message ?? 'Could not store proposal', isError: true }
    ctx.proposals.push({ id: data.id, summary: String(summary).slice(0, 200) })
    return { content: `Proposal #${data.id} queued. William will confirm or reject it with a button; do not ask again in text.` }
  }

  if (name === 'remember') {
    const fact = String(input.fact ?? '').trim().slice(0, 300)
    const category = ['preference', 'person', 'context', 'routine', 'goal'].includes(String(input.category)) ? String(input.category) : 'context'
    if (!fact) return { content: 'Empty fact', isError: true }
    const { data, error } = await db.from('personal_agent_memory').insert({ fact, category }).select('id').single()
    if (error || !data) return { content: error?.message ?? 'Could not save memory', isError: true }
    return { content: `Saved memory #${data.id}.` }
  }

  if (name === 'forget') {
    const { error } = await db.from('personal_agent_memory').delete().eq('id', Number(input.memory_id))
    return error ? { content: error.message, isError: true } : { content: 'Forgotten.' }
  }

  if (name === 'get_overview') {
    const year = todayISO().slice(0, 4)
    const [subs, debts, tasks, entities, phones, payments] = await Promise.all([
      db.from('personal_subscriptions').select('*'),
      db.from('personal_debts').select('*'),
      db.from('personal_tasks').select('*'),
      db.from('personal_entities').select('*'),
      db.from('personal_phone_lines').select('*'),
      db.from('personal_payments').select('paid_at, amount, currency').gte('paid_at', `${year}-01-01`),
    ])
    const data = {
      subscriptions: subs.data ?? [], debts: debts.data ?? [], tasks: tasks.data ?? [],
      entities: entities.data ?? [], phones: phones.data ?? [],
    }
    return {
      content: JSON.stringify({
        today: todayISO(),
        fixed_monthly: monthlyFixed(data.subscriptions, data.debts),
        debt: debtTotals(data.debts),
        paid_this_year: paidThisYear(payments.data ?? []),
        next_30_days: upcoming(data),
        open_tasks: data.tasks.filter((t) => t.status !== 'done').map((t) => ({ id: t.id, title: t.title, priority: t.priority, due_at: t.due_at })),
      }),
    }
  }

  return { content: `Unknown tool ${name}`, isError: true }
}

// Applies a confirmed proposal with the service role and records it in the audit log.
export async function applyProposal(id: number, chatId: number): Promise<string> {
  const db = createAdminSupabaseClient()
  const { data: p } = await db.from('personal_pending_actions').select('*').eq('id', id).eq('chat_id', chatId).maybeSingle()
  if (!p) return 'Proposal not found.'
  if (p.status !== 'pending') return `Already ${p.status}.`
  if (!isTable(p.table_name)) return 'Table not allowed.'

  const res = p.op === 'insert'
    ? await db.from(p.table_name).insert(p.payload).select('id').single()
    : await db.from(p.table_name).update(p.payload).eq('id', p.record_id).select('id').single()
  if (res.error) return `Could not save: ${res.error.message}`

  await db.from('personal_pending_actions').update({ status: 'applied', resolved_at: new Date().toISOString() }).eq('id', id)
  await db.from('personal_audit_log').insert({
    actor: 'jarvis', action: p.op, table_name: p.table_name, record_id: res.data?.id ?? p.record_id,
    detail: { proposal_id: id, payload: p.payload },
  })
  return `✅ Saved: ${p.summary}`
}

export async function rejectProposal(id: number, chatId: number): Promise<string> {
  const db = createAdminSupabaseClient()
  const { data } = await db.from('personal_pending_actions')
    .update({ status: 'rejected', resolved_at: new Date().toISOString() })
    .eq('id', id).eq('chat_id', chatId).eq('status', 'pending').select('summary').maybeSingle()
  return data ? `✖ Discarded: ${data.summary}` : 'Nothing to discard.'
}
