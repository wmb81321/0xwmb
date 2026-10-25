import AdminDashboard from '../../AdminDashboard'
import { INBOX_TABS } from '../../tabs'

// Mail that arrived at @0xwomb.xyz. Bills become Telegram proposals; work mail (hi@) is answered in the Resend Inbox.
export default function InboxPage() {
  return <AdminDashboard tabs={INBOX_TABS} title="Inbox" />
}
