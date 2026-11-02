import type Anthropic from '@anthropic-ai/sdk'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { debtTotals, monthlyFixed, paidThisYear, todayISO, upcoming } from '@/lib/overview'
import { inferPaymentCountry, normalizePaymentCountry } from '@/lib/payments/country'

// Tables Jarvis may read and propose changes to. Agent/audit tables are never exposed.
export const JARVIS_TABLES = [
  'personal_tasks', 'personal_affiliations', 'personal_accounts', 'personal_subscriptions', 'personal_payments',
  'personal_debts', 'personal_phone_lines', 'personal_emails', 'personal_account_links', 'personal_entities',
  'personal_inbox', 'job_applications', 'personal_documents', 'personal_health',
  'personal_statements', 'personal_bank_movements', 'personal_exchange_movements', 'personal_crypto_orders', 'personal_flow_links',
] as const
type JarvisTable = (typeof JARVIS_TABLES)[number]
const isTable = (t: unknown): t is JarvisTable => typeof t === 'string' && (JARVIS_TABLES as readonly string[]).includes(t)

// 2025 ledger: rows come from the statement loaders. Jarvis reads them and may only annotate existing rows.
const LEDGER_DATE: Partial<Record<JarvisTable, string>> = {
  personal_statements: 'period_end', personal_bank_movements: 'date',
  personal_exchange_movements: 'occurred_on', personal_crypto_orders: 'order_date',
}
const UPDATE_ONLY = new Set<JarvisTable>(['personal_bank_movements', 'personal_exchange_movements', 'personal_crypto_orders', 'personal_flow_links'])
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/


