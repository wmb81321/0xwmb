export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: profile },
    { data: experiences },
    { data: projects },
    { data: education },
    { data: certificates },
    { data: volunteering },
    { data: skills },
    { data: languages },
    { data: contact },
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('experiences').select('*').order('order'),
    supabase.from('projects').select('*').order('order'),
    supabase.from('education').select('*').order('order'),
    supabase.from('certificates').select('*').order('order'),
    supabase.from('volunteering').select('*').order('order'),
    supabase.from('skills').select('*').order('order'),
    supabase.from('languages').select('*').order('order'),
    supabase.from('contact').select('*').single(),
  ])

  return (
    <AdminDashboard
      initialData={{
        profile: profile ?? undefined,
        experiences: experiences ?? undefined,
        projects: projects ?? undefined,
        education: education ?? undefined,
        certificates: certificates ?? undefined,
        volunteering: volunteering ?? undefined,
        skills: skills ?? undefined,
        languages: languages ?? undefined,
        contact: contact ?? undefined,
      }}
    />
  )
}
