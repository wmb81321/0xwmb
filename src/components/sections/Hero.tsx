import Image from 'next/image'
import type { Profile, Contact, Language } from '@/lib/types'

const SOCIALS = [
  { key: 'linkedin',  label: 'LI', icon: '/socials/linkdn.png' },
  { key: 'github',    label: 'GH', icon: '/socials/github.png' },
  { key: 'twitter',   label: 'X',  icon: '/socials/x.png' },
  { key: 'farcaster', label: 'FC', icon: '/socials/farcaster.png' },
  { key: 'telegram',  label: 'TG', icon: '/socials/telegram.png' },
]

interface HeroProps {
  profile: Profile
  contact: Contact
  languages: Language[]
}

export default function Hero({ profile, contact, languages }: HeroProps) {
  const socials = SOCIALS
    .map((s) => ({ ...s, href: contact[s.key as keyof Contact] as string }))
    .filter((s) => s.href)

  return (
    <section className="pt-14 min-h-[90vh] flex flex-col md:flex-row">

      {/* ── Left panel: photo ───────────────────────────────────────── */}
      <div className="relative w-full md:w-[38%] bg-surface-container-low flex flex-col min-h-[50vw] md:min-h-0">
        {profile.photo_url && (
          <>
            <Image
              src={profile.photo_url}
              alt={profile.name}
              fill
              className="object-cover grayscale opacity-50"
              priority
            />
            {/* Cyan atmosphere */}
            <div className="absolute inset-0 bg-primary-container/5" />
            {/* Bottom fade into panel bg */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-container-low to-transparent" />
          </>
        )}

        {/* Language badges — pinned bottom */}
        <div className="relative mt-auto px-6 py-5 flex flex-wrap gap-x-5 gap-y-1 z-10">
          {languages.map((l) => (
            <span key={l.id} className="text-xs text-on-surface-variant tracking-wide">
              {l.flag}&nbsp;{l.name}
              <span className="text-outline ml-1">/ {l.level}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel: content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 bg-surface-container-lowest">



        {/* Summary — shown above the name, terminal "output" style */}
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg mb-10">
          {profile.summary}
        </p>

        {/* Name */}
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-on-surface leading-none tracking-tight uppercase mb-3">
          {profile.name}
        </h1>

        {/* Title */}
        <p className="text-primary-container text-xs tracking-[0.2em] uppercase font-medium mb-2">
          {profile.title}
        </p>

        {/* Industries */}
        {profile.industries && (
          <p className="text-outline text-xs tracking-[0.1em] mb-8">{profile.industries}</p>
        )}

        {/* Social links */}
        <div className="flex flex-wrap gap-2">
          {socials.map((s) => (
            <a key={s.key} href={s.href}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 border border-outline-variant/40 hover:border-primary-container transition-colors">
              <Image src={s.icon} alt={s.label} width={14} height={14} className="opacity-60 hover:opacity-100 transition-opacity" />
            </a>
          ))}
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="flex items-center px-3 py-1.5 border border-outline-variant/40 text-on-surface-variant text-xs hover:border-primary-container hover:text-primary-container transition-colors">
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
