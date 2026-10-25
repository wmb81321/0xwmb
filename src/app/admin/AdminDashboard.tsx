'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { upsertRecord, deleteRecord, uploadLogo, uploadPrivateDoc, signedDocUrl } from './actions'
import { createClient } from '@/lib/supabase'
import type { PortfolioData } from '@/lib/types'
import { SITE_TABS } from './tabs'

// ─── Field config ────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'date' | 'image' | 'doc' | 'array' | 'keyvalue' | 'select'
interface FieldDef { key: string; label: string; type: FieldType; options?: string[] }

const FIELDS: Record<string, FieldDef[]> = {
  profile: [
    { key: 'name',       label: 'Full name',    type: 'text' },
    { key: 'title',      label: 'Title',        type: 'text' },
    { key: 'summary',    label: 'Summary',      type: 'textarea' },
    { key: 'industries', label: 'Industries',   type: 'text' },
    { key: 'photo_url',  label: 'Photo',        type: 'image' },
  ],
  experiences: [
    { key: 'role',     label: 'Role',         type: 'text' },
    { key: 'company',  label: 'Company',      type: 'text' },
    { key: 'years',    label: 'Period',        type: 'text' },
    { key: 'website',  label: 'Website',      type: 'url' },
    { key: 'linkedin', label: 'LinkedIn',     type: 'url' },
    { key: 'twitter',  label: 'X / Twitter',  type: 'url' },
    { key: 'logo_url', label: 'Logo',         type: 'image' },
    { key: 'points',   label: 'Bullet points',type: 'array' },
    { key: 'order',    label: 'Order',        type: 'number' },
  ],
  projects: [
    { key: 'name',       label: 'Name',              type: 'text' },
    { key: 'role',       label: 'Role',              type: 'text' },
    { key: 'start_date', label: 'Start Date',        type: 'text' },
    { key: 'end_date',   label: 'End Date',          type: 'text' },
    { key: 'brief',      label: 'Brief',             type: 'text' },
    { key: 'website',    label: 'Website',           type: 'url' },
    { key: 'logo_url',   label: 'Logo',              type: 'image' },
    { key: 'socials',    label: 'Socials (key → url)', type: 'keyvalue' },
    { key: 'points',     label: 'Bullet points',     type: 'array' },
    { key: 'order',      label: 'Order',             type: 'number' },
  ],
  education: [
    { key: 'institution',    label: 'School name',     type: 'text' },
    { key: 'field_of_study', label: 'Field of Study',  type: 'text' },
    { key: 'degree',         label: 'Degree',          type: 'text' },
    { key: 'start_date',     label: 'Start Date',      type: 'text' },
    { key: 'end_date',       label: 'End Date',        type: 'text' },
    { key: 'description',    label: 'Description',     type: 'textarea' },
    { key: 'website',        label: 'Website',         type: 'url' },
    { key: 'linkedin',       label: 'LinkedIn',        type: 'url' },
    { key: 'twitter',        label: 'X Account',       type: 'url' },
    { key: 'logo_url',       label: 'Logo',            type: 'image' },
    { key: 'order',          label: 'Order',           type: 'number' },
  ],
  certificates: [
    { key: 'name',    label: 'Certificate name', type: 'text' },
    { key: 'issuer',  label: 'Issuer',           type: 'text' },
    { key: 'year',    label: 'Year',             type: 'text' },
    { key: 'website', label: 'Website',          type: 'url' },
    { key: 'linkedin',label: 'LinkedIn',         type: 'url' },
    { key: 'twitter', label: 'X / Twitter',      type: 'url' },
    { key: 'logo_url',label: 'Logo',             type: 'image' },
    { key: 'order',   label: 'Order',            type: 'number' },
  ],
  volunteering: [
    { key: 'reason',  label: 'Reason',       type: 'text' },
    { key: 'role',    label: 'Role',         type: 'text' },
    { key: 'issuer',  label: 'Organization', type: 'text' },
    { key: 'year',    label: 'Year',         type: 'text' },
    { key: 'logo_url',label: 'Logo',         type: 'image' },
    { key: 'order',   label: 'Order',        type: 'number' },
  ],
  achievements: [
    { key: 'title',       label: 'Title',       type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'year',        label: 'Year',        type: 'text' },
    { key: 'logo_url',    label: 'Logo',        type: 'image' },
    { key: 'link',        label: 'Link',        type: 'url' },
    { key: 'type',        label: 'Type',        type: 'select', options: ['achievement', 'goal'] },
    { key: 'order',       label: 'Order',       type: 'number' },
  ],
  skills: [
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'type',     label: 'Type',     type: 'select', options: ['technical', 'soft'] },
    { key: 'items',    label: 'Skills',   type: 'array' },
    { key: 'logos',    label: 'Logos (skill name → url)', type: 'keyvalue' },
    { key: 'order',    label: 'Order',    type: 'number' },
  ],
  languages: [
    { key: 'name',  label: 'Language', type: 'text' },
    { key: 'level', label: 'Level',    type: 'text' },
    { key: 'flag',  label: 'Flag',     type: 'text' },
    { key: 'order', label: 'Order',    type: 'number' },
  ],
  contact: [
    { key: 'email',     label: 'Email',       type: 'text' },
    { key: 'whatsapp',  label: 'WhatsApp',    type: 'url' },
    { key: 'telegram',  label: 'Telegram',    type: 'url' },
    { key: 'github',    label: 'GitHub',      type: 'url' },
    { key: 'linkedin',  label: 'LinkedIn',    type: 'url' },
    { key: 'twitter',   label: 'X / Twitter', type: 'url' },
    { key: 'farcaster', label: 'Farcaster',   type: 'url' },
  ],
  job_applications: [
    { key: 'company',         label: 'Company',          type: 'text' },
    { key: 'position',        label: 'Position',         type: 'text' },
    { key: 'website',         label: 'Company website',  type: 'url' },
    { key: 'application_url', label: 'Application link', type: 'url' },
    { key: 'status',          label: 'Status',           type: 'select', options: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn'] },
    { key: 'applied_at',      label: 'Applied on',       type: 'text' },
    { key: 'description',     label: 'Job description',  type: 'textarea' },
    { key: 'notes',           label: 'My notes',         type: 'textarea' },
    { key: 'order',           label: 'Order',            type: 'number' },
  ],

  // ─── Personal (private, owner-only) ───
  personal_tasks: [
    { key: 'title',    label: 'Task',     type: 'text' },
    { key: 'status',   label: 'Status',   type: 'select', options: ['open', 'snoozed', 'done'] },
    { key: 'priority', label: 'Priority', type: 'select', options: ['high', 'normal', 'low'] },
    { key: 'domain',   label: 'Area',     type: 'select', options: ['personal', 'health', 'pension', 'money', 'debt', 'entity', 'tax', 'job', 'us', 'identity', 'other'] },
    { key: 'due_at',   label: 'Due',      type: 'date' },
    { key: 'steps',    label: 'Steps',    type: 'array' },
    { key: 'notes',    label: 'Notes',    type: 'textarea' },
    { key: 'order',    label: 'Order',    type: 'number' },
  ],
  personal_affiliations: [
    { key: 'kind',             label: 'Type',             type: 'select', options: ['eps', 'pension', 'cesantias', 'arl', 'caja', 'other'] },
    { key: 'entity',           label: 'Entity',           type: 'text' },
    { key: 'regime',           label: 'Regime / fund',    type: 'text' },
    { key: 'status',           label: 'Status',           type: 'select', options: ['active', 'inactive', 'unknown'] },
    { key: 'affiliate_last4',  label: 'ID (last 4 only)', type: 'text' },
    { key: 'since',            label: 'Since',            type: 'date' },
    { key: 'last_verified_at', label: 'Last verified',    type: 'date' },
    { key: 'next_action',      label: 'Next action',      type: 'text' },
    { key: 'url',              label: 'Portal',           type: 'url' },
    { key: 'notes',            label: 'Notes',            type: 'textarea' },
    { key: 'order',            label: 'Order',            type: 'number' },
  ],
  personal_accounts: [
    { key: 'institution', label: 'Institution',          type: 'text' },
    { key: 'kind',        label: 'Type',                 type: 'select', options: ['bank', 'exchange', 'fintech', 'card', 'wallet', 'broker', 'other'] },
    { key: 'country',     label: 'Country',              type: 'select', options: ['CO', 'US', 'GLOBAL'] },
    { key: 'currency',    label: 'Currency',             type: 'text' },
    { key: 'alias',       label: 'Alias',                type: 'text' },
    { key: 'last4',       label: 'Last 4 digits only',   type: 'text' },
    { key: 'status',      label: 'Status',               type: 'select', options: ['active', 'pending', 'closed'] },
    { key: 'login_email', label: 'Login email',          type: 'text' },
    { key: 'vault_ref',   label: 'Password manager link',type: 'url' },
    { key: 'url',         label: 'Website',              type: 'url' },
    { key: 'notes',       label: 'Notes',                type: 'textarea' },
    { key: 'order',       label: 'Order',                type: 'number' },
  ],
  personal_subscriptions: [
    { key: 'provider',     label: 'Provider',        type: 'text' },
    { key: 'category',     label: 'Category',        type: 'select', options: ['telecom', 'internet', 'entertainment', 'software', 'utility', 'insurance', 'finance', 'other'] },
    { key: 'amount',       label: 'Amount',          type: 'number' },
    { key: 'currency',     label: 'Currency',        type: 'select', options: ['COP', 'USD', 'EUR', 'USDC'] },
    { key: 'cadence',      label: 'Cadence',         type: 'select', options: ['monthly', 'yearly', 'quarterly', 'weekly'] },
    { key: 'billing_day',  label: 'Billing day',     type: 'number' },
    { key: 'next_renewal', label: 'Next renewal',    type: 'date' },
    { key: 'started_at',   label: 'Started',         type: 'date' },
    { key: 'cancelled_at', label: 'Cancelled',       type: 'date' },
    { key: 'paid_with',    label: 'Paid with',       type: 'text' },
    { key: 'status',       label: 'Status',          type: 'select', options: ['active', 'trial', 'paused', 'cancelled'] },
    { key: 'email_alias',  label: 'Billing email',   type: 'text' },
    { key: 'cancel_url',   label: 'Cancel link',     type: 'url' },
    { key: 'notes',        label: 'Notes',           type: 'textarea' },
    { key: 'order',        label: 'Order',           type: 'number' },
  ],
  personal_payments: [
    { key: 'paid_at',         label: 'Paid on',          type: 'date' },
    { key: 'provider',        label: 'Provider',         type: 'text' },
    { key: 'amount',          label: 'Amount',           type: 'number' },
    { key: 'currency',        label: 'Currency',         type: 'select', options: ['COP', 'USD', 'EUR', 'USDC'] },
    { key: 'subscription_id', label: 'Subscription ID (optional)', type: 'number' },
    { key: 'debt_id',         label: 'Debt ID (optional)',         type: 'number' },
    { key: 'paid_with',       label: 'Paid with',        type: 'text' },
    { key: 'source',          label: 'Source',           type: 'select', options: ['manual', 'telegram', 'email', 'import'] },
    { key: 'invoice_path',    label: 'Invoice (PDF or image, private)', type: 'doc' },
    { key: 'notes',           label: 'Notes',            type: 'textarea' },
  ],
  personal_debts: [
    { key: 'creditor',    label: 'Creditor',        type: 'text' },
    { key: 'kind',        label: 'Type',            type: 'select', options: ['student_loan', 'credit_card', 'personal', 'mortgage', 'other'] },
    { key: 'currency',    label: 'Currency',        type: 'select', options: ['COP', 'USD'] },
    { key: 'principal',   label: 'Original amount', type: 'number' },
    { key: 'balance',     label: 'Balance',         type: 'number' },
    { key: 'rate',        label: 'Rate (e.g. IPC+7, 28% EA)', type: 'text' },
    { key: 'min_payment', label: 'Monthly payment', type: 'number' },
    { key: 'due_day',     label: 'Due day',         type: 'number' },
    { key: 'phase',       label: 'Phase',           type: 'text' },
    { key: 'status',      label: 'Status',          type: 'select', options: ['active', 'negotiating', 'paid', 'defaulted'] },
    { key: 'portal_url',  label: 'Portal',          type: 'url' },
    { key: 'notes',       label: 'Notes',           type: 'textarea' },
    { key: 'order',       label: 'Order',           type: 'number' },
  ],
  personal_phone_lines: [
    { key: 'label',        label: 'Label',            type: 'text' },
    { key: 'country',      label: 'Country',          type: 'select', options: ['CO', 'US', 'OTHER'] },
    { key: 'number_e164',  label: 'Number (+57…)',    type: 'text' },
    { key: 'carrier',      label: 'Carrier',          type: 'text' },
    { key: 'plan_kind',    label: 'Plan',             type: 'select', options: ['prepaid', 'postpaid', 'esim', 'voip'] },
    { key: 'billing_day',  label: 'Billing day',      type: 'number' },
    { key: 'expires_at',   label: 'Expires / renews', type: 'date' },
    { key: 'used_for_2fa', label: 'Receives 2FA codes for', type: 'array' },
    { key: 'status',       label: 'Status',           type: 'select', options: ['active', 'suspended', 'cancelled'] },
    { key: 'notes',        label: 'Notes',            type: 'textarea' },
    { key: 'order',        label: 'Order',            type: 'number' },
  ],
  personal_emails: [
    { key: 'address',    label: 'Address',        type: 'text' },
    { key: 'role',       label: 'Role',           type: 'select', options: ['vault', 'private', 'public', 'legacy', 'domain'] },
    { key: 'provider',   label: 'Provider',       type: 'text' },
    { key: 'mfa_method', label: '2FA method',     type: 'text' },
    { key: 'recovery',   label: 'Recovery (email/phone)', type: 'text' },
    { key: 'notes',      label: 'Notes',          type: 'textarea' },
    { key: 'order',      label: 'Order',          type: 'number' },
  ],
  personal_account_links: [
    { key: 'service',   label: 'Service',               type: 'text' },
    { key: 'category',  label: 'Category',              type: 'text' },
    { key: 'email',     label: 'Email used',            type: 'text' },
    { key: 'phone',     label: 'Phone for codes',       type: 'text' },
    { key: 'vault_ref', label: 'Password manager link', type: 'url' },
    { key: 'status',    label: 'Status',                type: 'select', options: ['review', 'ok', 'move_to_vault', 'close'] },
    { key: 'notes',     label: 'Notes',                 type: 'textarea' },
    { key: 'order',     label: 'Order',                 type: 'number' },
  ],
  personal_entities: [
    { key: 'name',                label: 'Name',             type: 'text' },
    { key: 'legal_form',          label: 'Legal form',       type: 'text' },
    { key: 'country',             label: 'Country',          type: 'select', options: ['CO', 'US', 'OTHER'] },
    { key: 'my_role',             label: 'My role',          type: 'text' },
    { key: 'ownership_pct',       label: 'Ownership %',      type: 'number' },
    { key: 'tax_id_last4',        label: 'NIT / EIN (last 4)', type: 'text' },
    { key: 'status',              label: 'Status',           type: 'select', options: ['active', 'dormant', 'dissolving', 'closed'] },
    { key: 'next_obligation',     label: 'Next obligation',  type: 'text' },
    { key: 'next_obligation_due', label: 'Due',              type: 'date' },
    { key: 'url',                 label: 'Website',          type: 'url' },
    { key: 'notes',               label: 'Notes',            type: 'textarea' },
    { key: 'order',               label: 'Order',            type: 'number' },
  ],
}

