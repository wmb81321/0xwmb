'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { PortfolioData } from '@/lib/types'
import DownloadCV from '@/components/DownloadCVNoSSR'

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#skills',     label: 'Skills' },
]

export default function Navbar({ data }: { data: PortfolioData }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-outline-variant/20">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        <Link href="/" className="text-primary-container font-semibold tracking-[0.2em] text-sm uppercase">
          0xwomb
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-xs tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors uppercase">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <DownloadCV data={data} />
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-on-surface-variant flex flex-col gap-1.5" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="block w-5 h-px bg-current" />
          <span className="block w-5 h-px bg-current" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-outline-variant/20 px-6 py-5 flex flex-col gap-5">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-xs tracking-[0.15em] uppercase text-on-surface-variant"
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div onClick={() => setOpen(false)}>
            <DownloadCV data={data} />
          </div>
        </div>
      )}
    </nav>
  )
}
