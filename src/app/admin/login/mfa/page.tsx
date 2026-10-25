'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Mode = 'loading' | 'enroll' | 'verify'

// Second factor (TOTP). Enrolls an authenticator on first use, otherwise verifies a code.
// Reaching aal2 here is what unlocks every /admin panel page and owner-only writes.
export default function MfaPage() {
  const supabase = createClient()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('loading')
  const [factorId, setFactorId] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.replace('/admin/login')

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.currentLevel === 'aal2') return router.replace('/admin')

      const { data: factors } = await supabase.auth.mfa.listFactors()
      const verified = factors?.totp.find((f) => f.status === 'verified')
      if (verified) {
        setFactorId(verified.id)
        setMode('verify')
        return
      }
      // Drop half-finished enrollments so a fresh QR can be issued.
      for (const f of factors?.all ?? []) {
        if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id })
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: '0xwomb admin' })
      if (error || !data) return setError(error?.message ?? 'Could not start enrollment')
      setFactorId(data.id)
      setQr(data.totp.qr_code)
      setSecret(data.totp.secret)
      setMode('enroll')
    })()
  }, [supabase, router])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() })
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  async function cancel() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4">
    <div className="bg-surface-container-low w-full max-w-md p-8 flex flex-col gap-6">
      <div className="font-mono text-xs tracking-[0.08em] flex gap-0.5">
        <div className="flex-1 py-2 text-outline shadow-[inset_0_-2px_0_#7f909e]">01 IDENTITY</div>
        <div className="flex-1 py-2 text-primary-container shadow-[inset_0_-2px_0_#00D1FF]">02 SECOND FACTOR</div>
      </div>

      <h1 className="flex items-center gap-3 text-2xl font-semibold text-primary">
        <span className="data-pulse" />
        {mode === 'enroll' ? 'Set up 2FA' : '2FA code'}
      </h1>

      {mode === 'loading' && !error && <p className="font-mono text-xs text-outline animate-pulse">Checking session…</p>}

      {mode === 'enroll' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Scan this with your authenticator app (1Password, Bitwarden, Aegis, Google Authenticator), then enter the 6-digit code.
          </p>
          {/* Supabase returns the QR as an SVG data URI */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="TOTP QR code" className="w-48 h-48 bg-white p-2 self-start" />
          <div className="font-mono text-xs text-outline break-all">
            Can’t scan? Secret: <span className="text-primary select-all">{secret}</span>
          </div>
        </div>
      )}

      {mode === 'verify' && (
        <p className="text-sm text-on-surface-variant">Enter the 6-digit code from your authenticator app.</p>
      )}

      {(mode === 'enroll' || mode === 'verify') && (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="bg-transparent border-0 border-b border-outline focus:border-b-2 focus:border-primary focus:outline-none py-2 font-mono text-3xl tracking-[0.5em] text-primary placeholder:text-surface-bright"
          />
          <button type="submit" disabled={busy || code.length !== 6}
            className="bg-cta text-on-primary font-semibold tracking-wide py-3 text-sm disabled:opacity-50">
            {busy ? 'VERIFYING…' : 'VERIFY & ENTER'}
          </button>
        </form>
      )}

      {error && <p className="text-error text-sm">{error}</p>}

      <button onClick={cancel} className="font-mono text-xs text-outline hover:text-primary self-start">← Use another account</button>
    </div>
    </div>
  )
}
