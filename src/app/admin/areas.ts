// Life OS areas: each area is a set of editor tabs over existing tables, filtered to that area.
// Plain module (no 'use client') so server pages and the client editor share it.

export type Filter = { col: string; op: 'eq' | 'neq' | 'in'; val: string | string[] }
export interface TabDef { table: string; filter?: Filter; defaults?: Record<string, unknown> }

// Area-specific tab labels → table + filter. Labels must be unique across the admin.
export const AREA_TABS: Record<string, TabDef> = {
  'Document tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'us' }, defaults: { domain: 'us' } },
  EPS: { table: 'personal_affiliations', filter: { col: 'kind', op: 'eq', val: 'eps' }, defaults: { kind: 'eps' } },
  'Health tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'health' }, defaults: { domain: 'health' } },
  Degrees: { table: 'education' },
  'Career tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'job' }, defaults: { domain: 'job' } },
  'Money tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'in', val: ['money', 'debt'] }, defaults: { domain: 'money' } },
  'Tax deadlines': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'tax' }, defaults: { domain: 'tax' } },
  'Pension & cesantías': { table: 'personal_affiliations', filter: { col: 'kind', op: 'neq', val: 'eps' }, defaults: { kind: 'pension' } },
  'Social security tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'pension' }, defaults: { domain: 'pension' } },
  'Company tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'entity' }, defaults: { domain: 'entity' } },
  'Needs you': { table: 'personal_inbox', filter: { col: 'status', op: 'eq', val: 'needs_you' } },
  'All mail': { table: 'personal_inbox' },
  'Digital tasks': { table: 'personal_tasks', filter: { col: 'domain', op: 'eq', val: 'identity' }, defaults: { domain: 'identity' } },
}

export interface Area {
  slug: string
  name: string
  blurb: string
  tabs: string[]          // editor tab labels (AREA_TABS or the general TABLE_MAP labels)
  domains: string[]       // personal_tasks.domain values that belong here
}

export const AREAS: Area[] = [
  { slug: 'identity', name: 'Identity & Documents', blurb: 'Cédula, passport, visa, ITIN, RUT and their expiry dates.', tabs: ['Document tasks'], domains: ['us'] },
  { slug: 'health', name: 'Health', blurb: 'EPS, appointments, medications, exams and insurance.', tabs: ['EPS', 'Health tasks'], domains: ['health'] },
  { slug: 'career', name: 'Education & Career', blurb: 'Degrees, certificates, job applications and the CV.', tabs: ['Jobs', 'Career tasks', 'Degrees', 'Certificates'], domains: ['job'] },
  { slug: 'finances', name: 'Finances', blurb: 'Accounts, payments, subscriptions and debts.', tabs: ['Payments', 'Subscriptions', 'Accounts', 'Debts', 'Money tasks'], domains: ['money', 'debt'] },
  { slug: 'taxes', name: 'Taxes', blurb: 'DIAN, RUT, declaración de renta, IRS and US filings.', tabs: ['Tax deadlines'], domains: ['tax'] },
  { slug: 'social', name: 'Social security', blurb: 'Pension, cesantías, ARL and PILA contributions.', tabs: ['Pension & cesantías', 'Social security tasks'], domains: ['pension'] },
  { slug: 'companies', name: 'Companies', blurb: 'Ekinoxis Labs, Echosystem Technologies and the US LLC.', tabs: ['Entities', 'Company tasks'], domains: ['entity'] },
  { slug: 'home', name: 'Home & Assets', blurb: 'Housing, utilities, vehicles, insurance and valuables.', tabs: [], domains: [] },
  { slug: 'digital', name: 'Digital life', blurb: 'Emails, phone lines, logins and which service uses which.', tabs: ['Emails', 'Phone lines', 'Identities', 'Digital tasks'], domains: ['identity'] },
  { slug: 'people', name: 'People', blurb: 'Family, accountant, lawyer, doctors and providers.', tabs: [], domains: [] },
  { slug: 'goals', name: 'Goals', blurb: 'Yearly goals, projects and habits.', tabs: [], domains: [] },
]

export type AreaStatus = 'alert' | 'ok' | 'empty'

// Applies a tab filter to a Supabase query builder (works for select and count queries).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyFilter<Q extends { eq: any; neq: any; in: any }>(q: Q, f?: Filter): Q {
  if (!f) return q
  if (f.op === 'eq') return q.eq(f.col, f.val)
  if (f.op === 'neq') return q.neq(f.col, f.val)
  return q.in(f.col, f.val as string[])
}
