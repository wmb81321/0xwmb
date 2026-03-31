import Image from 'next/image'
import type { Contact, Profile } from '@/lib/types'

const socials: { key: keyof Contact; icon: string; label: string }[] = [
  { key: 'github',    icon: '/socials/github.png',    label: 'GitHub' },
  { key: 'linkedin',  icon: '/socials/linkdn.png',    label: 'LinkedIn' },
  { key: 'twitter',   icon: '/socials/x.png',         label: 'X' },
  { key: 'farcaster', icon: '/socials/farcaster.png', label: 'Farcaster' },
  { key: 'telegram',  icon: '/socials/telegram.png',  label: 'Telegram' },
]

export default function Footer({ contact, profile }: { contact: Contact; profile: Profile }) {
  return (
    <footer className="mt-10 border-t border-outline-variant/20 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Left — identity */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-primary-container tracking-[0.2em] uppercase">0xwmb</span>
          <span className="text-xs text-on-surface-variant">{profile.name}</span>
          <span className="text-xs text-outline">{profile.title}</span>
        </div>

        {/* Centre — social icons */}
        <div className="flex items-center gap-3">
          {socials.map(({ key, icon, label }) =>
            contact[key] ? (
              <a key={key} href={contact[key] as string} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 border border-outline-variant/20 hover:border-primary-container/60 transition-colors group">
                <Image src={icon} alt={label} width={14} height={14}
                  className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : null
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="flex items-center justify-center w-8 h-8 border border-outline-variant/20 hover:border-primary-container/60 transition-colors text-outline hover:text-primary-container text-xs">
              @
            </a>
          )}
        </div>

        {/* Right — tagline */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-outline font-mono tracking-widest">Built on Ethereum</span>
          <span className="text-xs text-outline/50 font-mono">© {new Date().getFullYear()}</span>
        </div>

      </div>
    </footer>
  )
}
