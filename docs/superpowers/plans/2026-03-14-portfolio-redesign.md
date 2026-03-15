# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild 0xwmb portfolio from a 5-page static HTML site into a Next.js 14 single-page app with Supabase backend, admin panel, and ATS-friendly PDF CV.

**Architecture:** Single Next.js 14 App Router project with server components fetching data from Supabase on load. Admin panel at `/admin` protected by `middleware.ts` + Supabase Auth. PDF generated client-side via react-pdf using server-pre-fetched data passed as props.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase (Postgres + Auth + Storage), react-pdf, Vercel

**Spec:** `docs/superpowers/specs/2026-03-14-portfolio-redesign-design.md`

---

## Chunk 1: Project Setup

### Task 1: Initialize Next.js project

**Files:**
- Create: `portfolio/` (new Next.js project alongside existing site)

- [ ] **Step 1: Bootstrap Next.js app**

Run inside `/Users/williammartinez/0xwmb`:
```bash
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
cd portfolio
```

When prompted, accept all defaults.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @react-pdf/renderer
```

Note: `@react-pdf/renderer` ships its own TypeScript types — do NOT install `@types/react-pdf` (that is for a different, unrelated PDF viewer library).

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: Server running at http://localhost:3000 with Next.js default page.

- [ ] **Step 4: Commit**

```bash
git add portfolio/
git commit -m "feat: initialize Next.js 14 portfolio project"
```

---

### Task 2: Configure design tokens and global styles

**Files:**
- Modify: `portfolio/tailwind.config.ts`
- Modify: `portfolio/src/app/globals.css`

- [ ] **Step 1: Update tailwind.config.ts with design tokens**

Replace content of `portfolio/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050810',
        surface: '#0d1117',
        'surface-2': '#111827',
        accent: '#6366f1',
        'accent-dim': '#4f46e5',
        muted: '#6b7280',
        border: '#1f2937',
        text: '#f9fafb',
        'text-dim': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Update globals.css**

Replace content of `portfolio/src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-text font-sans;
  }
  * {
    @apply border-border;
  }
}

@layer utilities {
  .section-anchor {
    scroll-margin-top: 64px;
  }
}
```

- [ ] **Step 3: Verify Tailwind picks up custom colors**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add portfolio/tailwind.config.ts portfolio/src/app/globals.css
git commit -m "feat: configure design tokens and global styles"
```

---

### Task 3: Create TypeScript types and Supabase client

**Files:**
- Create: `portfolio/src/lib/types.ts`
- Create: `portfolio/src/lib/supabase.ts`
- Create: `portfolio/src/lib/supabase-server.ts`
- Create: `portfolio/.env.local`

- [ ] **Step 1: Create `.env.local`**

Create `portfolio/.env.local` (this file is gitignored — never commit it):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these values from: Supabase Dashboard → Project Settings → API.

- [ ] **Step 2: Create shared TypeScript types**

Create `portfolio/src/lib/types.ts`:
```typescript
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
  order: number
}

