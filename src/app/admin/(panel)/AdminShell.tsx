'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { group: 'PUBLIC', items: [{ href: '/admin/site', label: 'Site & CV', short: 'SITE' }] },
  {
    group: 'PRIVATE',
    items: [
      { href: '/admin/personal', label: 'Personal', short: 'PERSONAL' },
      { href: '/admin/entities', label: 'Entities', short: 'ENTITIES' },
      { href: '/admin/inbox', label: 'Inbox', short: 'INBOX' },
      { href: '/admin/jarvis', label: 'Jarvis', short: 'JARVIS' },
    ],
  },
]
const ALL = NAV.flatMap((g) => g.items)

export default function AdminShell({ email, role, children }: { email: string; role: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const active = ALL.find((i) => pathname.startsWith(i.href))

  async function logout() {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Kernel HUD */}
      <div className="font-mono text-xs text-outline bg-surface-container-lowest flex flex-wrap justify-between gap-x-6 gap-y-1 px-4 md:px-5 py-2 tracking-wide">
        <div className="flex gap-5">
          <span className="text-primary-container">0xWOMB://ADMIN</span>
          <span>ROLE {role.toUpperCase()}</span>
        </div>
        <div className="flex gap-5 items-center">
          <span className="hidden sm:inline">CALI · UTC−5</span>
          <span className="flex items-center gap-2"><span className="data-pulse" />SYSTEMS NOMINAL</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-60 shrink-0 bg-surface-container flex-col gap-6 px-3 py-5">
          <Link href="/" className="px-3 text-xl font-bold tracking-tight text-primary">
            0x<span className="text-primary-container">womb</span>{' '}
            <span className="font-mono text-xs font-normal text-outline">admin</span>
          </Link>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((g) => (
              <div key={g.group} className="flex flex-col gap-0.5">
                <div className="font-mono text-xs text-outline tracking-[0.1em] px-3 pt-3 pb-1">{g.group}</div>
                {g.items.map((i) => {
                  const on = pathname.startsWith(i.href)
                  return (
                    <Link
                      key={i.href}
                      href={i.href}
                      className={`px-3 py-2.5 text-sm transition-colors ${
                        on
                          ? 'bg-surface-container-high text-primary shadow-[inset_2px_0_0_#00D1FF]'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                      }`}
                    >
                      {i.label}
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
            {(NAV.find((g) => g.items.includes(active!))?.group ?? 'ADMIN')} / {active?.short ?? ''}
          </div>
          {children}
        </main>
      </div>

      {/* Bottom tabs (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 flex bg-surface-container font-mono text-[10px]">
        {ALL.map((i) => {
          const on = pathname.startsWith(i.href)
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
