export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PortfolioData } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import ExperienceSection from '@/components/sections/Experience'
import ProjectsSection from '@/components/sections/Projects'
import Credentials from '@/components/sections/Credentials'
import { ExpertiseSection, ToolsSection } from '@/components/sections/Skills'
import ContactSection from '@/components/sections/Contact'

async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = await createServerSupabaseClient()

  const [
    { data: profile },
    { data: experiences },
    { data: projects },
    { data: education },
    { data: certificates },
    { data: volunteering },
    { data: achievements },
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
    supabase.from('achievements').select('*').order('order'),
    supabase.from('skills').select('*').order('order'),
    supabase.from('languages').select('*').order('order'),
    supabase.from('contact').select('*').single(),
  ])

  if (!profile || !contact) {
    throw new Error('Failed to load required portfolio data — check Supabase env vars and RLS policies')
  }

  return {
    profile,
    experiences: experiences || [],
    projects: projects || [],
    education: education || [],
    certificates: certificates || [],
    volunteering: volunteering || [],
    achievements: achievements || [],
    skills: skills || [],
    languages: languages || [],
    contact,
  }
}

export default async function Page() {
  const data = await getPortfolioData()
  const now = new Date()

  return (
    <div className="prospectus min-h-screen">
      <Navbar name={data.profile.name} email={data.contact.email} />
      <main>
        <Hero data={data} />
        <ExperienceSection experiences={data.experiences} />
        <ProjectsSection projects={data.projects} />
        <Credentials
          education={data.education}
          certificates={data.certificates}
          volunteering={data.volunteering}
          achievements={data.achievements}
        />
        <ExpertiseSection skills={data.skills} />
        <ToolsSection skills={data.skills} />
        <ContactSection data={data} year={now.getFullYear()} />
      </main>
    </div>
  )
}