const TABLE_MAP: Record<string, string> = {
  Profile: 'profile', Experience: 'experiences', Projects: 'projects',
  Education: 'education', Certificates: 'certificates', Volunteering: 'volunteering',
  Achievements: 'achievements',
  Skills: 'skills', Languages: 'languages', Contact: 'contact', Jobs: 'job_applications',
  Tasks: 'personal_tasks', 'Social security': 'personal_affiliations', Accounts: 'personal_accounts',
  Subscriptions: 'personal_subscriptions', Payments: 'personal_payments', Debts: 'personal_debts', 'Phone lines': 'personal_phone_lines',
  Emails: 'personal_emails', Identities: 'personal_account_links', Entities: 'personal_entities',
}

const LIST_TABS = new Set(['Experience', 'Projects', 'Education', 'Certificates', 'Volunteering', 'Achievements', 'Skills', 'Languages', 'Jobs',
  'Tasks', 'Social security', 'Accounts', 'Subscriptions', 'Payments', 'Debts', 'Phone lines', 'Emails', 'Identities', 'Entities'])


// ─── Primitives ──────────────────────────────────────────────────────────────

const inputCls = 'w-full bg-transparent border-0 border-b border-outline px-0 py-2 text-sm text-on-surface focus:outline-none focus:border-b-2 focus:border-primary transition-colors placeholder:text-outline'
const labelCls = 'block text-xs font-mono text-text-dim mb-1'

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      onChange(await uploadLogo(fd))
    } catch (e) { setErr(String(e)) }
    setUploading(false)
    if (ref.current) ref.current.value = ''
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <Image src={value} alt={label} width={40} height={40}
            className="rounded border border-border object-contain bg-surface p-0.5 flex-shrink-0" />
        )}
        <div className="flex-1 flex items-center gap-2">
          <input value={value} onChange={e => onChange(e.target.value)}
            placeholder="https://…" className={inputCls} />
          <label className="cursor-pointer whitespace-nowrap text-xs text-accent border border-accent px-3 py-2 rounded font-mono hover:bg-accent hover:text-white transition-colors flex-shrink-0">
            {uploading ? '…' : '↑ Upload'}
            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      </div>
      {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
    </div>
  )
}

