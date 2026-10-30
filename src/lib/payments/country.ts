// Tax jurisdiction of a bill's issuer, stored in personal_payments.country (CO | US | OTHER, nullable).
// Used by email ingestion, Jarvis proposals and the admin dashboard. Pure: no I/O, safe on client and server.
//
// Rules, in order:
//   1. An explicit country (from the invoice, William or the model) wins: CO/Colombia → CO, US/USA → US, anything else → OTHER.
//   2. Billed in COP → CO. Global services billed in COP (Spotify, Netflix, Apple…) carry Colombian IVA and NIT.
//   3. A Colombian issuer (known name, .co domain, S.A.S./Ltda.) → CO.
//   4. A US entity (known US company, Inc./LLC/Corp.) → US, which covers USD bills from US companies.
//   5. Colombian tax ids on the bill (NIT, DIAN, factura electrónica) → CO.
//   6. Otherwise → OTHER.

export const PAYMENT_COUNTRIES = ['CO', 'US', 'OTHER'] as const
export type PaymentCountry = (typeof PAYMENT_COUNTRIES)[number]

export interface CountryHints {
  /** Explicit country, if one is known (code or name). */
  country?: string | null
  /** Provider / issuer name, or the sender address of the bill. */
  provider?: string | null
  /** ISO currency of the charge, e.g. COP, USD. */
  currency?: string | null
  /** Free text from the bill or notes (subject, body, notes). */
  text?: string | null
}

const CO_ISSUERS = [
  'bancolombia', 'nequi', 'davivienda', 'daviplata', 'banco de bogota', 'banco de bogotá', 'bbva colombia', 'banco popular',
  'banco de occidente', 'av villas', 'scotiabank colpatria', 'colpatria', 'itau colombia', 'nu colombia', 'lulo bank', 'rappipay',
  'claro', 'movistar', 'tigo', 'une', 'etb', 'wom', 'emcali', 'epm', 'celsia', 'gases de occidente', 'vanti', 'acueducto',
  'icetex', 'dian', 'sura', 'colsanitas', 'sanitas', 'compensar', 'comfandi', 'colsubsidio', 'nueva eps', 'coomeva', 'porvenir',
  'protección', 'proteccion', 'colfondos', 'colpensiones', 'rappi', 'éxito', 'exito', 'falabella', 'avianca', 'mercado libre colombia',
]

const US_ISSUERS = [
  'google', 'youtube', 'apple', 'icloud', 'amazon', 'aws', 'microsoft', 'github', 'linkedin', 'openai', 'anthropic', 'netflix',
  'hulu', 'disney', 'hbo', 'max.com', 'paramount', 'vercel', 'supabase', 'cursor', 'anysphere', 'notion', 'figma', 'stripe',
  'adobe', 'zoom', 'slack', 'dropbox', 'cloudflare', 'digitalocean', 'railway', 'heroku', 'twilio', 'resend', 'x corp', 'twitter',
  'xai', 'x.ai', 'meta', 'facebook', 'instagram', 'whatsapp', 'uber', 'lyft', 'airbnb', 'paypal', 'coinbase', 'kraken', 'mercury',
  'chase', 'bank of america', 'wells fargo', 'citibank', 'capital one', 'american express', 'amex', 't-mobile', 'verizon', 'at&t',
  'irs', 'internal revenue service', 'delaware', 'wyoming', 'northwest registered agent', 'stripe atlas', 'doola', 'firstbase',
  'godaddy', 'namecheap', 'squarespace', 'shopify', 'canva', 'grammarly', 'chatgpt', 'claude', 'midjourney', 'perplexity',
]

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
// Whole-word (or whole-token) match, so "une" does not match "june" and "irs" does not match "first".
const hasName = (hay: string, names: string[]) =>
  names.some((n) => new RegExp(`(^|[^a-z0-9])${norm(n).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`).test(hay))

/** Normalizes a stored or proposed value to CO | US | OTHER; empty → null. */
export function normalizePaymentCountry(value: unknown): PaymentCountry | null {
  if (value === null || value === undefined) return null
  const v = norm(String(value)).trim().replace(/[.\s]+/g, ' ').trim()
  if (!v) return null
  if (['co', 'col', 'colombia'].includes(v)) return 'CO'
  if (['us', 'usa', 'u s', 'u s a', 'united states', 'united states of america', 'estados unidos', 'eeuu', 'ee uu'].includes(v)) return 'US'
  return 'OTHER'
}

/** Infers the issuer's tax jurisdiction for a payment. Always returns a value (OTHER when nothing points elsewhere). */
export function inferPaymentCountry(h: CountryHints): PaymentCountry {
  const explicit = normalizePaymentCountry(h.country)
  if (explicit) return explicit

  if (String(h.currency ?? '').trim().toUpperCase() === 'COP') return 'CO'

  const provider = norm(String(h.provider ?? ''))
  if (provider) {
    if (hasName(provider, CO_ISSUERS)) return 'CO'
    if (/\.(com\.|gov\.|org\.|net\.|edu\.)?co(>|\s|$)/.test(provider)) return 'CO'
    if (/(^|[^a-z])(s\s?\.?\s?a\s?\.?\s?s|ltda)\.?($|[^a-z])/.test(provider)) return 'CO'
    if (hasName(provider, US_ISSUERS)) return 'US'
    if (/(^|[^a-z])(inc|llc|l\.l\.c|corp|corporation)\.?($|[^a-z])/.test(provider)) return 'US'
  }

  const text = String(h.text ?? '')
  if (/\bNIT\b|\bDIAN\b|factura electr[oó]nica de venta/i.test(text)) return 'CO'

  return 'OTHER'
}
