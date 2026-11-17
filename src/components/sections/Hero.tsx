import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { PortfolioData } from '@/lib/types'
import { socialsOf } from '@/components/home/socials'
import { CONTAINER, ExtLink } from '@/components/home/primitives'

/** "C2 - Native" → { label: "Native", code: "C2" }. */
function level(raw: string) {
  const [a, b] = raw.split(/\s*[-–—]\s*/)
  return /^[ABC][12]$/i.test(a ?? '') ? { label: b ?? a, code: b ? a : '' } : { label: raw, code: '' }
}

/** Order of a cover line in the entrance stagger. */
const order = (i: number) => ({ '--i': i }) as CSSProperties

export default function Hero({ data }: { data: PortfolioData }) {
  const { profile, contact, languages } = data

  return (
    <section id="top" className={`${CONTAINER} grid gap-8 pt-12 pb-6 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-10`}>
      <div className="flex flex-col lg:col-span-8">
        <h1 style={order(0)} className="enter font-display font-normal whitespace-nowrap text-[calc((100vw-2.5rem)/12.8)] sm:text-[min(4.5rem,calc((100vw-5rem)/12.2))] lg:text-[calc((min(100vw,80rem)-10rem)/18.5)] leading-[1.02] tracking-[-0.025em]">
          {profile.name}
        </h1>
        <p style={order(1)} className="enter mt-4 flex flex-col text-title-sm font-medium text-ink lg:text-xl">
          {profile.title.split(/\s*·\s*/).map((line) => <span key={line}>{line}</span>)}
        </p>
        <p style={order(2)} className="enter mt-4 max-w-152 text-lg leading-relaxed text-ink-muted lg:text-lead">{profile.summary}</p>

        {languages.length > 0 && (
          <dl style={order(3)} aria-label="Languages"
            className="enter mt-8 grid max-w-152 grid-cols-3 border-y border-rule lg:mt-auto">
            {[...languages].sort((x, y) => x.order - y.order).map((l, i) => {
              const { label, code } = level(l.level)
              return (
                <div key={l.id} className={`py-3 ${i > 0 ? 'border-l border-rule pl-4 sm:pl-5' : 'pr-4'}`}>
                  <dt className="text-ui font-semibold">{l.name}</dt>
                  <dd className="figures mt-0.5 text-mono-xs text-ink-muted">
                    {label}{code && ` (${code})`}
                  </dd>
                </div>
              )
            })}
          </dl>
        )}
      </div>

      <aside className="lg:col-span-4" aria-label="Portrait and profiles">
        {profile.photo_url && (
          <div className="plate-in relative aspect-[4/3] w-full overflow-hidden bg-rule sm:aspect-square">
            <Image src={profile.photo_url} alt={profile.name} fill priority
              sizes="(min-width: 1024px) 380px, 100vw" className="object-cover object-[50%_72%]" />
          </div>
        )}
        <ul style={order(5)} aria-label="Contact and profiles"
          className="enter mt-5 grid grid-cols-6 border-y border-rule">
          {contact.email && (
            <li className="flex justify-center">
              <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.email}`} title={contact.email}
                className="group flex size-12 items-center justify-center">
                <Image src="/socials/email.svg" alt="" width={28} height={28}
                  className="size-7 transition-transform duration-300 ease-(--ease-out-strong) group-hover:scale-[1.04]" />
              </a>
            </li>
          )}
          {socialsOf(contact).map((s) => (
            <li key={s.key} className="flex justify-center">
              <ExtLink href={s.url} label={`${s.label}: ${s.handle}`}
                className="group flex size-12 items-center justify-center">
                <Image src={s.icon} alt="" width={28} height={28} title={`${s.label} ${s.handle}`}
                  className="logo-quiet size-7 mix-blend-multiply" />
              </ExtLink>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}
