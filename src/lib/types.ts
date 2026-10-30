import type { PaymentCountry } from './payments/country'

export interface Profile {
  id: number
  name: string
  title: string
  summary: string
  photo_url: string
  industries: string
}

export interface Experience {
  id: number
  role: string
  company: string
  years: string
  points: string[]
  website: string
  logo_url: string
  linkedin?: string
  twitter?: string
  order: number
}

export interface Project {
  id: number
  name: string
  role: string
  years?: string
  start_date?: string
  end_date?: string
  brief: string
  points: string[]
  website: string
  logo_url: string
  socials: Record<string, string>
  order: number
}

export interface Education {
  id: number
  degree: string
  institution: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  years: string
  description: string | null
  logo_url: string
  website?: string
  linkedin?: string
  twitter?: string
  order: number
}

export interface Certificate {
  id: number
  name: string
  issuer: string
  year: string
  logo_url: string
  website?: string
  linkedin?: string
  twitter?: string
  order: number
}

export interface Volunteering {
  id: number
  reason: string
  role?: string
  issuer: string
  year: string
  logo_url: string
  order: number
}

export interface Achievement {
  id: number
  title: string
  description?: string
  year?: string
  logo_url?: string
  link?: string
  type: 'achievement' | 'goal'
  order: number
}

export interface Skill {
  id: number
  category: string
  items: string[]
  logos?: Record<string, string>
  type: 'technical' | 'soft'
  order: number
}

export interface Language {
  id: number
  name: string
  level: string
  flag: string
  order: number
}

export interface Contact {
  id: number
  email: string
  whatsapp: string
  telegram: string
  github: string
  linkedin: string
  twitter: string
  farcaster: string
}

export interface JobApplication {
  id: number
  company: string
  position: string
  website?: string
  application_url?: string
  description?: string
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  applied_at?: string
  notes?: string
  order: number
  created_at: string
}

export interface PortfolioData {
  profile: Profile
  experiences: Experience[]
  projects: Project[]
  education: Education[]
  certificates: Certificate[]
  volunteering: Volunteering[]
  achievements: Achievement[]
  skills: Skill[]
  languages: Language[]
  contact: Contact
}

export type { PaymentCountry }

// Row of personal_payments (owner-only). country = issuer tax jurisdiction, see src/lib/payments/country.ts.
export interface PersonalPayment {
  id: number
  status: 'pending' | 'paid'
  billed_at: string | null
  due_at: string | null
  paid_at: string | null
  provider: string
  subscription_id: number | null
  debt_id: number | null
  amount: number
  currency: string
  paid_with: string | null
  invoice_path: string | null
  source: 'manual' | 'telegram' | 'email' | 'import'
  country: PaymentCountry | null
  notes: string | null
  order: number
  created_at: string
}
