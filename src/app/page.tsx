export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PortfolioData } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import ExperienceSection from '@/components/sections/Experience'
import ProjectsSection from '@/components/sections/Projects'
import AchievementsSection from '@/components/sections/Achievements'
import EducationSection from '@/components/sections/Education'
import CertificatesSection from '@/components/sections/Certificates'
import VolunteeringSection from '@/components/sections/Volunteering'
import SkillsSection from '@/components/sections/Skills'

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

  return (
    <>
      <Navbar data={data} />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <Hero profile={data.profile} contact={data.contact} languages={data.languages} />

        {/* ── Experience ───────────────────────────────────────────── */}
        <ExperienceSection experiences={data.experiences} />

        {/* ── Projects ─────────────────────────────────────────────── */}
        <ProjectsSection projects={data.projects} />

        {/* ── Achievements ─────────────────────────────────────────── */}
        <AchievementsSection achievements={data.achievements} />

        {/* ── Skills + Education / Certs / Volunteering ────────────── */}
        <section id="skills" className="section-anchor py-20 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left: Technical + Core competencies */}
            <div className="flex flex-col gap-12">
              <SkillsSection skills={data.skills} />
            </div>

            {/* Right: Education + Credentials + Volunteering */}
            <div className="flex flex-col gap-12">
              <EducationSection education={data.education} />
              {data.certificates.length > 0 && (
                <CertificatesSection certificates={data.certificates} />
              )}
              {data.volunteering.length > 0 && (
                <VolunteeringSection volunteering={data.volunteering} />
              )}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-outline-variant/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xs text-outline tracking-widest">0xwmb</span>
          <span className="text-xs text-outline">Built on Ethereum</span>
        </div>
      </footer>
    </>
  )
}
