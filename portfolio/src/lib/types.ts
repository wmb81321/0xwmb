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
  years: string
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
  years: string
  abroad_program: string | null
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
  name: string
  issuer: string
  year: string
  logo_url: string
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
  skills: Skill[]
  languages: Language[]
  contact: Contact
}
