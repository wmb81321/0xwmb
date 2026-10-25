import { createServerSupabaseClient } from '@/lib/supabase-server'

export type Role = 'owner' | 'accountant' | 'family'

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

// Throws unless the caller has one of the given roles. Use at the top of every server action.
export async function requireRole(roles: Role[]): Promise<Role> {
  const role = await getRole()
  if (!role || !roles.includes(role)) throw new Error('Unauthorized')
  return role
}
