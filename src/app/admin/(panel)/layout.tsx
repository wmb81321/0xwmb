export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isStrongSession } from '@/lib/auth'
import AdminShell from './AdminShell'
import { areaSummaries } from '@/lib/areas-status'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!roleRow) redirect('/admin/login?error=unauthorized')

  // Every panel page requires a strong session: passkey sign-in, or password/OAuth + TOTP (recovery).
  if (!(await isStrongSession(supabase))) redirect('/admin/login/mfa')

  return (
    <AdminShell email={user.email ?? ''} role={roleRow.role}
      areas={(await areaSummaries()).map(({ slug, name, status }) => ({ slug, name, status }))}>
      {children}
    </AdminShell>
  )
}
