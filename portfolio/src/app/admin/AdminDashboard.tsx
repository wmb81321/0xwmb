'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertRecord, deleteRecord } from './actions'
import { createClient } from '@/lib/supabase'
import type { PortfolioData } from '@/lib/types'

const TABS = ['Profile', 'Experience', 'Projects', 'Education', 'Certificates', 'Volunteering', 'Skills', 'Languages', 'Contact']

const TABLE_MAP: Record<string, string> = {
  Profile: 'profile', Experience: 'experiences', Projects: 'projects',
  Education: 'education', Certificates: 'certificates', Volunteering: 'volunteering',
  Skills: 'skills', Languages: 'languages', Contact: 'contact',
}

function JsonEditor({ table, data, onSave }: { table: string; data: Record<string, unknown>; onSave: () => void }) {
  const [value, setValue] = useState(JSON.stringify(data, null, 2))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    try {
      await upsertRecord(table, JSON.parse(value))
      onSave()
    } catch (e) {
      setError(String(e))
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea value={value} onChange={e => setValue(e.target.value)} rows={15}
        className="bg-surface-2 border border-border rounded p-3 text-xs font-mono text-text w-full focus:outline-none focus:border-accent" />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button onClick={save} disabled={saving}
        className="self-start bg-accent text-white text-xs px-4 py-2 rounded font-mono hover:bg-accent-dim disabled:opacity-50 transition-colors">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

function ListEditor({ table, items }: { table: string; items: Record<string, unknown>[] }) {
  const [list, setList] = useState(items)
  const [editing, setEditing] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    await deleteRecord(table, id)
    setList(list.filter(i => i.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {list.map((item) => (
        <div key={item.id as number} className="bg-surface-2 border border-border rounded p-3 flex justify-between items-start gap-4">
          <pre className="text-xs font-mono text-text-dim flex-1 overflow-auto">{JSON.stringify(item, null, 2)}</pre>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setEditing(editing === (item.id as number) ? null : (item.id as number))}
              className="text-xs text-accent hover:underline">Edit</button>
            <button onClick={() => handleDelete(item.id as number)}
              className="text-xs text-red-400 hover:underline">Delete</button>
          </div>
        </div>
      ))}
      {editing !== null && editing !== -1 && (
        <JsonEditor table={table} data={list.find(i => i.id === editing) || {}} onSave={() => setEditing(null)} />
      )}
      <button onClick={() => setEditing(-1)}
        className="self-start text-xs text-accent border border-accent px-3 py-1 rounded font-mono hover:bg-accent hover:text-white transition-colors">
        + Add new
      </button>
      {editing === -1 && (
        <JsonEditor table={table} data={{}} onSave={() => setEditing(null)} />
      )}
    </div>
  )
}

export default function AdminDashboard({ initialData }: { initialData: Partial<PortfolioData> }) {
  const [tab, setTab] = useState('Profile')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const DATA_MAP: Record<string, unknown> = {
    Profile: initialData.profile,
    Experience: initialData.experiences,
    Projects: initialData.projects,
    Education: initialData.education,
    Certificates: initialData.certificates,
    Volunteering: initialData.volunteering,
    Skills: initialData.skills,
    Languages: initialData.languages,
    Contact: initialData.contact,
  }

  const isArray = Array.isArray(DATA_MAP[tab])

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-accent text-lg">0xwmb Admin</h1>
          <div className="flex gap-4">
            <a href="/" className="text-xs text-text-dim hover:text-text">← View site</a>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">Logout</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-mono px-3 py-1.5 rounded transition-colors ${
                tab === t ? 'bg-accent text-white' : 'text-text-dim border border-border hover:border-accent hover:text-accent'
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div>
          <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-4">{tab}</h2>
          {isArray ? (
            <ListEditor table={TABLE_MAP[tab]} items={DATA_MAP[tab] as Record<string, unknown>[]} />
          ) : (
            <JsonEditor table={TABLE_MAP[tab]} data={DATA_MAP[tab] as Record<string, unknown>} onSave={() => {}} />
          )}
        </div>
      </div>
    </div>
  )
}
