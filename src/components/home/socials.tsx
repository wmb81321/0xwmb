import type { Contact } from '@/lib/types'
import { handleOf } from '@/lib/portfolio-format'

type SocialKey = 'linkedin' | 'github' | 'twitter' | 'telegram' | 'farcaster'

const SOCIALS: { key: SocialKey; label: string; icon: string; at?: boolean }[] = [
  { key: 'linkedin', label: 'LinkedIn', icon: '/socials/linkdn.png' },
  { key: 'github', label: 'GitHub', icon: '/socials/github.png' },
  { key: 'twitter', label: 'X', icon: '/socials/x.png', at: true },
  { key: 'telegram', label: 'Telegram', icon: '/socials/telegram.png', at: true },
  { key: 'farcaster', label: 'Farcaster', icon: '/socials/farcaster.png' },
]

export function socialsOf(contact: Contact) {
  return SOCIALS
    .filter((s) => contact[s.key])
    .map((s) => {
      const url = contact[s.key]
      const h = handleOf(url)
      return { ...s, url, handle: s.at ? `@${h}` : h }
    })
}
