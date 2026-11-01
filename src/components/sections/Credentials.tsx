import type { Achievement, Certificate, Education, Volunteering } from '@/lib/types'
import { domainOf, yearSpan } from '@/lib/portfolio-format'
import { DocLink, DocSection } from '@/components/home/primitives'

interface Entry {
  key: string
  title: string
  meta: string
  url?: string | null
}

const EF_URL = 'https://ethereum.foundation'

function Column({ label, entries }: { label: string; entries: Entry[] }) {
  return (
    <div className="reveal">
      <div className="h-px bg-rule" aria-hidden />
      <h3 className="mt-4 text-ui font-semibold">{label}</h3>
      <ul className="mt-5 flex flex-col gap-5">
        {entries.map((e) => (
          <li key={e.key}>
            <p className="font-medium leading-snug">{e.title}</p>
            <p className="figures mt-1 text-mono-xs leading-relaxed text-ink-muted">{e.meta}</p>
            {e.url && <DocLink href={e.url} className="mt-1 inline-block text-mono-xs">{domainOf(e.url)}</DocLink>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** "Volunteer Lead  DEVCONNECT Argentina" → "Volunteer Lead, DEVCONNECT Argentina" */
function volunteerTitle(reason: string): string {
  const clean = reason.replace(/\s+/g, ' ').trim()
  const m = clean.match(/^(Volunteer(?: Lead)?)\s+(.*)$/i)
  return m ? `${m[1]}, ${m[2]}` : clean
}

export default function Credentials({ education, certificates, volunteering, achievements }: {
  education: Education[]
  certificates: Certificate[]
  volunteering: Volunteering[]
  achievements: Achievement[]
}) {
  const edu: Entry[] = education.map((e) => ({
    key: `edu-${e.id}`,
    title: e.field_of_study ? `${e.degree}, ${e.field_of_study}` : e.degree,
    meta: [e.institution, e.description, yearSpan(e.years, e.start_date, e.end_date)].filter(Boolean).join(' · '),
    url: e.website,
  }))

  const certs: Entry[] = certificates.map((c) => ({
    key: `cert-${c.id}`,
    title: c.name,
    meta: [c.issuer, c.year].filter(Boolean).join(' · '),
    url: c.website,
  }))

  const awards: Entry[] = [
    ...achievements.filter((a) => a.type === 'achievement').map((a) => ({
      key: `ach-${a.id}`,
      title: a.title,
      meta: [a.description, a.year].filter(Boolean).join(' · '),
      url: a.link,
    })),
    ...[...volunteering].sort((a, b) => b.year.localeCompare(a.year)).map((v) => ({
      key: `vol-${v.id}`,
      title: volunteerTitle(v.reason),
      meta: [v.issuer.trim(), v.year].filter(Boolean).join(' · '),
      url: /ethereum foundation/i.test(v.issuer) ? EF_URL : undefined,
    })),
  ]

  if (edu.length + certs.length + awards.length === 0) return null

  return (
    <DocSection id="credentials" title="Credentials">
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {edu.length > 0 && <Column label="Education" entries={edu} />}
        {certs.length > 0 && <Column label="Certificates" entries={certs} />}
        {awards.length > 0 && <Column label="Awards and community" entries={awards} />}
      </div>
    </DocSection>
  )
}
