import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { PortfolioData } from '@/lib/types'
import DownloadCV from '@/components/DownloadCVNoSSR'
import KeyFigures, { type Figure } from '@/components/home/KeyFigures'
import { CONTAINER } from '@/components/home/primitives'

const LANG_CODES: Record<string, string> = {
  spanish: 'ES', english: 'EN', french: 'FR', portuguese: 'PT', german: 'DE', italian: 'IT',
}
const langCode = (name: string) => LANG_CODES[name.trim().toLowerCase()] ?? name.slice(0, 2).toUpperCase()
/** Order of a cover line in the entrance stagger. */
const order = (i: number) => ({ '--i': i }) as CSSProperties
const firstYear = (s?: string | null) => s?.match(/\d{4}/)?.[0]

function keyFigures({ projects, experiences, volunteering, languages }: PortfolioData): Figure[] {
  const since = experiences.map((e) => firstYear(e.years)).filter(Boolean).sort()[0]
  const figures: Figure[] = [
    {
      label: 'Ventures founded',
      value: String(projects.length),
      note: `${projects.map((p) => p.name).join(', ')}.`,
    },
    {
      label: since ? `Roles held since ${since}` : 'Roles held',
      value: String(experiences.length),
      note: `${experiences.map((e) => e.company).join(', ')}.`,
    },
  ]
  if (volunteering.length > 0) {
    figures.push({
      label: 'Ethereum Foundation events',
      value: String(volunteering.length),
      note: `${volunteering.map((v) => v.reason.replace(/\s+/g, ' ').replace(/^Volunteer\s+(Lead\s+)?/i, '').trim()).join(', ')}.`,
    })
  }
  if (languages.length > 0) {
    figures.push({
      label: 'Working languages',
      value: languages.map((l) => langCode(l.name)).join(' · '),
      note: `${languages.map((l) => `${l.name} ${l.level.split(/\s/)[0]}`).join(', ')}.`,
    })
  }
  return figures
}

export default function Hero({ data }: { data: PortfolioData }) {
  const { profile, contact } = data

  return (
    <section id="top" className={`${CONTAINER} grid gap-12 pt-10 pb-16 lg:grid-cols-12 lg:gap-10 lg:pt-12 lg:pb-14`}>
      <div className="flex flex-col lg:col-span-8">
        <h1 style={order(0)} className="enter font-display font-normal text-[clamp(3rem,5.6vw,5rem)] leading-[1.02] tracking-[-0.025em]">
          {profile.name}
        </h1>
        <p style={order(1)} className="enter mt-5 text-title-sm font-medium text-ink lg:text-xl">{profile.title}</p>
        <p style={order(2)} className="enter mt-5 max-w-152 text-lg leading-relaxed text-ink-muted lg:text-lead">{profile.summary}</p>
        <div style={order(3)} className="enter mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="press inline-flex min-h-13 items-center bg-inst px-7 text-ui font-medium text-paper hover:bg-inst-strong">
              Email {contact.email}
            </a>
          )}
          <DownloadCV data={data} className="text-ui text-inst hover:text-inst-strong" />
        </div>
      </div>

      <aside className="lg:col-span-4" aria-label="At a glance">
        {profile.photo_url && (
          <div className="plate-in relative aspect-square w-full overflow-hidden bg-rule">
            <Image src={profile.photo_url} alt={profile.name} fill priority
              sizes="(min-width: 1024px) 380px, 100vw" className="object-cover object-[50%_72%]" />
          </div>
        )}
        <div style={order(5)} className="enter mt-6">
          <KeyFigures figures={keyFigures(data)} />
        </div>
      </aside>
    </section>
  )
}
