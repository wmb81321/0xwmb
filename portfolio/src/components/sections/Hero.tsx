import Image from 'next/image'
import type { Profile, Contact, Language } from '@/lib/types'

interface HeroProps {
  profile: Profile
  contact: Contact
  languages: Language[]
}

const SOCIAL_ICONS: Record<string, string> = {
  linkedin:  '/socials/linkdn.png',
  github:    '/socials/github.png',
  twitter:   '/socials/x.png',
  farcaster: '/socials/farcaster.png',
  telegram:  '/socials/telegram.png',
}

const socialLinks = (contact: Contact) => [
  { href: contact.linkedin,  label: 'LinkedIn',  icon: SOCIAL_ICONS.linkedin },
  { href: contact.github,    label: 'GitHub',    icon: SOCIAL_ICONS.github },
  { href: contact.twitter,   label: 'X',         icon: SOCIAL_ICONS.twitter },
  { href: contact.farcaster, label: 'Farcaster', icon: SOCIAL_ICONS.farcaster },
  { href: contact.telegram,  label: 'Telegram',  icon: SOCIAL_ICONS.telegram },
  { href: contact.email ? `mailto:${contact.email}` : null, label: contact.email, icon: null },
].filter((l) => l.href)

export default function Hero({ profile, contact, languages }: HeroProps) {
  return (
    <section className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {profile.photo_url && (
          <Image
            src={profile.photo_url}
            alt={profile.name}
            width={96}
            height={96}
            className="rounded-full border-2 border-border object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-lg text-accent font-mono">{profile.title}</p>
          <p className="mt-1 text-sm text-text-dim">{profile.industries}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {socialLinks(contact).map((l) => (
              <a
                key={l.label}
                href={l.href!}
                target={l.href!.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                title={l.label ?? undefined}
                className="flex items-center gap-1.5 text-xs font-mono text-text-dim border border-border px-2 py-1 rounded hover:border-accent hover:text-accent transition-colors"
              >
                {l.icon
                  ? <Image src={l.icon} alt={l.label ?? ''} width={13} height={13} className="opacity-60" />
                  : null}
                {l.icon ? null : l.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {languages.map((l) => (
              <span key={l.id} className="text-xs text-text-dim font-mono">
                {l.flag} {l.name} <span className="text-muted">({l.level})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
