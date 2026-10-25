import { cache } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AREAS, AREA_TABS, applyFilter, type AreaStatus } from '@/app/admin/areas'

// General editor labels → tables (only the ones areas use).
const GENERAL: Record<string, string> = {
  Jobs: 'job_applications', Certificates: 'certificates', Payments: 'personal_payments', Subscriptions: 'personal_subscriptions',
  Accounts: 'personal_accounts', Debts: 'personal_debts', Entities: 'personal_entities', Emails: 'personal_emails',
  'Phone lines': 'personal_phone_lines', Identities: 'personal_account_links',
}

export interface AreaSummary {
  slug: string
  name: string
  status: AreaStatus
  openTasks: number
  highTasks: number
  records: number
  nextDeadline: { date: string; title: string } | null
}

// Status per area for the sidebar dots and command-center tiles:
// alert = an open high-priority task (or an unknown affiliation in its scope), ok = has records, empty = nothing yet.
// cache(): the layout (sidebar dots) and the page share one computation per request.
export const areaSummaries = cache(async (): Promise<AreaSummary[]> => {
  const supabase = await createServerSupabaseClient()
  const { data: tasks } = await supabase.from('personal_tasks').select('title, domain, priority, status, due_at').neq('status', 'done')
  const { data: affs } = await supabase.from('personal_affiliations').select('kind, status')

  return Promise.all(AREAS.map(async (a) => {
    const mine = (tasks ?? []).filter((t) => a.domains.includes(t.domain))
    const counts = await Promise.all(a.tabs.map(async (label) => {
      const def = AREA_TABS[label]
      const table = def?.table ?? GENERAL[label]
      if (!table) return 0
      const { count } = await applyFilter(supabase.from(table).select('id', { count: 'exact', head: true }), def?.filter)
      return count ?? 0
    }))
    const records = counts.reduce((s, n) => s + n, 0)
    const unknownAff = (a.slug === 'social' && (affs ?? []).some((x) => x.kind !== 'eps' && x.status === 'unknown'))
    const highTasks = mine.filter((t) => t.priority === 'high').length
    const dated = mine.filter((t) => t.due_at).sort((x, y) => String(x.due_at).localeCompare(String(y.due_at)))
    return {
      slug: a.slug, name: a.name,
      status: highTasks > 0 || unknownAff ? 'alert' : records > 0 ? 'ok' : 'empty',
      openTasks: mine.length, highTasks, records,
      nextDeadline: dated[0] ? { date: dated[0].due_at as string, title: dated[0].title as string } : null,
    }
  }))
})
