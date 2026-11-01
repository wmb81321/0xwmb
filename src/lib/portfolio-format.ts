// Small formatters that turn admin-entered strings into labels for the public homepage.

/** "https://www.giveth.io/es/" → "giveth.io" */
export function domainOf(url?: string | null): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
  }
}

/** "https://linkedin.com/in/williammartinez8" → "williammartinez8" */
export function handleOf(url?: string | null): string {
  if (!url) return ''
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] ?? domainOf(url)
  } catch {
    return url
  }
}

/** Year from "01/08/2014" or "2014". */
function yearOf(date?: string | null): string {
  if (!date) return ''
  const m = date.match(/(\d{4})/)
  return m ? m[1] : ''
}

/** "2014 to 2021" from years, or from start/end dates; single year when equal. */
export function yearSpan(years?: string | null, start?: string | null, end?: string | null): string {
  if (years) return years.replace(/\s*[-–—]\s*/g, ' to ')
  const a = yearOf(start)
  const b = yearOf(end)
  if (a && b && a !== b) return `${a} to ${b}`
  return a || b
}