// Exact writable columns per table (and allowed values for constrained ones). Given to Claude in the
// propose_change description and enforced before a proposal is queued, so a guessed column never reaches a Confirm button.
const SCHEMA: Record<JarvisTable, Record<string, string>> = {
  personal_tasks: { title: 'text', domain: 'personal|health|pension|money|debt|entity|tax|job|us|identity|other', priority: 'low|normal|high', status: 'open|snoozed|done', due_at: 'date', steps: 'text[]', notes: 'text', done_at: 'timestamp' },
  personal_affiliations: { kind: 'eps|pension|cesantias|arl|caja|other', entity: 'text', regime: 'text', status: 'active|inactive|unknown', affiliate_last4: 'text', since: 'date', last_verified_at: 'date', next_action: 'text', url: 'text', notes: 'text' },
  personal_accounts: { institution: 'text', country: 'CO|US|GLOBAL', kind: 'bank|exchange|fintech|card|wallet|broker|other', currency: 'text', last4: 'text', alias: 'text', status: 'active|pending|closed', login_email: 'text', vault_ref: 'text', url: 'text', notes: 'text' },
  personal_subscriptions: { provider: 'text', category: 'telecom|internet|entertainment|software|utility|insurance|finance|other', amount: 'number', currency: 'text', cadence: 'weekly|monthly|quarterly|yearly', billing_day: 'int 1-31', next_renewal: 'date', started_at: 'date', cancelled_at: 'date', paid_with: 'text', status: 'active|trial|paused|cancelled', email_alias: 'text', cancel_url: 'text', notes: 'text' },
  personal_payments: { status: 'pending|paid', billed_at: 'date', due_at: 'date', paid_at: 'date', provider: 'text', subscription_id: 'int', debt_id: 'int', amount: 'number', currency: 'text', paid_with: 'text', invoice_path: 'text', source: 'manual|telegram|email|import', country: 'CO|US|OTHER', notes: 'text' },
  personal_debts: { creditor: 'text', kind: 'student_loan|credit_card|personal|mortgage|other', currency: 'text', principal: 'number', balance: 'number', rate: 'text', min_payment: 'number', due_day: 'int 1-31', phase: 'text', status: 'active|paid|defaulted|negotiating', portal_url: 'text', notes: 'text' },
  personal_phone_lines: { label: 'text', country: 'CO|US|OTHER', number_e164: 'text', carrier: 'text', plan_kind: 'prepaid|postpaid|esim|voip', billing_day: 'int 1-31', expires_at: 'date', used_for_2fa: 'text[]', status: 'active|suspended|cancelled', notes: 'text' },
  personal_emails: { address: 'text', provider: 'text', role: 'vault|private|public|legacy|domain', mfa_method: 'text', recovery: 'text', notes: 'text' },
  personal_account_links: { service: 'text', category: 'text', email: 'text', phone: 'text', vault_ref: 'text', status: 'ok|review|move_to_vault|close', notes: 'text' },
  personal_entities: { name: 'text', legal_form: 'text', country: 'CO|US|OTHER', my_role: 'text', ownership_pct: 'number', tax_id_last4: 'text', status: 'active|dormant|dissolving|closed', next_obligation: 'text', next_obligation_due: 'date', url: 'text', notes: 'text' },
  personal_inbox: { category: 'bill|receipt|alert|person|noise|unknown', status: 'needs_you|auto_logged|forwarded|archived', notes: 'text' },
  personal_documents: { title: 'text', kind: 'cedula|passport|visa|itin|rut|license|insurance|contract|certificate|tax_return|other', area: 'identity|health|career|finances|taxes|social|companies|home|digital|people|goals', issuer: 'text', country: 'CO|US|OTHER', number_last4: 'text', issued_at: 'date', expires_at: 'date', renew_lead_days: 'int', status: 'active|renewing|pending|archived', file_path: 'text', notes: 'text' },
  personal_health: { kind: 'appointment|exam|medication|vaccine|procedure|other', title: 'text', provider: 'text', location: 'text', scheduled_at: 'timestamp (ISO with -05:00 offset, Bogotá)', ends_on: 'date', dose: 'text', status: 'scheduled|done|cancelled|ongoing', file_path: 'text', notes: 'text' },
  personal_statements: { institution: 'text', kind: 'bank|card|fintech|exchange|broker|other', account_last4: 'text', currency: 'text', country: 'CO|US|OTHER', period_start: 'date', period_end: 'date', opening_balance: 'number', total_in: 'number', total_out: 'number', closing_balance: 'number', status: 'imported|reconciled|partial|archived', file_path: 'text', notes: 'text' },
  personal_bank_movements: { counterparty: 'text', category: 'text', own_transfer: 'boolean', notes: 'text' },
  personal_exchange_movements: { description: 'text' },
  personal_crypto_orders: { sale_date: 'date', sale_venue: 'dolarapp|binance_p2p|okx|other', cop_received: 'number', margin_cop: 'number', notes: 'text' },
  personal_flow_links: { notes: 'text' },
  job_applications: { company: 'text', position: 'text', website: 'text', application_url: 'text', description: 'text', status: 'saved|applied|interviewing|offered|rejected|withdrawn', applied_at: 'text', notes: 'text' },
}
const SCHEMA_TEXT = Object.entries(SCHEMA)
  .map(([table, cols]) => `${table}: ${Object.entries(cols).map(([c, k]) => `${c} (${k})`).join(', ')}`).join('\n')

