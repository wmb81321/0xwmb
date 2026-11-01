'use client'
import { useState } from 'react'

export interface Figure {
  label: string
  value: string
  /** Source note: what the figure is made of. */
  note: string
}

/**
 * Key figures with footnoted sources. Hovering or focusing a row lights its
 * note, so every number on the cover visibly traces back to the record.
 */
export default function KeyFigures({ figures }: { figures: Figure[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="figures">
      <table className="w-full border-collapse text-ui">
        <caption className="sr-only">Key figures with sources</caption>
        <tbody>
          {figures.map((f, i) => (
            <tr key={f.label}
              tabIndex={0}
              aria-describedby={`fig-note-${i}`}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)} onBlur={() => setActive(null)}
              className="cursor-default outline-offset-0 transition-colors hover:bg-ink/[0.03] focus-visible:bg-ink/[0.03]">
              <th scope="row" className="relative py-3 pr-4 text-left font-normal text-ink-muted">
                <span className="rule-in absolute inset-x-0 top-0 h-px bg-rule" aria-hidden />
                {f.label}
              </th>
              <td className="relative py-3 text-right font-semibold whitespace-nowrap">
                <span className="rule-in absolute inset-x-0 top-0 h-px bg-rule" aria-hidden />
                {f.value}
                <sup className={`ml-1 text-[0.7em] font-medium transition-colors ${active === i ? 'text-inst' : 'text-ink-muted'}`}>{i + 1}</sup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ol className="mt-3 border-t border-rule pt-3 text-mono-xs leading-relaxed text-ink-muted">
        {figures.map((f, i) => (
          <li key={f.label} id={`fig-note-${i}`}
            className={`-mx-2 px-2 py-0.5 transition-colors duration-200 ${active === i ? 'bg-inst/8 text-ink' : ''}`}>
            <span className={active === i ? 'text-inst' : ''}>{i + 1}.</span> {f.note}
          </li>
        ))}
      </ol>
    </div>
  )
}