export interface Certificate {
  id: number
  name: string
  issuer: string
  year: string
  logo_url: string
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
```

- [ ] **Step 3: Create client-side Supabase client (anon key)**

Create `portfolio/src/lib/supabase.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 4: Create server-side Supabase client**

Create `portfolio/src/lib/supabase-server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Intentional: cookie setting may throw in Server Components
            // when called after headers are sent — this is expected behavior
          }
        },
      },
    }
  )
}

// Uses service role key — server-only, never call from client components
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 5: Update next.config.ts to allow Supabase Storage images**

Replace content of `portfolio/next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

Without this, `next/image` will throw a runtime error for all Supabase Storage URLs.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add portfolio/src/lib/ portfolio/next.config.ts
git commit -m "feat: add TypeScript types, Supabase client utilities, and image remotePatterns"
```

---

## Chunk 2: Supabase Schema & Data Migration

### Task 4: Create Supabase schema with RLS

**Files:**
- Create: `portfolio/supabase/schema.sql`

- [ ] **Step 1: Create schema.sql**

Create `portfolio/supabase/schema.sql`:
```sql
-- Profile
create table if not exists profile (
  id serial primary key,
  name text not null,
  title text not null,
  summary text not null,
  photo_url text,
  industries text
);
alter table profile enable row level security;
create policy "Public read" on profile for select using (true);
create policy "Admin write" on profile for all to authenticated using (true) with check (true);

-- Experiences
create table if not exists experiences (
  id serial primary key,
  role text not null,
  company text not null,
  years text not null,
  points text[] not null default '{}',
  website text,
  logo_url text,
  "order" int not null default 0
);
alter table experiences enable row level security;
create policy "Public read" on experiences for select using (true);
create policy "Admin write" on experiences for all to authenticated using (true) with check (true);

-- Projects
create table if not exists projects (
  id serial primary key,
  name text not null,
  role text not null,
  years text not null,
  brief text,
  points text[] not null default '{}',
  website text,
  logo_url text,
  socials jsonb default '{}',
  "order" int not null default 0
);
alter table projects enable row level security;
create policy "Public read" on projects for select using (true);
create policy "Admin write" on projects for all to authenticated using (true) with check (true);

-- Education
create table if not exists education (
  id serial primary key,
  degree text not null,
  institution text not null,
  years text not null,
  abroad_program text,
  logo_url text,
  "order" int not null default 0
);
alter table education enable row level security;
create policy "Public read" on education for select using (true);
create policy "Admin write" on education for all to authenticated using (true) with check (true);

-- Certificates
create table if not exists certificates (
  id serial primary key,
  name text not null,
  issuer text not null,
  year text,
  logo_url text,
  "order" int not null default 0
);
alter table certificates enable row level security;
create policy "Public read" on certificates for select using (true);
create policy "Admin write" on certificates for all to authenticated using (true) with check (true);

-- Volunteering
create table if not exists volunteering (
  id serial primary key,
  name text not null,
  issuer text not null,
  year text,
  logo_url text,
  "order" int not null default 0
);
alter table volunteering enable row level security;
create policy "Public read" on volunteering for select using (true);
create policy "Admin write" on volunteering for all to authenticated using (true) with check (true);

-- Skills
create table if not exists skills (
  id serial primary key,
  category text not null,
  items text[] not null default '{}',
  type text not null check (type in ('technical', 'soft')),
  "order" int not null default 0
);
alter table skills enable row level security;
create policy "Public read" on skills for select using (true);
create policy "Admin write" on skills for all to authenticated using (true) with check (true);

-- Languages
create table if not exists languages (
  id serial primary key,
  name text not null,
  level text not null,
  flag text,
  "order" int not null default 0
);
alter table languages enable row level security;
create policy "Public read" on languages for select using (true);
create policy "Admin write" on languages for all to authenticated using (true) with check (true);

-- Contact
create table if not exists contact (
  id serial primary key,
  email text,
  whatsapp text,
  telegram text,
  github text,
  linkedin text,
  twitter text,
  farcaster text
);
alter table contact enable row level security;
create policy "Public read" on contact for select using (true);
create policy "Admin write" on contact for all to authenticated using (true) with check (true);
```

- [ ] **Step 2: Run schema in Supabase**

Go to Supabase Dashboard → SQL Editor → paste the contents of `schema.sql` → Run.

Expected: All tables created with no errors. Verify in Table Editor.

- [ ] **Step 3: Commit schema file**

```bash
git add portfolio/supabase/schema.sql
git commit -m "feat: add Supabase schema with RLS policies"
```

---

### Task 5: Upload images to Supabase Storage and seed data

**Files:**
- Create: `portfolio/supabase/seed.sql`

- [ ] **Step 1: Create Storage bucket**

Go to Supabase Dashboard → Storage → New Bucket → name: `portfolio-assets` → Public bucket: yes.

- [ ] **Step 2: Upload images**

Upload all image files **directly to the bucket root** (no subfolders) in `portfolio-assets/`. The seed SQL references them as flat filenames — do not create subdirectories.

Files to upload (flat, no path prefix):
- From `workexperience/`: `giveth.png`, `manuelita.png`, `talentum.png`, `usbcali.png`
- From `projects/`: `ethcali.png`, `ekinoxis.png`, `convexo.png`
- From `universities/`: `icesi.png`, `skema.png`, `montpellierbussines.png`
- From `certificates/`: `atrium.png`, `bloomberg.png`, `esp.png`, `ethereumf.png`, `ethglobal.png`
- From root: `picture.png` (profile photo)

After upload, public URL pattern: `https://<project-ref>.supabase.co/storage/v1/object/public/portfolio-assets/<filename>`

Replace `<SUPABASE_URL>` in `seed.sql` with your actual project URL (e.g. `https://abcdefgh.supabase.co`) before running.

- [ ] **Step 3: Create seed.sql with all content**

Create `portfolio/supabase/seed.sql` — replace `<SUPABASE_URL>` with your actual Supabase project storage URL:

```sql
-- Profile
insert into profile (name, title, summary, photo_url, industries) values (
  'William Martinez Bolaños',
  'Product Manager, Researcher, ETH Community Leader',
  'Experienced product manager, Researcher and community leader focused in Crypto, DeFi and AI. Proven track record understanding institutionals to explore web3 solutions. Deep technical understanding about Ethereum technologies and communities across the world. Founded 3 projects: ETH CALI to free-access web3 education, Ekinoxis to empower innovation, Convexo to enable secure and private DeFi experiences. Background in Economics, Project Management, and Corporate Finance with multilingual capabilities.',
  '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/picture.png',
  'Crypto • Blockchain • Artificial Intelligence'
);

-- Contact
insert into contact (email, whatsapp, telegram, github, linkedin, twitter, farcaster) values (
  'wmb81321@gmail.com',
  'https://wa.me/13015041248',
  'https://t.me/wmb81321',
  'https://github.com/wmb81321',
  'https://linkedin.com/in/williammartinez8',
  'https://twitter.com/0xwmb',
  'https://warpcast.com/williammartinez'
);

-- Languages
insert into languages (name, level, flag, "order") values
  ('Spanish', 'C2 - Native', '🇪🇸', 1),
  ('English', 'C1 - Advanced', '🇬🇧', 2),
  ('French', 'B1 - Intermediate', '🇫🇷', 3);

-- Experiences
insert into experiences (role, company, years, points, website, logo_url, "order") values
  ('Teacher & Mentor', 'Universidad Buenaventura de Cali', 'June 2025 - December 2025',
   ARRAY[
     'Teaching +30 students about DeFi based on hands-on dynamic to reach a total +$4K volume',
     'Design and implementing hands-on workshops using top EVM protocols like Uniswap, Across, Bnkr.bot, Remix, Open Zeppelin.',
     'Focusing on Ethereum, Base, Optimism and Unichain.'
   ],
   'https://usbcali.edu.co',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/usbcali.png', 1),

  ('Token Analyst', 'Giveth', 'Apr 2024 - Apr 2025',
   ARRAY[
     'Audited DAO treasuries and contracts across 4 EVM-compatible chains, safeguarding millions in governance balances and ensuring transparency.',
     'Negotiated token listings and custody integrations with 1 exchange Tier 2, +5 Market Makers, +5 DeFi bridges, and +5 wallets to improve token holders UX.',
     'Secured reward programs based on tracking analysis to donations, avoiding recirculations of +$20,000 value in rewards given to donors.'
   ],
   'https://giveth.io',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/giveth.png', 2),

  ('IT Project Manager', 'Corporación Talentum', 'Feb 2024 - Dec 2024',
   ARRAY[
     'Coordinated IT teams (front-end, back-end, DevOps) to deliver 2 products: Business Intelligence system for Government Funding Programs and tokenized digital experiences within an event manager software.',
     'Integrated tokenized assets with BI dashboards, enabling data-driven financial insights for partner organizations.'
   ],
   'https://talentum.edu.co/es/',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/talentum.png', 3),

  ('Brand Manager', 'Manuelita', 'Sep 2021 - Aug 2022',
   ARRAY[
     'Developing and analyzing trade marketing strategies for national clients.',
     'CRM with HubSpot and analyzing national and international sales.',
     'Supporting product development.'
   ],
   'https://www.manuelita.com/',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/manuelita.png', 4);

-- Projects
insert into projects (name, role, years, brief, points, website, logo_url, socials, "order") values
  ('ETH CALI', 'Founder', '2022–Present',
   'Building Web3 adoption through partnerships with universities, enterprises, and global sponsors',
   ARRAY[
     'Forged partnerships with 5+ universities, +10 enterprises, Local Government and global sponsors (Base, Uniswap and ETHGlobal) to expand Web3 adoption in the Colombian Pacific region.',
     'Organized hackathons, workshops, and public goods funding rounds, onboarding 380+ new users into Ethereum and financing 10+ community projects.',
     'Represented Colombia''s Pacific Region in global Ethereum initiatives, building ecosystem bridges between academia, enterprises, and developers.'
   ],
   'https://ethcali.org',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethcali.png',
   '{"twitter": "https://x.com/ethcali_org", "linkedin": "https://www.linkedin.com/company/eth-cali/", "github": "https://github.com/orgs/ETHcali/"}'::jsonb, 1),

  ('Ekinoxis', 'Founder', '2022–Present',
   'Researching and Building tailored and open-sourced products and services based on AI, Blockchain and Crypto',
   ARRAY[
     'Designed and shipped 6 open-sourced projects using Privy.io, ZKpassport, Chainlink, Uniswap V4.',
     'Advised 5 Corporate executives about solutions based on ethereum technologies.',
     'Delivered 3 end-to-end ethereum-based solutions for corporates and SMEs.'
   ],
   'https://ekinoxis.xyz',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ekinoxis.png',
   '{"twitter": "https://x.com/ekinoxis", "linkedin": "https://www.linkedin.com/company/ekinoxis-labs/", "github": "https://github.com/orgs/Ekinoxis-evm/"}'::jsonb, 2),

  ('Convexo', 'Founder', '2022–Present',
   'Reducing Gap funding for SMEs in LATAm through international crypto rails with privacy-persistent ID solutions',
   ARRAY[
     'Launching a Tokenized Identity based on ZK Passport, Veriff, Sumsub and AI Credit Scoring.',
     'Enabling funding through creation of Electronic Loans (Vaults) and Electronic Contracts with IPFS.',
     'Using Uniswap V4 Hooks to enable permissioned trades and liquidity provision with pools that use LATAM local stablecoin with Chainlink CCIP.'
   ],
   'https://convexo.xyz',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/convexo.png',
   '{"twitter": "https://x.com/convexoprotocol", "linkedin": "https://www.linkedin.com/company/convexo-protocol", "github": "https://github.com/orgs/Convexo-finance/"}'::jsonb, 3);

-- Education
insert into education (degree, institution, years, abroad_program, logo_url, "order") values
  ('B.A. Economics & International Business', 'Universidad ICESI', '2014–2021',
   'Abroad Program: MSc Project Management & Business Development, SKEMA Business School, Paris',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/icesi.png', 1),
  ('B.A. Management & International Business', 'Universidad ICESI', '2017–2021',
   'Abroad Program: MSc Corporate Finance, Montpellier Business School, Montpellier',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/icesi.png', 2);

-- Certificates
insert into certificates (name, issuer, year, logo_url, "order") values
  ('Uniswap Hooks Incubator', 'Atrium Academy', 'Q3 2025',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/atrium.png', 1),
  ('Bloomberg BMC', 'Bloomberg', '2020',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/bloomberg.png', 2);

-- Volunteering
insert into volunteering (name, issuer, year, logo_url, "order") values
  ('Grantee', 'QF for Public Goods in Colombia with Privacy Scaling Explorations', '2024',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/esp.png', 1),
  ('DEVCON Volunteer', 'Ethereum Foundation – DEVCON VI (2022), DEVCON VII (2024)', '2022–2024',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethereumf.png', 2),
  ('DEVCONNECT Volunteer Lead', 'Ethereum Foundation – Argentina 2025', '2025',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethereumf.png', 3),
  ('Hackathon Finalist', 'ETHGlobal Bogotá', '2022',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethglobal.png', 4);

-- Skills (technical)
insert into skills (category, items, type, "order") values
  ('Programming Languages', ARRAY['JavaScript','HTML','CSS','TypeScript','Solidity','Python','SQL'], 'technical', 1),
  ('Programming Tools', ARRAY['Remix','OpenZeppelin','Vercel','Figma','VS Code','Git'], 'technical', 2),
  ('Product Management', ARRAY['Notion','Airtable','Jira','Google Workspace','Miro'], 'technical', 3),
  ('CRM & Growth', ARRAY['HubSpot','Mailchimp','Canva','Analytics'], 'technical', 4),
  ('AI Build', ARRAY['Claude Code','Cursor','V0','ChatGPT','Gemini'], 'technical', 5);

-- Skills (soft)
insert into skills (category, items, type, "order") values
  ('Business Development', ARRAY['Institutional negotiations','C-suite consulting','Deal execution','Strategic partnerships','Market expansion'], 'soft', 6),
  ('Custody & Treasury', ARRAY['DAO Governance','OTC Institutional Ramps','Compliance Frameworks','Treasury Management','Risk Management'], 'soft', 7),
  ('Blockchain & Web3', ARRAY['DeFi','Tokenization','Custody Integrations','RWA','Smart Contracts'], 'soft', 8);
```

- [ ] **Step 4: Run seed in Supabase SQL Editor**

Go to Supabase Dashboard → SQL Editor → paste `seed.sql` (with `<SUPABASE_URL>` replaced) → Run.

Expected: All rows inserted. Verify in Table Editor.

- [ ] **Step 5: Test public read via anon key**

In browser or curl, test: `GET https://<project>.supabase.co/rest/v1/profile?select=*` with header `apikey: <anon key>`.

Expected: Returns profile row JSON.

- [ ] **Step 6: Create Supabase Auth user for admin**

Go to Supabase Dashboard → Authentication → Users → Add User → enter your email + strong password. This is your admin login.

- [ ] **Step 7: Commit seed file**

```bash
git add portfolio/supabase/seed.sql
git commit -m "feat: add Supabase seed data from existing HTML content"
```

---

## Chunk 3: Portfolio Frontend

### Task 6: Root layout and Navbar

**Files:**
- Modify: `portfolio/src/app/layout.tsx`
- Create: `portfolio/src/components/Navbar.tsx`

- [ ] **Step 1: Update root layout**

Replace `portfolio/src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'William Martinez Bolaños – Product Manager',
  description: 'Product Manager & Business Developer specializing in Crypto, Fintech, and AI',
  keywords: 'Product Manager, Business Development, Crypto, Blockchain, Fintech, AI',
  openGraph: {
    title: 'William Martinez Bolaños – Portfolio',
    description: 'Product Manager & Business Developer with expertise in Crypto, Fintech, and AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Create Navbar component**

Create `portfolio/src/components/Navbar.tsx`:
```typescript
'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-accent font-medium tracking-wider">
          0xwmb
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-text-dim hover:text-text transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="#download-cv"
            className="text-sm px-4 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors"
          >
            Download CV
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-text-dim" onClick={() => setOpen(!open)}>
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-text-dim" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#download-cv" className="text-sm text-accent" onClick={() => setOpen(false)}>
            Download CV
          </a>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add portfolio/src/app/layout.tsx portfolio/src/components/Navbar.tsx
git commit -m "feat: add root layout and sticky Navbar"
```

---

### Task 7: Hero section

**Files:**
- Create: `portfolio/src/components/sections/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Create `portfolio/src/components/sections/Hero.tsx`:
```typescript
import Image from 'next/image'
import type { Profile, Contact, Language } from '@/lib/types'

interface HeroProps {
  profile: Profile
  contact: Contact
  languages: Language[]
}

const socialLinks = (contact: Contact) => [
  { href: `mailto:${contact.email}`, label: 'Email' },
  { href: contact.linkedin, label: 'LinkedIn' },
  { href: contact.github, label: 'GitHub' },
  { href: contact.twitter, label: 'X' },
  { href: contact.farcaster, label: 'Farcaster' },
  { href: contact.telegram, label: 'Telegram' },
]

export default function Hero({ profile, contact, languages }: HeroProps) {
  return (
    <section className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {profile.photo_url && (
          <Image
            src={profile.photo_url}
            alt={profile.name}
            width={96}
            height={96}
            className="rounded-full border-2 border-border object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-lg text-accent font-mono">{profile.title}</p>
          <p className="mt-1 text-sm text-text-dim">{profile.industries}</p>

          {/* Contact links */}
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks(contact).map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-xs font-mono text-text-dim border border-border px-2 py-1 rounded hover:border-accent hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Languages */}
          <div className="mt-3 flex flex-wrap gap-2">
            {languages.map((l) => (
              <span key={l.id} className="text-xs text-text-dim font-mono">
                {l.flag} {l.name} <span className="text-muted">({l.level})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add portfolio/src/components/sections/Hero.tsx
git commit -m "feat: add Hero section component"
```

---

### Task 8: Summary, Experience, Projects sections

**Files:**
- Create: `portfolio/src/components/sections/Summary.tsx`
- Create: `portfolio/src/components/sections/Experience.tsx`
- Create: `portfolio/src/components/sections/Projects.tsx`

- [ ] **Step 1: Create Summary component**

Create `portfolio/src/components/sections/Summary.tsx`:
```typescript
interface SummaryProps {
  text: string
}

export default function Summary({ text }: SummaryProps) {
  return (
    <section className="py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-4">Professional Summary</h2>
      <p className="text-text-dim leading-relaxed max-w-3xl">{text}</p>
    </section>
  )
}
```

- [ ] **Step 2: Create Experience component**

Create `portfolio/src/components/sections/Experience.tsx`:
```typescript
import Image from 'next/image'
import type { Experience } from '@/lib/types'

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Experience</h2>
      <div className="flex flex-col gap-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex gap-4">
            {exp.logo_url && (
              <Image src={exp.logo_url} alt={exp.company} width={40} height={40}
                className="rounded border border-border object-contain flex-shrink-0 mt-1 bg-surface p-1" />
            )}
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <span className="font-semibold text-text">{exp.role}</span>
                  <span className="text-text-dim"> — </span>
                  <a href={exp.website} target="_blank" rel="noopener noreferrer"
                    className="text-text-dim hover:text-accent transition-colors">{exp.company}</a>
                </div>
                <span className="text-xs font-mono text-muted flex-shrink-0">{exp.years}</span>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {exp.points.map((pt, i) => (
                  <li key={i} className="text-sm text-text-dim flex gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Projects component**

Create `portfolio/src/components/sections/Projects.tsx`:
```typescript
import Image from 'next/image'
import type { Project } from '@/lib/types'

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3 hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {p.logo_url && (
                  <Image src={p.logo_url} alt={p.name} width={32} height={32}
                    className="rounded border border-border object-contain bg-surface-2 p-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <span className="text-xs text-text-dim">{p.role}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-muted flex-shrink-0">{p.years}</span>
            </div>
            <p className="text-xs text-text-dim">{p.brief}</p>
            <ul className="flex flex-col gap-1">
              {p.points.slice(0, 2).map((pt, i) => (
                <li key={i} className="text-xs text-text-dim flex gap-2">
                  <span className="text-accent flex-shrink-0">·</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            {/* Social links */}
            <div className="flex gap-2 mt-auto pt-2 border-t border-border">
              {Object.entries(p.socials || {}).map(([key, url]) => (
                <a key={key} href={url as string} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-muted hover:text-accent transition-colors capitalize">{key}</a>
              ))}
              <a href={p.website} target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono text-muted hover:text-accent transition-colors ml-auto">site →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/sections/
git commit -m "feat: add Summary, Experience, Projects section components"
```

---

### Task 9: Education, Certificates, Skills sections and main page

**Files:**
- Create: `portfolio/src/components/sections/Education.tsx`
- Create: `portfolio/src/components/sections/Certificates.tsx`
- Create: `portfolio/src/components/sections/Skills.tsx`
- Modify: `portfolio/src/app/page.tsx`

- [ ] **Step 1: Create Education component**

Create `portfolio/src/components/sections/Education.tsx`:
```typescript
import Image from 'next/image'
import type { Education } from '@/lib/types'

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Education</h2>
      <div className="flex flex-col gap-6">
        {education.map((e) => (
          <div key={e.id} className="flex gap-4">
            {e.logo_url && (
              <Image src={e.logo_url} alt={e.institution} width={40} height={40}
                className="rounded border border-border object-contain flex-shrink-0 mt-1 bg-surface p-1" />
            )}
            <div>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="font-semibold text-sm">{e.degree}</h3>
                <span className="text-xs font-mono text-muted">{e.years}</span>
              </div>
              <p className="text-sm text-text-dim">{e.institution}</p>
              {e.abroad_program && (
                <p className="text-xs text-muted mt-1 italic">{e.abroad_program}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Certificates component**

Create `portfolio/src/components/sections/Certificates.tsx`:
```typescript
import Image from 'next/image'
import type { Certificate } from '@/lib/types'

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section className="py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-6">Certificates</h2>
      <div className="flex flex-wrap gap-4">
        {certificates.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-surface border border-border rounded px-3 py-2">
            {c.logo_url && (
              <Image src={c.logo_url} alt={c.name} width={24} height={24} className="object-contain" />
            )}
            <div>
              <p className="text-xs font-medium">{c.name}</p>
              <p className="text-xs text-muted">{c.issuer} · {c.year}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Skills component**

Create `portfolio/src/components/sections/Skills.tsx`:
```typescript
import type { Skill } from '@/lib/types'

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const technical = skills.filter(s => s.type === 'technical')
  const soft = skills.filter(s => s.type === 'soft')

  return (
    <section id="skills" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Skills</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Tooling</h3>
          <div className="flex flex-col gap-4">
            {technical.map((s) => (
              <div key={s.id}>
                <p className="text-xs text-text-dim font-medium mb-1">{s.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <span key={item} className="text-xs font-mono bg-surface-2 border border-border px-2 py-0.5 rounded text-text-dim">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Core Competencies</h3>
          <div className="flex flex-col gap-4">
            {soft.map((s) => (
              <div key={s.id}>
                <p className="text-xs text-text-dim font-medium mb-1">{s.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <span key={item} className="text-xs font-mono bg-surface-2 border border-border px-2 py-0.5 rounded text-text-dim">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create main page.tsx with server-side data fetching**

Replace `portfolio/src/app/page.tsx`:
```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PortfolioData } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Summary from '@/components/sections/Summary'
import ExperienceSection from '@/components/sections/Experience'
import ProjectsSection from '@/components/sections/Projects'
import EducationSection from '@/components/sections/Education'
import CertificatesSection from '@/components/sections/Certificates'
import SkillsSection from '@/components/sections/Skills'
import DownloadCV from '@/components/DownloadCV'

async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = await createServerSupabaseClient()

  const [
    { data: profile },
    { data: experiences },
    { data: projects },
    { data: education },
    { data: certificates },
    { data: volunteering },
    { data: skills },
    { data: languages },
    { data: contact },
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('experiences').select('*').order('order'),
    supabase.from('projects').select('*').order('order'),
    supabase.from('education').select('*').order('order'),
    supabase.from('certificates').select('*').order('order'),
    supabase.from('volunteering').select('*').order('order'),
    supabase.from('skills').select('*').order('order'),
    supabase.from('languages').select('*').order('order'),
    supabase.from('contact').select('*').single(),
  ])

  if (!profile || !contact) {
    throw new Error('Failed to load required portfolio data — check Supabase env vars and RLS policies')
  }

  return {
    profile,
    experiences: experiences || [],
    projects: projects || [],
    education: education || [],
    certificates: certificates || [],
    volunteering: volunteering || [],
    skills: skills || [],
    languages: languages || [],
    contact,
  }
}

export default async function Page() {
  const data = await getPortfolioData()

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={data.profile} contact={data.contact} languages={data.languages} />
        <Summary text={data.profile.summary} />
        <ExperienceSection experiences={data.experiences} />
        <ProjectsSection projects={data.projects} />
        <EducationSection education={data.education} />
        <CertificatesSection certificates={data.certificates} />
        <SkillsSection skills={data.skills} />
        <div id="download-cv" className="py-12 px-6 max-w-5xl mx-auto border-t border-border flex justify-center">
          <DownloadCV data={data} />
        </div>
      </main>
      <footer className="py-8 px-6 text-center border-t border-border">
        <p className="text-xs font-mono text-muted">Built with Ethereum in mind</p>
      </footer>
    </>
  )
}
```

- [ ] **Step 5: Verify the app renders with real data**

```bash
npm run dev
```

Open http://localhost:3000. Expected: All sections render with data from Supabase (no empty sections, no console errors).

- [ ] **Step 6: Commit**

```bash
git add portfolio/src/components/sections/ portfolio/src/app/page.tsx
git commit -m "feat: add Education, Certificates, Skills sections and wire up main page"
```

---

## Chunk 4: PDF CV Generation

### Task 10: Download Inter .ttf fonts for PDF

**Files:**
- Create: `portfolio/public/fonts/Inter-Regular.ttf`
- Create: `portfolio/public/fonts/Inter-Bold.ttf`

- [ ] **Step 1: Download Inter font files**

`@react-pdf/renderer` requires `.ttf` or `.otf` files — it cannot parse `.woff`/`.woff2`.

```bash
mkdir -p portfolio/public/fonts
curl -L "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip" -o /tmp/inter.zip
unzip /tmp/inter.zip -d /tmp/inter/
cp "/tmp/inter/Inter Desktop/Inter-Regular.otf" portfolio/public/fonts/Inter-Regular.ttf
cp "/tmp/inter/Inter Desktop/Inter-Bold.otf" portfolio/public/fonts/Inter-Bold.ttf
```

Or manually: download from https://rsms.me/inter/, pick Inter-Regular.ttf and Inter-Bold.ttf, place in `portfolio/public/fonts/`.

- [ ] **Step 2: Verify fonts exist**

```bash
ls portfolio/public/fonts/
```
Expected: `Inter-Regular.ttf` and `Inter-Bold.ttf`

- [ ] **Step 3: Commit**

```bash
git add portfolio/public/fonts/
git commit -m "feat: add Inter TTF fonts for react-pdf CV generation"
```

---

### Task 12: Create react-pdf CV document

**Files:**
- Create: `portfolio/src/lib/pdf.tsx`
- Create: `portfolio/src/components/DownloadCV.tsx`

- [ ] **Step 1: Create the PDF document component**

Create `portfolio/src/lib/pdf.tsx`:
```typescript
import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'
import type { PortfolioData } from './types'

// react-pdf requires .ttf/.otf — NOT .woff/.woff2 (those will crash at render time)
// Download Inter .ttf files into portfolio/public/fonts/ before running:
//   https://github.com/rsms/inter/releases — download Inter.var.ttf or individual weights
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
})

// Named 'pdf' to avoid shadowing arrow-function parameter names like 's' or 'sk'
const pdf = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9, color: '#111', padding: '12mm 12mm', backgroundColor: '#fff' },
  header: { textAlign: 'center', borderBottom: '1.5pt solid #111', paddingBottom: 8, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 10, color: '#444', marginTop: 2 },
  contact: { fontSize: 8, color: '#666', marginTop: 3 },
  cols: { flexDirection: 'row', gap: 12, flex: 1 },
  left: { width: '30%', paddingRight: 10, borderRight: '0.5pt solid #e5e7eb' },
  right: { flex: 1 },
  sectionTitle: { fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#111', borderBottom: '0.5pt solid #ddd', paddingBottom: 2, marginBottom: 5, marginTop: 10 },
  entry: { marginBottom: 7 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  entryTitle: { fontWeight: 700, fontSize: 9 },
  entryDate: { fontSize: 7.5, color: '#777' },
  entrySub: { fontSize: 8, color: '#555', marginTop: 1 },
  bullet: { flexDirection: 'row', marginTop: 2, gap: 4 },
  dot: { color: '#6366f1', fontSize: 8 },
  bulletText: { fontSize: 8, color: '#333', flex: 1, lineHeight: 1.4 },
  tag: { backgroundColor: '#f3f4f6', color: '#374151', fontSize: 7, padding: '1pt 4pt', marginRight: 3, marginBottom: 3, borderRadius: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
})

function SectionTitle({ children }: { children: string }) {
  return <Text style={pdf.sectionTitle}>{children}</Text>
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={pdf.bullet}>
      <Text style={pdf.dot}>·</Text>
      <Text style={pdf.bulletText}>{text}</Text>
    </View>
  )
}

export function CVDocument({ data }: { data: PortfolioData }) {
  const { profile, contact, experiences, projects, education, certificates, volunteering, skills, languages } = data
  const technical = skills.filter(s => s.type === 'technical')
  const soft = skills.filter(s => s.type === 'soft')

  return (
    <Document>
      <Page size="A4" style={pdf.page}>
        {/* Header */}
        <View style={pdf.header}>
          <Text style={pdf.name}>{profile.name}</Text>
          <Text style={pdf.title}>{profile.title}</Text>
          <Text style={pdf.contact}>
            {contact.email} · {contact.linkedin?.replace('https://', '')} · {contact.github?.replace('https://', '')}
          </Text>
        </View>

        {/* Two-column body */}
        <View style={pdf.cols}>
          {/* LEFT */}
          <View style={pdf.left}>
            <SectionTitle>Education</SectionTitle>
            {education.map((e) => (
              <View key={e.id} style={pdf.entry}>
                <Text style={pdf.entryTitle}>{e.degree}</Text>
                <Text style={pdf.entrySub}>{e.institution}</Text>
                <Text style={pdf.entryDate}>{e.years}</Text>
                {e.abroad_program && <Text style={{ ...s.entrySub, fontStyle: 'italic' }}>{e.abroad_program}</Text>}
              </View>
            ))}

            <SectionTitle>Skills</SectionTitle>
            {[...technical, ...soft].map((sk) => (
              <View key={sk.id} style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#444', marginBottom: 2 }}>{sk.category}</Text>
                <View style={pdf.tagsRow}>
                  {sk.items.map((item) => <Text key={item} style={pdf.tag}>{item}</Text>)}
                </View>
              </View>
            ))}

            <SectionTitle>Languages</SectionTitle>
            {languages.map((l) => (
              <Text key={l.id} style={{ fontSize: 8, marginBottom: 2 }}>{l.flag} {l.name} — {l.level}</Text>
            ))}

            <SectionTitle>Certificates</SectionTitle>
            {certificates.map((c) => (
              <View key={c.id} style={pdf.entry}>
                <Text style={{ fontSize: 8, fontWeight: 700 }}>{c.name}</Text>
                <Text style={pdf.entrySub}>{c.issuer} · {c.year}</Text>
              </View>
            ))}
          </View>

          {/* RIGHT */}
          <View style={pdf.right}>
            <SectionTitle>Professional Summary</SectionTitle>
            <Text style={{ fontSize: 8.5, color: '#333', lineHeight: 1.5 }}>{profile.summary}</Text>

            <SectionTitle>Experience</SectionTitle>
            {experiences.map((e) => (
              <View key={e.id} style={pdf.entry}>
                <View style={pdf.entryHeader}>
                  <Text style={pdf.entryTitle}>{e.role} — {e.company}</Text>
                  <Text style={pdf.entryDate}>{e.years}</Text>
                </View>
                {e.points.map((pt, i) => <Bullet key={i} text={pt} />)}
              </View>
            ))}

            <SectionTitle>Projects</SectionTitle>
            {projects.map((p) => (
              <View key={p.id} style={pdf.entry}>
                <View style={pdf.entryHeader}>
                  <Text style={pdf.entryTitle}>{p.name} · {p.role}</Text>
                  <Text style={pdf.entryDate}>{p.years}</Text>
                </View>
                {p.points.slice(0, 2).map((pt, i) => <Bullet key={i} text={pt} />)}
              </View>
            ))}

            <SectionTitle>Volunteering</SectionTitle>
            {volunteering.map((v) => (
              <View key={v.id} style={pdf.entry}>
                <Text style={pdf.entryTitle}>{v.name}</Text>
                <Text style={pdf.entrySub}>{v.issuer}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
```

- [ ] **Step 2: Create DownloadCV client component**

Create `portfolio/src/components/DownloadCV.tsx`:
```typescript
'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'
import type { PortfolioData } from '@/lib/types'

export default function DownloadCV({ data }: { data: PortfolioData }) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} />}
      fileName="William_Martinez_Bolanos_CV.pdf"
      className="px-6 py-3 bg-accent text-white text-sm font-mono rounded hover:bg-accent-dim transition-colors"
    >
      {({ loading }) => loading ? 'Generating CV...' : 'Download CV (PDF)'}
    </PDFDownloadLink>
  )
}
```

- [ ] **Step 3: Verify PDF renders and downloads**

```bash
npm run dev
```

Open http://localhost:3000, scroll to bottom, click "Download CV". Expected: PDF downloads with white 2-column layout, all data present, text is selectable.

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/lib/pdf.tsx portfolio/src/components/DownloadCV.tsx
git commit -m "feat: add react-pdf CV document and download button"
```

---

## Chunk 5: Admin Panel

### Task 13: Middleware and admin login

**Files:**
- Create: `portfolio/src/middleware.ts`
- Create: `portfolio/src/app/admin/login/page.tsx`

- [ ] **Step 1: Create middleware for route protection**

Create `portfolio/src/middleware.ts` (at `src/` level, NOT inside `app/`):
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
  // Both entries needed: '/admin/:path*' does NOT match the bare '/admin' route in Next.js 14
}
```

- [ ] **Step 2: Create admin login page**

Create `portfolio/src/app/admin/login/page.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-lg font-mono text-accent">Admin Login</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent" required />
        <button type="submit" disabled={loading}
          className="bg-accent text-white rounded px-4 py-2 text-sm font-mono hover:bg-accent-dim disabled:opacity-50 transition-colors">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Test auth redirect**

```bash
npm run dev
```

Open http://localhost:3000/admin. Expected: Redirected to /admin/login. Login with the admin credentials created in Task 5, Step 6. Expected: Redirected to /admin (404 for now — that's fine).

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/middleware.ts portfolio/src/app/admin/login/page.tsx
git commit -m "feat: add admin middleware auth guard and login page"
```

---

### Task 14: Admin dashboard with CRUD forms

**Files:**
- Create: `portfolio/src/app/admin/page.tsx`
- Create: `portfolio/src/app/admin/actions.ts`
- Create: `portfolio/src/app/admin/AdminDashboard.tsx`

- [ ] **Step 1: Create server actions for CRUD**

Create `portfolio/src/app/admin/actions.ts`:
```typescript
'use server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const admin = () => createAdminSupabaseClient()

// Generic upsert
export async function upsertRecord(table: string, data: Record<string, unknown>) {
  const { error } = await admin().from(table).upsert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin')
}

// Generic delete
export async function deleteRecord(table: string, id: number) {
  const { error } = await admin().from(table).delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin')
}
```

- [ ] **Step 2: Create admin dashboard page**

Create `portfolio/src/app/admin/page.tsx`:
```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: profile },
    { data: experiences },
    { data: projects },
    { data: education },
    { data: certificates },
    { data: volunteering },
    { data: skills },
    { data: languages },
    { data: contact },
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('experiences').select('*').order('order'),
    supabase.from('projects').select('*').order('order'),
    supabase.from('education').select('*').order('order'),
    supabase.from('certificates').select('*').order('order'),
    supabase.from('volunteering').select('*').order('order'),
    supabase.from('skills').select('*').order('order'),
    supabase.from('languages').select('*').order('order'),
    supabase.from('contact').select('*').single(),
  ])

  return (
    <AdminDashboard
      initialData={{ profile, experiences, projects, education, certificates, volunteering, skills, languages, contact }}
    />
  )
}
```

- [ ] **Step 3: Create AdminDashboard client component**

Create `portfolio/src/app/admin/AdminDashboard.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertRecord, deleteRecord } from './actions'
import { createClient } from '@/lib/supabase'
import type { PortfolioData } from '@/lib/types'

const TABS = ['Profile', 'Experience', 'Projects', 'Education', 'Certificates', 'Volunteering', 'Skills', 'Languages', 'Contact']

function JsonEditor({ table, data, onSave }: { table: string; data: Record<string, unknown>; onSave: () => void }) {
  const [value, setValue] = useState(JSON.stringify(data, null, 2))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    try {
      await upsertRecord(table, JSON.parse(value))
      onSave()
    } catch (e) {
      setError(String(e))
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={15}
        className="bg-surface-2 border border-border rounded p-3 text-xs font-mono text-text w-full focus:outline-none focus:border-accent"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button onClick={save} disabled={saving}
        className="self-start bg-accent text-white text-xs px-4 py-2 rounded font-mono hover:bg-accent-dim disabled:opacity-50 transition-colors">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

function ListEditor({ table, items }: { table: string; items: Record<string, unknown>[] }) {
  const [list, setList] = useState(items)
  const [editing, setEditing] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    await deleteRecord(table, id)
    setList(list.filter(i => i.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {list.map((item) => (
        <div key={item.id as number} className="bg-surface-2 border border-border rounded p-3 flex justify-between items-start gap-4">
          <pre className="text-xs font-mono text-text-dim flex-1 overflow-auto">{JSON.stringify(item, null, 2)}</pre>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setEditing(editing === (item.id as number) ? null : (item.id as number))}
              className="text-xs text-accent hover:underline">Edit</button>
            <button onClick={() => handleDelete(item.id as number)}
              className="text-xs text-red-400 hover:underline">Delete</button>
          </div>
        </div>
      ))}
      {editing !== null && (
        <JsonEditor
          table={table}
          data={list.find(i => i.id === editing) || {}}
          onSave={() => setEditing(null)}
        />
      )}
      <button onClick={() => setEditing(-1)}
        className="self-start text-xs text-accent border border-accent px-3 py-1 rounded font-mono hover:bg-accent hover:text-white transition-colors">
        + Add new
      </button>
      {editing === -1 && (
        <JsonEditor table={table} data={{}} onSave={() => setEditing(null)} />
      )}
    </div>
  )
}

export default function AdminDashboard({ initialData }: { initialData: Partial<PortfolioData> }) {
  const [tab, setTab] = useState('Profile')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const TABLE_MAP: Record<string, string> = {
    Profile: 'profile', Experience: 'experiences', Projects: 'projects',
    Education: 'education', Certificates: 'certificates', Volunteering: 'volunteering',
    Skills: 'skills', Languages: 'languages', Contact: 'contact',
  }

  const DATA_MAP: Record<string, unknown> = {
    Profile: initialData.profile,
    Experience: initialData.experiences,
    Projects: initialData.projects,
    Education: initialData.education,
    Certificates: initialData.certificates,
    Volunteering: initialData.volunteering,
    Skills: initialData.skills,
    Languages: initialData.languages,
    Contact: initialData.contact,
  }

  const isArray = Array.isArray(DATA_MAP[tab])

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-accent text-lg">0xwmb Admin</h1>
          <div className="flex gap-4">
            <a href="/" className="text-xs text-text-dim hover:text-text">← View site</a>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-mono px-3 py-1.5 rounded transition-colors ${
                tab === t ? 'bg-accent text-white' : 'text-text-dim border border-border hover:border-accent hover:text-accent'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-4">{tab}</h2>
          {isArray ? (
            <ListEditor table={TABLE_MAP[tab]} items={DATA_MAP[tab] as Record<string, unknown>[]} />
          ) : (
            <JsonEditor table={TABLE_MAP[tab]} data={DATA_MAP[tab] as Record<string, unknown>} onSave={() => {}} />
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Test admin panel**

```bash
npm run dev
```

Login at /admin/login. Expected: Admin dashboard with 9 tabs, each showing current data as JSON, editable and saveable. Make a small edit (e.g. summary text), save, verify change appears on the main page.

- [ ] **Step 5: Commit**

```bash
git add portfolio/src/app/admin/
git commit -m "feat: add admin dashboard with JSON-based CRUD for all sections"
```

---

## Chunk 6: Deployment & Cleanup

### Task 15: Deploy to Vercel

**Files:**
- Delete: `.github/workflows/deploy.yml`
- Delete: `index.html`, `experience.html`, `projects.html`, `academic.html`, `skills.html`, `styles.css`, `styles-old.css`, `script.js` (after confirming Next.js site is live)

- [ ] **Step 1: Install Vercel CLI and link project**

```bash
cd portfolio
npx vercel login
npx vercel link
```

Follow prompts to create a new Vercel project named `0xwmb`.

- [ ] **Step 2: Add environment variables to Vercel**

Add to both `production` and `preview` environments:
```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY preview
```

Enter the values from your Supabase dashboard when prompted.

- [ ] **Step 3: Deploy**

```bash
npx vercel --prod
```

Expected: Build succeeds, site live at `https://0xwmb.vercel.app` (or your custom domain).

- [ ] **Step 4: Verify live site**

Open the Vercel URL. Expected:
- All sections render with real data
- Download CV button generates a PDF
- /admin/login works, /admin dashboard is accessible after login

- [ ] **Step 5: Connect GitHub for auto-deploy**

In Vercel dashboard → Import Git Repository → select `0xwmb` repo → configure auto-deploy from `main`.

- [ ] **Step 6: Delete old GitHub Pages workflow**

```bash
rm /Users/williammartinez/0xwmb/.github/workflows/deploy.yml
git add .github/
git commit -m "chore: remove GitHub Pages deploy workflow (replaced by Vercel)"
```

- [ ] **Step 7: Archive old HTML files**

Move old static files to `legacy/` for reference, or delete them:
```bash
mkdir legacy
mv index.html experience.html projects.html academic.html skills.html styles.css styles-old.css script.js legacy/
git add legacy/ index.html experience.html projects.html academic.html skills.html styles.css styles-old.css script.js
git commit -m "chore: archive old static HTML site (replaced by Next.js)"
```

- [ ] **Step 8: Final smoke test**

- [ ] Main page loads at Vercel URL with all data
- [ ] Navbar anchor links scroll to correct sections
- [ ] Download CV button generates correct PDF with all content
- [ ] /admin redirects to /admin/login when not authenticated
- [ ] Admin login works and dashboard edits reflect on the main site
- [ ] Mobile layout looks clean (resize browser to 375px width)

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio redesign — Next.js + Supabase + react-pdf"
```

---

## Quick Reference

| Section | Table | Component |
|---------|-------|-----------|
| Hero | profile + contact + languages | `Hero.tsx` |
| Summary | profile.summary | `Summary.tsx` |
| Experience | experiences | `Experience.tsx` |
| Projects | projects | `Projects.tsx` |
| Education | education | `Education.tsx` |
| Certificates | certificates | `Certificates.tsx` |
| Skills | skills | `Skills.tsx` |
| PDF Left | education + skills + languages + certificates | `lib/pdf.tsx` |
| PDF Right | summary + experiences + projects + volunteering | `lib/pdf.tsx` |

| Env Var | Used in | Value from |
|---------|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client reads | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server admin writes | Supabase → Settings → API |
