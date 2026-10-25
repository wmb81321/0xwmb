'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Passkey = { id: string; friendly_name?: string; created_at: string; last_used_at?: string }

// Manage the passkeys that sign in to the admin. Keep at least two (e.g. iCloud Keychain + 1Password).
export default function SecurityPage() {
  const supabase = createClient()
  const [keys, setKeys] = useState<Passkey[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.auth.passkey.list()
    if (error) setError(error.message)
    else setKeys((data as Passkey[]) ?? [])
  }, [supabase])

  useEffect(() => {
    let live = true
    supabase.auth.passkey.list().then(({ data, error }) => {
      if (!live) return
      if (error) setError(error.message)
      else setKeys((data as Passkey[]) ?? [])
    })
    return () => { live = false }
  }, [supabase])

  async function add() {
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.registerPasskey()
    if (error) setError(error.message)
    await load()
    setBusy(false)
  }

  async function remove(id: string) {
    if (keys.length <= 1) return setError('Keep at least one passkey — it is the only way to sign in.')
    if (!confirm('Remove this passkey?')) return
    const { error } = await supabase.auth.passkey.delete({ passkeyId: id })
    if (error) setError(error.message)
    await load()
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary">
        <span className="data-pulse" />Security
      </h1>

      <div className={`p-4 font-mono text-xs ${keys.length >= 2 ? 'bg-surface-container-low text-on-surface-variant' : 'bg-surface-container-low text-tertiary-container shadow-[inset_0_0_0_1px_rgba(242,210,255,.35)]'}`}>
        {keys.length === 0 && '◌ NO PASSKEY YET — add one now. Login is passkey-only.'}
        {keys.length === 1 && '◌ ONE PASSKEY — add a second one (another device or password manager) so you never get locked out.'}
        {keys.length >= 2 && `● ${keys.length} PASSKEYS REGISTERED`}
      </div>

      <div className="flex flex-col gap-0.5">
        {keys.map((k) => (
          <div key={k.id} className="bg-surface-container-low px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-primary font-semibold">{k.friendly_name ?? 'Passkey'}</div>
              <div className="font-mono text-xs text-outline">
                added {new Date(k.created_at).toLocaleDateString()}
                {k.last_used_at && ` · last used ${new Date(k.last_used_at).toLocaleDateString()}`}
              </div>
            </div>
            <button onClick={() => remove(k.id)} className="font-mono text-xs text-outline hover:text-error">REMOVE</button>
          </div>
        ))}
      </div>

      <button onClick={add} disabled={busy}
        className="self-start bg-cta text-on-primary font-semibold tracking-wide px-6 py-3 text-sm disabled:opacity-50">
        {busy ? 'FOLLOW YOUR DEVICE PROMPT…' : '+ ADD PASSKEY'}
      </button>

      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  )
}