// Returns an error message when a proposal uses an unknown column or a value outside an allowed set.
function checkValues(table: JarvisTable, values: Record<string, unknown>): string | null {
  const cols = SCHEMA[table]
  const unknown = Object.keys(values).filter((k) => !(k in cols))
  if (unknown.length) return `Unknown column(s) for ${table}: ${unknown.join(', ')}. Valid: ${Object.keys(cols).join(', ')}`
  for (const [k, v] of Object.entries(values)) {
    const kind = cols[k]
    if (kind.includes('|') && v !== null && !kind.split('|').includes(String(v))) return `${k} must be one of ${kind.replaceAll('|', ', ')}`
    if (kind === 'date' && v !== null && !/^\d{4}-\d{2}-\d{2}$/.test(String(v))) return `${k} must be a YYYY-MM-DD date`
    if (kind === 'boolean' && v !== null && typeof v !== 'boolean') return `${k} must be true or false`
  }
  return null
}

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
        since: { type: 'string', description: 'Ledger tables only: from this date (YYYY-MM-DD, inclusive). Ledger rows come newest first.' },
        until: { type: 'string', description: 'Ledger tables only: up to this date (YYYY-MM-DD, inclusive).' },
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
      'Never include id or created_at in values. Call once per row; several calls in one turn are fine.\n' +
      'Use ONLY these columns (allowed values after |):\n' + SCHEMA_TEXT,
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
    name: 'finance_totals',
    description: 'Totals from the imported ledger for a date range (default: the current year): bank inflow/outflow per account ' +
      '(own transfers excluded), exchange movements per source and operation, crypto orders (count, COP paid, COP received, margin). ' +
      'Use for questions like "how much came in through DolarApp in 2025" instead of paging rows.',
    input_schema: {
      type: 'object',
      properties: {
        since: { type: 'string', description: 'YYYY-MM-DD, inclusive' },
        until: { type: 'string', description: 'YYYY-MM-DD, inclusive' },
      },
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
    const dateCol = LEDGER_DATE[input.table]
    if (dateCol) {
      if (ISO_DATE.test(String(input.since ?? ''))) q = q.gte(dateCol, String(input.since))
      if (ISO_DATE.test(String(input.until ?? ''))) q = q.lte(dateCol, String(input.until))
      q = q.order(dateCol, { ascending: false })
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
    if (op === 'insert' && UPDATE_ONLY.has(table)) return { content: `${table} rows come from statement imports; only update existing rows.`, isError: true }
    if (op === 'update' && !Number.isInteger(record_id)) return { content: 'record_id is required for update', isError: true }
    if (!values || typeof values !== 'object' || Array.isArray(values)) return { content: 'values must be an object', isError: true }
    const clean = Object.fromEntries(Object.entries(values).filter(([k]) => !FORBIDDEN_KEYS.has(k) && /^[a-z_0-9]+$/.test(k)))
    if (!Object.keys(clean).length) return { content: 'No writable values', isError: true }
    // Payments carry the issuer's tax jurisdiction: normalize what was proposed, infer it on insert when missing.
    if (table === 'personal_payments') {
      if ('country' in clean) clean.country = normalizePaymentCountry(clean.country)
      if (op === 'insert' && !clean.country) {
        clean.country = inferPaymentCountry({
          provider: clean.provider as string, currency: clean.currency as string, text: clean.notes as string,
        })
      }
    }
    const invalid = checkValues(table, clean)
    if (invalid) return { content: `${invalid}. Fix the values and call propose_change again.`, isError: true }

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
    const [subs, debts, tasks, entities, phones, payments, pending, health] = await Promise.all([
      db.from('personal_subscriptions').select('*'),
      db.from('personal_debts').select('*'),
      db.from('personal_tasks').select('*'),
      db.from('personal_entities').select('*'),
      db.from('personal_phone_lines').select('*'),
      db.from('personal_payments').select('paid_at, amount, currency, status').eq('status', 'paid').gte('paid_at', `${year}-01-01`),
      db.from('personal_payments').select('provider, amount, currency, due_at, status').eq('status', 'pending'),
      db.from('personal_health').select('title, provider, scheduled_at, status').eq('status', 'scheduled'),
    ])
    const data = {
      subscriptions: subs.data ?? [], debts: debts.data ?? [], tasks: tasks.data ?? [],
      entities: entities.data ?? [], phones: phones.data ?? [], pendingBills: pending.data ?? [], health: health.data ?? [],
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

  if (name === 'finance_totals') {
    const year = todayISO().slice(0, 4)
    const since = ISO_DATE.test(String(input.since ?? '')) ? String(input.since) : `${year}-01-01`
    const until = ISO_DATE.test(String(input.until ?? '')) ? String(input.until) : `${year}-12-31`
    const [bank, exchange, orders] = await Promise.all([
      fetchAll(db, 'personal_bank_movements', 'account, amount, own_transfer', 'date', since, until),
      fetchAll(db, 'personal_exchange_movements', 'source, operation, asset, amount, cop_amount', 'occurred_on', since, until),
      fetchAll(db, 'personal_crypto_orders', 'type, cop_paid, cop_received, margin_cop', 'order_date', since, until),
    ])
    const add = (o: Record<string, number>, k: string, v: unknown) => { o[k] = round((o[k] ?? 0) + (Number(v) || 0)) }
    const banks: Record<string, { inflow: Record<string, number>; outflow: Record<string, number> }> = {}
    let ownTransfers = 0
    for (const r of bank) {
      if (r.own_transfer) { ownTransfers++; continue }
      const b = (banks[String(r.account)] ??= { inflow: {}, outflow: {} })
      add(Number(r.amount) < 0 ? b.outflow : b.inflow, 'COP', Math.abs(Number(r.amount)))
    }
    const exch: Record<string, Record<string, number>> = {}
    for (const r of exchange) add((exch[`${r.source} ${r.operation}`] ??= {}), String(r.asset ?? '?'), r.amount)
    const ord: Record<string, Record<string, number>> = {}
    for (const r of orders) {
      const o = (ord[String(r.type)] ??= {})
      add(o, 'count', 1); add(o, 'cop_paid', r.cop_paid); add(o, 'cop_received', r.cop_received); add(o, 'margin_cop', r.margin_cop)
    }
    return {
      content: JSON.stringify({
        since, until, bank_rows: bank.length, own_transfers_excluded: ownTransfers, bank: banks,
        exchange_rows: exchange.length, exchange: exch, crypto_orders: ord,
      }),
    }
  }

  return { content: `Unknown tool ${name}`, isError: true }
}

const round = (n: number) => Math.round(n * 100) / 100

// Pages through a ledger table for a date range (PostgREST caps each response at 1000 rows).
async function fetchAll(
  db: ReturnType<typeof createAdminSupabaseClient>, table: string, cols: string, dateCol: string, since: string, until: string,
): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = []
  for (let from = 0; from < 50_000; from += 1000) {
    const { data, error } = await db.from(table).select(cols).gte(dateCol, since).lte(dateCol, until).order('id').range(from, from + 999)
    if (error || !data?.length) break
    rows.push(...(data as unknown as Record<string, unknown>[]))
    if (data.length < 1000) break
  }
  return rows
}

// Applies a confirmed proposal with the service role and records it in the audit log.
/**
 * An inbox email stays "needs you" only while one of its proposals is unresolved.
 * Called after a proposal is applied or discarded, so the admin inbox shrinks as William confirms.
 */
async function settleInbox(db: ReturnType<typeof createAdminSupabaseClient>, proposalId: number) {
  const { data: rows } = await db.from('personal_inbox').select('id, structured')
    .eq('status', 'needs_you').contains('structured', { proposals: [proposalId] })
  for (const row of rows ?? []) {
    const ids = ((row.structured as { proposals?: number[] } | null)?.proposals ?? []).filter((n) => n !== proposalId)
    const { count } = ids.length
      ? await db.from('personal_pending_actions').select('id', { count: 'exact', head: true }).in('id', ids).eq('status', 'pending')
      : { count: 0 }
    if (!count) await db.from('personal_inbox').update({ status: 'auto_logged' }).eq('id', row.id).eq('status', 'needs_you')
  }
}

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
  await settleInbox(db, id)
  return `✅ Saved: ${p.summary}`
}

export async function rejectProposal(id: number, chatId: number): Promise<string> {
  const db = createAdminSupabaseClient()
  const { data } = await db.from('personal_pending_actions')
    .update({ status: 'rejected', resolved_at: new Date().toISOString() })
    .eq('id', id).eq('chat_id', chatId).eq('status', 'pending').select('summary').maybeSingle()
  if (data) await settleInbox(db, id)
  return data ? `✖ Discarded: ${data.summary}` : 'Nothing to discard.'
}
