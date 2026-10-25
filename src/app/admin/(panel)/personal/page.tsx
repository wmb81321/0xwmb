import { redirect } from 'next/navigation'

// The Personal page became the Command center (/admin) plus area pages.
export default function PersonalPage() {
  redirect('/admin')
}
