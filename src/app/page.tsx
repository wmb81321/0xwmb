export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PortfolioData } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
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
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <Hero profile={data.profile} contact={data.contact} languages={data.languages} />

        {/* ── Experience ───────────────────────────────────────────── */}
        <ExperienceSection experiences={data.experiences} />

        {/* ── Projects ─────────────────────────────────────────────── */}
        <ProjectsSection projects={data.projects} />

        {/* ── Skills + Education / Certs (side by side) ────────────── */}
        <section id="skills" className="section-anchor py-20 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left: Technical + Core competencies */}
            <div className="flex flex-col gap-12">
              <SkillsSection skills={data.skills} />
            </div>

            {/* Right: Education + Credentials */}
            <div className="flex flex-col gap-12">
              <EducationSection education={data.education} />
              {data.certificates.length > 0 && (
                <CertificatesSection certificates={data.certificates} />
              )}
            </div>
          </div>
        </section>

        {/* ── Contact CTA ──────────────────────────────────────────── */}
        <section id="contact" className="py-24 px-6 bg-surface-container-lowest">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="data-pulse" />
              <span className="text-xs tracking-[0.2em] text-on-surface-variant uppercase">
                Initiate_Contact
              </span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Ready to connect, collaborate, or explore opportunities in Web3, DeFi, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {data.contact.email && (
                <a href={`mailto:${data.contact.email}`}
                  className="bg-cta text-on-primary text-xs font-semibold tracking-widest uppercase px-8 py-3 hover:opacity-90 transition-opacity">
                  Send_Message
                </a>
              )}
              <div id="download-cv">
                <DownloadCV data={data} />
              </div>
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
