import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { PortfolioData } from '@/lib/types'
import DownloadCV from '@/components/DownloadCVNoSSR'
import { socialsOf } from '@/components/home/socials'
import { CONTAINER, ExtLink } from '@/components/home/primitives'

/** Order of a cover line in the entrance stagger. */
const order = (i: number) => ({ '--i': i }) as CSSProperties

export default function Hero({ data }: { data: PortfolioData }) {
  const { profile, contact } = data

  return (
    <section id="top" className={`${CONTAINER} grid gap-8 pt-8 pb-6 lg:grid-cols-12 lg:gap-10 lg:pt-12 lg:pb-10`}>
      <div className="flex flex-col lg:col-span-8">
        <h1 style={order(0)} className="enter font-display font-normal text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.02] tracking-[-0.025em]">
          {profile.name}
        </h1>
        <p style={order(1)} className="enter mt-4 text-title-sm font-medium text-ink lg:text-xl">{profile.title}</p>
        <p style={order(2)} className="enter mt-4 max-w-152 text-lg leading-relaxed text-ink-muted lg:text-lead">{profile.summary}</p>
        <div style={order(3)} className="enter mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="press inline-flex min-h-13 items-center bg-inst px-7 text-ui font-medium text-paper hover:bg-inst-strong">
              Email {contact.email}
            </a>
          )}
          <DownloadCV data={data} className="text-ui text-inst hover:text-inst-strong" />
        </div>
      </div>

      <aside className="lg:col-span-4" aria-label="Profiles">
        {profile.photo_url && (
          <div className="plate-in relative aspect-[4/3] w-full overflow-hidden bg-rule sm:aspect-square">
            <Image src={profile.photo_url} alt={profile.name} fill priority
              sizes="(min-width: 1024px) 380px, 100vw" className="object-cover object-[50%_72%]" />
          </div>
        )}
        <ul style={order(5)} className="enter mt-5 grid grid-cols-1 border-b border-rule sm:grid-cols-2 lg:grid-cols-1">
          {socialsOf(contact).map((s) => (
            <li key={s.key} className="border-t border-rule">
              <ExtLink href={s.url} label={`${s.label}: ${s.handle}`}
                className="group flex min-h-11 items-center gap-3 text-ui transition-colors hover:bg-ink/[0.03] sm:pr-4 lg:pr-0">
                <Image src={s.icon} alt="" width={24} height={24} className="logo-quiet size-6 mix-blend-multiply" />
                <span className="font-medium">{s.label}</span>
                <span className="ml-auto truncate text-mono-xs text-ink-muted group-hover:text-inst">{s.handle}</span>
              </ExtLink>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}
