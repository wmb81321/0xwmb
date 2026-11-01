import type { CSSProperties } from 'react'
import type { Skill } from '@/lib/types'
import { DocSection, Logo } from '@/components/home/primitives'

/** Position of a tile in its row's cascade. */
const order = (i: number) => ({ '--i': i }) as CSSProperties
const hasLogos = (s: Skill) => s.items.some((item) => s.logos?.[item])

/** Expertise: what William does (practice areas without logos), as ruled text rows. */
export function ExpertiseSection({ skills }: { skills: Skill[] }) {
  const practice = skills.filter((s) => !hasLogos(s))
  if (practice.length === 0) return null
  return (
    <DocSection id="expertise" title="Expertise">
      <dl>
        {practice.map((s, i) => (
          <div key={s.id} className={`reveal grid gap-1 py-4 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
            <dt className="text-ui font-semibold md:col-span-2">{s.category}</dt>
            <dd className="text-ink-muted md:col-span-7">{s.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </DocSection>
  )
}

/**
 * Tools: what William works with, as a hairline grid of official tool marks so
 * the stack is recognisable at a glance.
 */
export function ToolsSection({ skills }: { skills: Skill[] }) {
  const tools = skills.filter(hasLogos)
  if (tools.length === 0) return null
  return (
    <DocSection id="tools" title="Tools">
      <div className="flex flex-col">
        {tools.map((s, i) => (
          <div key={s.id} className={`grid gap-3 py-5 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
            <h3 className="text-ui font-semibold md:col-span-2 md:pt-3">{s.category}</h3>
            <ul className="grid grid-cols-4 border-t border-l border-rule sm:grid-cols-5 md:col-span-7 lg:grid-cols-6">
              {s.items.map((item, j) => (
                <li key={item} style={order(j)}
                  className="tile-in group flex h-21 flex-col items-center justify-center gap-2 border-r border-b border-rule px-1 sm:h-24">
                  <Logo src={s.logos?.[item]} alt="" box="size-8 sm:size-9" fill={0.82} surface="light" className="tile-mark mix-blend-multiply" />
                  <span className="max-w-full text-center text-mono-2xs leading-tight text-ink-muted transition-colors group-hover:text-ink sm:text-mono-xs">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DocSection>
  )
}
