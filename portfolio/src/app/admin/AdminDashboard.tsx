'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { upsertRecord, deleteRecord, uploadLogo } from './actions'
import { createClient } from '@/lib/supabase'
import type { PortfolioData } from '@/lib/types'

// ─── Field config ────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'image' | 'array' | 'keyvalue' | 'select'
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
    { key: 'name',    label: 'Name',                    type: 'text' },
    { key: 'role',    label: 'Role',                    type: 'text' },
    { key: 'years',   label: 'Period',                  type: 'text' },
    { key: 'brief',   label: 'Brief',                   type: 'text' },
    { key: 'website', label: 'Website',                 type: 'url' },
    { key: 'logo_url',label: 'Logo',                    type: 'image' },
    { key: 'socials', label: 'Socials (key → url)',     type: 'keyvalue' },
    { key: 'points',  label: 'Bullet points',           type: 'array' },
    { key: 'order',   label: 'Order',                   type: 'number' },
  ],
  education: [
    { key: 'degree',         label: 'Degree',          type: 'text' },
    { key: 'institution',    label: 'Institution',     type: 'text' },
    { key: 'years',          label: 'Period',           type: 'text' },
    { key: 'abroad_program', label: 'Abroad program',  type: 'text' },
    { key: 'website',        label: 'Website',         type: 'url' },
    { key: 'linkedin',       label: 'LinkedIn',        type: 'url' },
    { key: 'twitter',        label: 'X / Twitter',     type: 'url' },
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
    { key: 'name',    label: 'Name',   type: 'text' },
    { key: 'issuer',  label: 'Issuer', type: 'text' },
    { key: 'year',    label: 'Year',   type: 'text' },
    { key: 'logo_url',label: 'Logo',   type: 'image' },
    { key: 'order',   label: 'Order',  type: 'number' },
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
}

const TABLE_MAP: Record<string, string> = {
  Profile: 'profile', Experience: 'experiences', Projects: 'projects',
  Education: 'education', Certificates: 'certificates', Volunteering: 'volunteering',
  Skills: 'skills', Languages: 'languages', Contact: 'contact', Jobs: 'job_applications',
}

const LIST_TABS = new Set(['Experience', 'Projects', 'Education', 'Certificates', 'Volunteering', 'Skills', 'Languages', 'Jobs'])

// ─── Primitives ──────────────────────────────────────────────────────────────

const inputCls = 'w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent transition-colors placeholder:text-muted'
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

function KeyValueField({ label, value, onChange }: { label: string; value: Record<string, string>; onChange: (v: Record<string, string>) => void }) {
  const entries = Object.entries(value)
  function set(idx: number, k: string, v: string) {
    onChange(Object.fromEntries(entries.map(([ek, ev], i) => i === idx ? [k, v] : [ek, ev])))
  }
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col gap-1.5">
        {entries.map(([k, v], i) => (
          <div key={i} className="flex gap-2">
            <input value={k} onChange={e => set(i, e.target.value, v)} placeholder="key"
              className="w-1/3 bg-surface border border-border rounded px-2 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent" />
            <input value={v} onChange={e => set(i, k, e.target.value)} placeholder="value" className={`flex-1 ${inputCls}`} />
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
        if (f.type === 'array') return (
          <ArrayField key={f.key} label={f.label} value={(val as string[]) ?? []} onChange={v => set(f.key, v)} />
        )
        if (f.type === 'keyvalue') return (
          <KeyValueField key={f.key} label={f.label} value={(val as Record<string, string>) ?? {}} onChange={v => set(f.key, v)} />
        )
        if (f.type === 'select') return (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <select value={(val as string) ?? ''} onChange={e => set(f.key, e.target.value)} className={inputCls}>
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
            <input type={f.type === 'number' ? 'number' : 'text'}
              value={(val as string | number) ?? ''}
              onChange={e => set(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
              className={inputCls} />
          </div>
        )
      })}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button onClick={save} disabled={saving}
          className="bg-accent text-white text-xs px-5 py-2 rounded font-mono hover:bg-accent-dim disabled:opacity-50 transition-colors">
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
  if (table === 'volunteering') return { title: item.name as string, sub: `${item.issuer} · ${item.year}` }
  if (table === 'skills')       return { title: item.category as string, sub: `${item.type} · ${(item.items as string[])?.join(', ')}` }
  if (table === 'languages')         return { title: `${item.flag ?? ''} ${item.name}`, sub: item.level as string }
  if (table === 'job_applications')  return { title: `${item.position}`, sub: `${item.company} · ${item.status}` }
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

const TABS = ['Profile', 'Experience', 'Projects', 'Education', 'Certificates', 'Volunteering', 'Skills', 'Languages', 'Contact', 'Jobs']

export default function AdminDashboard({ initialData }: { initialData: Partial<PortfolioData> }) {
  const [tab, setTab] = useState('Profile')
  const [tabData, setTabData] = useState<unknown>(initialData.profile)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
  useEffect(() => { fetchTab('Profile') }, [fetchTab])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const table = TABLE_MAP[tab]
  const isList = LIST_TABS.has(tab)

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-accent text-lg tracking-wide">0xwmb / admin</h1>
          <div className="flex gap-4">
            <a href="/" className="text-xs text-text-dim hover:text-text transition-colors">← View site</a>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors">Logout</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-border">
          {TABS.map((t) => (
            <button key={t} onClick={() => switchTab(t)}
              className={`text-xs font-mono px-3 py-1.5 rounded transition-colors ${
                tab === t ? 'bg-accent text-white' : 'text-text-dim border border-border hover:border-accent hover:text-accent'
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
