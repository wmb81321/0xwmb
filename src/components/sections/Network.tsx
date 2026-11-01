import { NETWORK } from '@/lib/network'
import { domainOf } from '@/lib/portfolio-format'
import { CONTAINER, ExtLink, Logo } from '@/components/home/primitives'

/** Navy band of organisations: logos greyscale at rest, full colour on hover or focus. */
export default function Network() {
  return (
    <section className="on-navy bg-navy text-navy-ink" aria-labelledby="network-title">
      <div className={`${CONTAINER} py-14 lg:py-16`}>
        <h2 id="network-title" className="text-ui text-navy-muted">
          Organisations I have built with, worked for and studied at
        </h2>
        <ul className="mt-8 grid grid-cols-3 gap-px bg-navy-raised/60 lg:grid-cols-6">
          {NETWORK.map((org) => (
            <li key={org.name} className="reveal bg-navy">
              <ExtLink href={org.url} label={org.name}
                className="group flex h-28 flex-col items-center justify-center gap-2 sm:h-36 sm:gap-3 transition-colors duration-200 hover:bg-navy-raised">
                <Logo src={org.logo} alt={org.name} box="h-14 w-24 sm:h-18 sm:w-32" ratio={1.78} fill={0.74}
                  className="logo-quiet" />
                <span className="h-4 max-w-full truncate px-1 text-mono-2xs text-navy-muted sm:text-mono-xs group-hover:text-navy-ink transition-colors">
                  {org.url ? domainOf(org.url) : ''}
                </span>
              </ExtLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
