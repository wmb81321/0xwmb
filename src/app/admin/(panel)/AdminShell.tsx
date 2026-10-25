'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Item = { href: string; label: string; short: string; status?: string }

const DOT: Record<string, string> = { alert: 'bg-tertiary-container', ok: 'bg-primary-container', empty: 'bg-surface-bright' }

function nav(areas: { slug: string; name: string; status: string }[]): { group: string; items: Item[] }[] {
  return [
    { group: '', items: [{ href: '/admin', label: 'Command center', short: 'COMMAND' }] },
    { group: 'AREAS', items: areas.map((a) => ({ href: `/admin/areas/${a.slug}`, label: a.name, short: a.name.toUpperCase(), status: a.status })) },
    {
      group: 'PROCESS',
      items: [
        { href: '/admin/inbox', label: 'Inbox', short: 'INBOX' },
        { href: '/admin/jarvis', label: 'Jarvis', short: 'JARVIS' },
        { href: '/admin/vault', label: 'Vault', short: 'VAULT' },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { href: '/admin/site', label: 'Public site & CV', short: 'SITE' },
        { href: '/admin/security', label: 'Security', short: 'KEYS' },
      ],
    },
  ]
}

// Mobile bottom bar: the four places used daily.
const MOBILE: Item[] = [
  { href: '/admin', label: 'Command', short: 'COMMAND' },
  { href: '/admin/areas', label: 'Areas', short: 'AREAS' },
  { href: '/admin/inbox', label: 'Inbox', short: 'INBOX' },
  { href: '/admin/jarvis', label: 'Jarvis', short: 'JARVIS' },
]


export default function AdminShell({ email, role, areas, children }: {
  email: string; role: string; areas: { slug: string; name: string; status: string }[]; children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const NAV = nav(areas)
  // '/admin' is a prefix of everything, so it only matches exactly.
  const isOn = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))
  const activeGroup = NAV.find((g) => g.items.some((i) => isOn(i.href)))
  const active = activeGroup?.items.find((i) => isOn(i.href))

  async function logout() {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Kernel HUD */}
      <div className="font-mono text-xs text-outline bg-surface-container-lowest flex flex-wrap justify-between gap-x-6 gap-y-1 px-4 md:px-5 py-2 tracking-wide">
        <div className="flex gap-5">
          <span className="text-primary-container">0xWOMB://LIFE-OS</span>
          <span>ROLE {role.toUpperCase()}</span>
        </div>
        <div className="flex gap-5 items-center">
          <span className="hidden sm:inline">CALI · UTC−5</span>
          <span className="flex items-center gap-2"><span className="data-pulse" />SYSTEMS NOMINAL</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 shrink-0 bg-surface-container flex-col gap-6 px-3 py-5 overflow-y-auto">
          <Link href="/" className="px-3 text-xl font-bold tracking-tight text-primary">
            0x<span className="text-primary-container">womb</span>{' '}
            <span className="font-mono text-xs font-normal text-outline">admin</span>
          </Link>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((g) => (
              <div key={g.group} className="flex flex-col gap-0.5">
                {g.group && <div className="font-mono text-xs text-outline tracking-[0.1em] px-3 pt-3 pb-1">{g.group}</div>}
                {g.items.map((i) => {
                  const on = isOn(i.href)
                  return (
                    <Link
                      key={i.href}
                      href={i.href}
                      className={`px-3 py-2 text-sm transition-colors ${
                        on
                          ? 'bg-surface-container-high text-primary shadow-[inset_2px_0_0_#00D1FF]'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        {i.label}
                        {i.status && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT[i.status]}`} />}
                      </span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
          <div className="mt-auto font-mono text-xs text-outline bg-surface-container-low p-3 leading-relaxed">
            <div className="text-on-surface-variant">SESSION</div>
            <div className="truncate">{email}</div>
            <div className="flex justify-between mt-2">
              <Link href="/" className="hover:text-primary">← SITE</Link>
              <button onClick={logout} className="hover:text-error">LOGOUT</button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-8">
          <div className="font-mono text-xs text-outline tracking-[0.08em] mb-2">
            {activeGroup?.group || 'LIFE OS'} / {active?.short ?? ''}
          </div>
          {children}
        </main>
      </div>

      {/* Bottom tabs (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 flex bg-surface-container font-mono text-[10px]">
        {MOBILE.map((i) => {
          const on = isOn(i.href)
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex-1 min-h-14 flex items-center justify-center ${
                on ? 'text-primary-container shadow-[inset_0_2px_0_#00D1FF]' : 'text-outline'
              }`}
            >
              {i.short}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