// Private document upload (personal-docs bucket). Stores the object path; opens via a 5-minute signed link.
function DocField({ label, value, folder, onChange }: { label: string; value: string; folder: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      onChange(await uploadPrivateDoc(fd))
    } catch (e) { setErr(String(e)) }
    setBusy(false)
    e.target.value = ''
  }

  async function open() {
    try { window.open(await signedDocUrl(value), '_blank', 'noopener') } catch (e) { setErr(String(e)) }
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-3 font-mono text-xs">
        {value ? (
          <button type="button" onClick={open} className="text-primary hover:text-primary-container truncate">📎 {value.split('/').pop()} ↗</button>
        ) : <span className="text-outline">no file</span>}
        <label className="cursor-pointer whitespace-nowrap text-primary-container px-3 py-2 shadow-[inset_0_0_0_1px_rgba(226,248,255,.22)] hover:text-primary">
          {busy ? 'UPLOADING…' : value ? 'REPLACE' : '↑ UPLOAD'}
          <input type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFile} disabled={busy} />
        </label>
        {value && <button type="button" onClick={() => onChange('')} className="text-outline hover:text-error">REMOVE</button>}
      </div>
      {err && <p className="text-error text-xs mt-1">{err}</p>}
    </div>
  )
}

function ArrayField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col gap-1.5">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => { const n = [...value]; n[i] = e.target.value; onChange(n) }}
              className={inputCls} />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-300 px-2 flex-shrink-0">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, ''])}
          className="self-start text-xs text-accent border border-dashed border-accent px-3 py-1 rounded font-mono hover:bg-accent hover:text-white transition-colors mt-1">
          + Add item
        </button>
      </div>
    </div>
  )
}

