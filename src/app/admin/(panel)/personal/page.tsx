export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminDashboard from '../../AdminDashboard'
import { PERSONAL_TABS } from '../../tabs'
import Overview from './Overview'

export default async function PersonalPage() {
  const supabase = await createServerSupabaseClient()
  const [subs, debts, tasks, entities, phones, affiliations, payments, pending] = await Promise.all([
    supabase.from('personal_subscriptions').select('*'),
    supabase.from('personal_debts').select('*'),
    supabase.from('personal_tasks').select('*').order('order'),
    supabase.from('personal_entities').select('*'),
    supabase.from('personal_phone_lines').select('*'),
    supabase.from('personal_affiliations').select('*').order('order'),
    supabase.from('personal_payments').select('paid_at, amount, currency, status').eq('status', 'paid').gte('paid_at', `${new Date().getFullYear()}-01-01`),
    supabase.from('personal_payments').select('provider, amount, currency, due_at, status').eq('status', 'pending'),
  ])

  return (
    <>
      <Overview
        subscriptions={subs.data ?? []}
        debts={debts.data ?? []}
        tasks={tasks.data ?? []}
        entities={entities.data ?? []}
        phones={phones.data ?? []}
        affiliations={affiliations.data ?? []}
        payments={payments.data ?? []}
        pendingBills={pending.data ?? []}
      />
      <AdminDashboard tabs={PERSONAL_TABS} title="Records" />
    </>
  )
}
