'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-accent font-medium tracking-wider">
          0xwmb
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-text-dim hover:text-text transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#download-cv" className="text-sm px-4 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors">
            Download CV
          </a>
        </div>
        <button className="md:hidden text-text-dim" onClick={() => setOpen(!open)}>
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-text-dim" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#download-cv" className="text-sm text-accent" onClick={() => setOpen(false)}>Download CV</a>
        </div>
      )}
    </nav>
  )
}