function KeyValueField({ label, value, onChange, uploadValues = false }: {
  label: string
  value: Record<string, string>
  onChange: (v: Record<string, string>) => void
  uploadValues?: boolean
}) {
  const entries = Object.entries(value)
  const [uploading, setUploading] = useState<number | null>(null)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function set(idx: number, k: string, v: string) {
    onChange(Object.fromEntries(entries.map(([ek, ev], i) => i === idx ? [k, v] : [ek, ev])))
  }

  async function handleUpload(idx: number, file: File) {
    setUploading(idx)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const url = await uploadLogo(fd)
      set(idx, entries[idx][0], url)
    } catch (e) { alert(String(e)) }
    setUploading(null)
    if (refs.current[idx]) refs.current[idx]!.value = ''
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col gap-2">
        {entries.map(([k, v], i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={k} onChange={e => set(i, e.target.value, v)} placeholder="skill name"
              className="w-[28%] bg-surface border border-border rounded px-2 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent flex-shrink-0" />
            {v && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v} alt={k} className="w-6 h-6 object-contain rounded border border-border bg-surface-2 p-0.5 flex-shrink-0" />
            )}
            <input value={v} onChange={e => set(i, k, e.target.value)} placeholder="image url"
              className={`flex-1 min-w-0 ${inputCls}`} />
            {uploadValues && (
              <label className="cursor-pointer whitespace-nowrap text-xs text-accent border border-accent px-2 py-2 rounded font-mono hover:bg-accent hover:text-white transition-colors flex-shrink-0">
                {uploading === i ? '…' : '↑'}
                <input ref={el => { refs.current[i] = el }} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(i, f) }}
                  disabled={uploading !== null} />
              </label>
            )}
            <button type="button"
              onClick={() => onChange(Object.fromEntries(entries.filter((_, j) => j !== i)))}
              className="text-red-400 hover:text-red-300 px-2 flex-shrink-0">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...value, '': '' })}
          className="self-start text-xs text-accent border border-dashed border-accent px-3 py-1 rounded font-mono hover:bg-accent hover:text-white transition-colors mt-1">
          + Add entry
        </button>
      </div>
    </div>
  )
}

