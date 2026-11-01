import type { CSSProperties } from 'react'
import type { Skill } from '@/lib/types'
import { DocSection, Logo } from '@/components/home/primitives'

/** Position of a tile in its row's cascade. */
const order = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * Capabilities: tool categories render as a hairline grid of tool marks, so a
 * reader identifies the stack at a glance; practice areas (no logos) stay as
 * text rows underneath.
 */
export default function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null
  const hasLogos = (s: Skill) => s.items.some((item) => s.logos?.[item])
  const tools = skills.filter(hasLogos)
  const practice = skills.filter((s) => !hasLogos(s))

  return (
    <DocSection id="capabilities" title="Capabilities">
      <div className="flex flex-col">
        {tools.map((s, i) => (
          <div key={s.id} className={`grid gap-4 py-6 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
            <h3 className="text-ui font-semibold md:col-span-2 md:pt-3">{s.category}</h3>
            <ul className="grid grid-cols-3 border-t border-l border-rule sm:grid-cols-4 md:col-span-7 lg:grid-cols-6">
              {s.items.map((item, j) => (
                <li key={item} style={order(j)} className="tile-in group flex h-26 flex-col items-center justify-center gap-2.5 border-r border-b border-rule px-1">
                  <Logo src={s.logos?.[item]} alt="" box="size-10" fill={0.82} surface="light" className="tile-mark mix-blend-multiply" />
                  <span className="max-w-full text-center text-mono-xs leading-tight text-ink-muted transition-colors group-hover:text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {practice.length > 0 && (
          <dl className={tools.length > 0 ? 'mt-6 border-t border-ink pt-6' : ''}>
            {practice.map((s, i) => (
              <div key={s.id} className={`grid gap-2 py-4 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
                <dt className="text-ui font-semibold md:col-span-2">{s.category}</dt>
                <dd className="text-ink-muted md:col-span-7">{s.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </DocSection>
  )
}
