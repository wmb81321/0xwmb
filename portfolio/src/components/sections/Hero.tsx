import Image from 'next/image'
import type { Profile, Contact, Language } from '@/lib/types'

interface HeroProps {
  profile: Profile
  contact: Contact
  languages: Language[]
}

const socialLinks = (contact: Contact) => [
  { href: `mailto:${contact.email}`, label: 'Email' },
  { href: contact.linkedin, label: 'LinkedIn' },
  { href: contact.github, label: 'GitHub' },
  { href: contact.twitter, label: 'X' },
  { href: contact.farcaster, label: 'Farcaster' },
  { href: contact.telegram, label: 'Telegram' },
]

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
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks(contact).map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-xs font-mono text-text-dim border border-border px-2 py-1 rounded hover:border-accent hover:text-accent transition-colors"
              >
                {l.label}
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
