export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PortfolioData } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Summary from '@/components/sections/Summary'
import ExperienceSection from '@/components/sections/Experience'
import ProjectsSection from '@/components/sections/Projects'
import EducationSection from '@/components/sections/Education'
import CertificatesSection from '@/components/sections/Certificates'
import SkillsSection from '@/components/sections/Skills'
import DownloadCV from '@/components/DownloadCVNoSSR'

async function getPortfolioData(): Promise<PortfolioData> {
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
    skills: skills || [],
    languages: languages || [],
    contact,
  }
}

export default async function Page() {
  const data = await getPortfolioData()

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={data.profile} contact={data.contact} languages={data.languages} />
        <Summary text={data.profile.summary} />
        <ExperienceSection experiences={data.experiences} />
        <ProjectsSection projects={data.projects} />
        <EducationSection education={data.education} />
        <CertificatesSection certificates={data.certificates} />
        <SkillsSection skills={data.skills} />
        <div id="download-cv" className="py-12 px-6 max-w-5xl mx-auto border-t border-border flex justify-center">
          <DownloadCV data={data} />
        </div>
      </main>
      <footer className="py-8 px-6 text-center border-t border-border">
        <p className="text-xs font-mono text-muted">Built with Ethereum in mind</p>
      </footer>
    </>
  )
}
