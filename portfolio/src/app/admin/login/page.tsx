'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-lg font-mono text-accent">Admin Login</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent" required />
        <button type="submit" disabled={loading}
          className="bg-accent text-white rounded px-4 py-2 text-sm font-mono hover:bg-accent-dim disabled:opacity-50 transition-colors">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
