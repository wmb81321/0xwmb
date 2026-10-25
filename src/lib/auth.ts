import { createServerSupabaseClient } from '@/lib/supabase-server'

export type Role = 'owner' | 'accountant' | 'family'

// AMR methods that count as a strong sign-in on their own (phishing-resistant passkey).
// Passkey sign-in is aal1 in Supabase, so it's accepted explicitly alongside aal2 (password/OAuth + TOTP).
const PASSKEY_METHODS = new Set(['passkey', 'webauthn', 'mfa/webauthn'])

type Supabase = Awaited<ReturnType<typeof createServerSupabaseClient>>

export async function isStrongSession(supabase: Supabase): Promise<boolean> {
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (!data) return false
  if (data.currentLevel === 'aal2') return true
  return data.currentAuthenticationMethods.some((m) =>
    PASSKEY_METHODS.has(typeof m === 'string' ? m : m.method),
  )
}

// Returns the signed-in user's role, or null if not signed in / no role assigned.
export async function getRole(): Promise<Role | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  return (data?.role as Role) ?? null
}

// Throws unless the caller has one of the given roles and a strong session (passkey, or 2FA).
// Use at the top of every server action.
export async function requireRole(roles: Role[]): Promise<Role> {
  const role = await getRole()
  if (!role || !roles.includes(role)) throw new Error('Unauthorized')
  const supabase = await createServerSupabaseClient()
  if (!(await isStrongSession(supabase))) throw new Error('Passkey or second factor required')
  return role
}