// ─── Record Form ─────────────────────────────────────────────────────────────

function RecordForm({ table, initial, onSave, onCancel }: {
  table: string
  initial: Record<string, unknown>
  onSave: (saved: Record<string, unknown>) => void
  onCancel?: () => void
}) {
  const fields = FIELDS[table] ?? []
  const [values, setValues] = useState<Record<string, unknown>>({ ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, val: unknown) {
    setValues(v => ({ ...v, [key]: val }))
  }

  async function save() {
    setSaving(true); setError('')
    try {
      await upsertRecord(table, values)
      onSave(values)
    } catch (e) { setError(String(e)) }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.map((f) => {
        const val = values[f.key]
        if (f.type === 'image') return (
          <ImageField key={f.key} label={f.label} value={(val as string) ?? ''} onChange={v => set(f.key, v)} />
        )
        if (f.type === 'doc') return (
          <DocField key={f.key} label={f.label} value={(val as string) ?? ''} folder={table.replace('personal_', '')} onChange={v => set(f.key, v || null)} />
        )
        if (f.type === 'array') return (
          <ArrayField key={f.key} label={f.label} value={(val as string[]) ?? []} onChange={v => set(f.key, v)} />
        )
        if (f.type === 'keyvalue') return (
          <KeyValueField key={f.key} label={f.label} value={(val as Record<string, string>) ?? {}} onChange={v => set(f.key, v)} uploadValues={f.key === 'logos'} />
        )
        if (f.type === 'select') return (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <select value={(val as string) ?? ''} onChange={e => set(f.key, e.target.value)} className={inputCls}>
              {!val && <option value="">—</option>}
              {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )
        if (f.type === 'textarea') return (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <textarea value={(val as string) ?? ''} onChange={e => set(f.key, e.target.value)} rows={4} className={inputCls} />
          </div>
        )
        if (f.type === 'url') return (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <div className="flex gap-2">
              <input type="url" value={(val as string) ?? ''} onChange={e => set(f.key, e.target.value)}
                placeholder="https://…" className={inputCls} />
              {!!(val as string) && (
                <a href={val as string} target="_blank" rel="noopener noreferrer"
                  className="text-text-dim hover:text-accent flex-shrink-0 flex items-center px-2">↗</a>
              )}
            </div>
          </div>
        )
        return (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
              value={(val as string | number) ?? ''}
              onChange={e => {
                const raw = e.target.value
                // Empty number/date fields must be null, not '' or 0, for numeric/date columns.
                if (f.type === 'number') set(f.key, raw === '' ? null : Number(raw))
                else if (f.type === 'date') set(f.key, raw === '' ? null : raw)
                else set(f.key, raw)
              }}
              className={inputCls} />
          </div>
        )
      })}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button onClick={save} disabled={saving}
          className="bg-cta text-on-primary font-semibold text-xs px-5 py-2.5 font-mono tracking-wide hover:brightness-110 disabled:opacity-50 transition">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {onCancel && (
          <button onClick={onCancel}
            className="text-xs text-text-dim border border-border px-4 py-2 rounded font-mono hover:border-text-dim transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

// ─── List editor ─────────────────────────────────────────────────────────────

function cardSummary(table: string, item: Record<string, unknown>) {
  if (table === 'experiences')  return { title: `${item.role}`, sub: `${item.company} · ${item.years}` }
  if (table === 'projects')     return { title: item.name as string, sub: `${item.role} · ${item.years}` }
  if (table === 'education')    return { title: item.degree as string, sub: `${item.institution} · ${item.years}` }
  if (table === 'certificates') return { title: item.name as string, sub: `${item.issuer} · ${item.year}` }
  if (table === 'volunteering')  return { title: item.reason as string, sub: `${item.role ?? ''} · ${item.issuer} · ${item.year}` }
  if (table === 'achievements')  return { title: item.title as string, sub: `${item.type} · ${item.year ?? ''}` }
  if (table === 'skills')       return { title: item.category as string, sub: `${item.type} · ${(item.items as string[])?.join(', ')}` }
  if (table === 'languages')         return { title: `${item.flag ?? ''} ${item.name}`, sub: item.level as string }
  if (table === 'job_applications')  return { title: `${item.position}`, sub: `${item.company} · ${item.status}` }
  const j = (...xs: unknown[]) => xs.filter((x) => x !== null && x !== undefined && x !== '').join(' · ')
  if (table === 'personal_tasks')         return { title: `${item.status === 'done' ? '✓ ' : ''}${item.title}`, sub: j(item.priority, item.domain, item.due_at) }
  if (table === 'personal_affiliations')  return { title: (item.entity as string) || `${item.kind} — unknown`, sub: j(item.kind, item.regime, item.status, item.next_action) }
  if (table === 'personal_accounts')      return { title: item.institution as string, sub: j(item.kind, item.country, item.currency, item.last4 && `••${item.last4}`, item.status) }
  if (table === 'personal_subscriptions') return { title: item.provider as string, sub: j(item.amount && `${item.amount} ${item.currency}`, item.cadence, item.billing_day && `day ${item.billing_day}`, item.status) }
  if (table === 'personal_payments')      return { title: `${item.provider} · ${item.amount} ${item.currency}`, sub: j(item.paid_at, item.paid_with, item.source, item.invoice_path && '📎 invoice') }
  if (table === 'personal_debts')         return { title: item.creditor as string, sub: j(item.kind, item.balance && `balance ${item.balance} ${item.currency}`, item.min_payment && `${item.min_payment}/mo`, item.status) }
  if (table === 'personal_phone_lines')   return { title: item.label as string, sub: j(item.number_e164, item.carrier, item.plan_kind, (item.used_for_2fa as string[])?.length ? `2FA: ${(item.used_for_2fa as string[]).join(', ')}` : '') }
  if (table === 'personal_emails')        return { title: item.address as string, sub: j(item.role, item.provider, item.mfa_method) }
  if (table === 'personal_account_links') return { title: item.service as string, sub: j(item.email, item.phone, item.status) }
  if (table === 'personal_entities')      return { title: item.name as string, sub: j(item.legal_form, item.country, item.my_role, item.next_obligation) }
  return { title: JSON.stringify(item), sub: '' }
}

function ListEditor({ table, initialItems }: { table: string; initialItems: Record<string, unknown>[] }) {
  const [list, setList] = useState(initialItems)
  const [editing, setEditing] = useState<number | null>(null) // -1 = new

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    await deleteRecord(table, id)
    setList(l => l.filter(i => i.id !== id))
    setEditing(null)
  }

  function handleSaved(saved: Record<string, unknown>, id: number | null) {
    if (id === null) {
      window.location.reload()
    } else {
      setList(l => l.map(i => (i.id === id ? { ...i, ...saved } : i)))
      setEditing(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {list.map((item) => {
        const id = item.id as number
        const { title, sub } = cardSummary(table, item)
        const open = editing === id
        return (
          <div key={id} className="border border-border rounded-lg overflow-hidden">
            {/* Card header — always visible */}
            <div className="flex items-center gap-3 px-4 py-3 bg-surface">
              {(item.logo_url as string) && (
                <Image src={item.logo_url as string} alt="" width={32} height={32}
                  className="rounded border border-border object-contain bg-surface-2 p-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{title}</p>
                <p className="text-xs text-text-dim truncate">{sub}</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={() => setEditing(open ? null : id)}
                  className="text-xs font-mono text-accent hover:underline">
                  {open ? 'Close' : 'Edit'}
                </button>
                <button onClick={() => handleDelete(id)}
                  className="text-xs font-mono text-red-400 hover:underline">Delete</button>
              </div>
            </div>
            {/* Inline form — visible when editing */}
            {open && (
              <div className="px-4 py-4 border-t border-border bg-bg">
                <RecordForm table={table} initial={item}
                  onSave={(s) => handleSaved(s, id)} onCancel={() => setEditing(null)} />
              </div>
            )}
          </div>
        )
      })}

      {/* Add new */}
      <div className="border border-dashed border-border rounded-lg overflow-hidden mt-1">
        <button onClick={() => setEditing(editing === -1 ? null : -1)}
          className="w-full text-left px-4 py-3 text-xs font-mono text-accent hover:bg-surface transition-colors">
          {editing === -1 ? '✕ Cancel new' : '+ Add new'}
        </button>
        {editing === -1 && (
          <div className="px-4 py-4 border-t border-border bg-bg">
            <RecordForm table={table} initial={{}}
              onSave={(s) => handleSaved(s, null)} onCancel={() => setEditing(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Dashboard shell ─────────────────────────────────────────────────────────

export default function AdminDashboard({ initialData = {}, tabs = SITE_TABS, title = 'Site & CV' }: {
  initialData?: Partial<PortfolioData>
  tabs?: string[]
  title?: string
}) {
  const [tab, setTab] = useState(tabs[0])
  const [tabData, setTabData] = useState<unknown>(tabs[0] === 'Profile' ? initialData.profile : undefined)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchTab = useCallback(async (t: string) => {
    setLoading(true)
    const table = TABLE_MAP[t]
    const isList = LIST_TABS.has(t)
    try {
      const q = supabase.from(table).select('*')
      const { data } = isList ? await q.order('order') : await q.single()
      setTabData(data)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  function switchTab(t: string) {
    setTab(t)
    fetchTab(t)
  }

  // Fetch initial tab data fresh on mount too
  useEffect(() => { fetchTab(tabs[0]) }, [fetchTab, tabs])


  const table = TABLE_MAP[tab]
  const isList = LIST_TABS.has(tab)

  return (
    <div>
      <div className="max-w-3xl">
        <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary mb-6">
          <span className="data-pulse" />{title}
        </h1>

        <div className="flex flex-wrap gap-0.5 mb-8">
          {tabs.length > 1 && tabs.map((t) => (
            <button key={t} onClick={() => switchTab(t)}
              className={`text-xs font-mono px-3 py-2 transition-colors ${
                tab === t ? 'bg-surface-container-high text-primary shadow-[inset_0_-2px_0_#00D1FF]' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-5">{tab}</h2>
          {loading ? (
            <p className="text-xs font-mono text-muted animate-pulse">Loading…</p>
          ) : isList ? (
            <ListEditor key={tab} table={table} initialItems={(tabData as Record<string, unknown>[]) ?? []} />
          ) : (
            <RecordForm key={tab} table={table} initial={(tabData as Record<string, unknown>) ?? {}} onSave={() => {}} />
          )}
        </div>
      </div>
    </div>
  )
}
