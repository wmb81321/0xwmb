import AdminDashboard from '../../AdminDashboard'
import { PERSONAL_TABS } from '../../tabs'

export default function PersonalPage() {
  return <AdminDashboard tabs={PERSONAL_TABS} title="Personal" />
}
