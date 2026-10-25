import AdminDashboard from '../../AdminDashboard'
import { JARVIS_TABS } from '../../tabs'

export default function JarvisPage() {
  return <AdminDashboard tabs={JARVIS_TABS} title="Jarvis memory" />
}
