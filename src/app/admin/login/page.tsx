'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

// Passkey-only sign-in. The email form is a break-glass path shown only with ?recovery=1,
// and it only works while the Email provider is enabled in Supabase (it's disabled in normal operation).
function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const params = useSearchParams()
  const recovery = params.get('recovery') === '1'
  const urlError = params.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  async function passkey() {
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPasskey()
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  async function emailLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!password) return setError('Enter your password, or use the email link below.')
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    router.replace('/admin/login/mfa')
  }

  // Recovery without a password: emails a one-time sign-in link. Never creates new users.
  async function emailLink() {
    if (!email) return setError('Enter your email first.')
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setBusy(false)
    if (error) return setError(error.message)
    setSent(true)
  }

  const shownError =
    error || (urlError === 'unauthorized' ? 'This account has no admin access.' : urlError ? 'Sign-in failed. Try again.' : '')

  return (
    <div className="bg-surface-container-low w-full max-w-md p-8 flex flex-col gap-6">
      <div className="font-mono text-xs text-primary-container tracking-[0.08em]">&gt; sudo login</div>
      <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-primary">
        Restricted<br /><span className="text-primary-container">access.</span>
      </h1>
      <p className="text-sm text-on-surface-variant">Passkey only. Face ID, Touch ID or your password manager.</p>

      {shownError && <p className="text-error text-sm">{shownError}</p>}

      <button onClick={passkey} disabled={busy}
        className="bg-cta text-on-primary font-semibold tracking-wide py-4 text-sm disabled:opacity-50 flex items-center justify-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 9.5-4.9M17 11a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM17 17v5M15 20h2" />
        </svg>
        {busy && !recovery ? 'WAITING FOR PASSKEY…' : 'SIGN IN WITH PASSKEY'}
      </button>

      {recovery && (
        <form onSubmit={emailLogin} className="flex flex-col gap-4 pt-2">
          <div className="font-mono text-xs text-tertiary-container tracking-[0.08em]">RECOVERY · EMAIL + 2FA CODE</div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="bg-transparent border-0 border-b border-outline focus:border-b-2 focus:border-primary focus:outline-none py-2 text-sm placeholder:text-outline" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-0 border-b border-outline focus:border-b-2 focus:border-primary focus:outline-none py-2 text-sm placeholder:text-outline" />
          <button type="submit" disabled={busy}
            className="font-mono text-xs text-primary py-3 shadow-[inset_0_0_0_1px_rgba(226,248,255,.22)] hover:text-primary-container disabled:opacity-50">
            CONTINUE →
          </button>
          <button type="button" onClick={emailLink} disabled={busy || sent}
            className="font-mono text-xs text-outline hover:text-primary disabled:opacity-60 text-left">
            {sent ? '✓ LINK SENT — check your inbox (same browser)' : 'Forgot password? Email me a sign-in link →'}
          </button>
        </form>
      )}

      <div className="font-mono text-xs text-outline flex flex-col gap-1">
        <span>[OK] role check · user_roles</span>
        <span>[OK] row-level security · owner only</span>
        <span className="text-tertiary-container">[REQ] passkey</span>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
