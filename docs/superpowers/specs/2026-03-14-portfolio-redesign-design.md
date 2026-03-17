
# Portfolio Redesign — Design Spec
**Date:** 2026-03-14
**Status:** Approved

---

## Overview

Rebuild William Martinez Bolaños' personal portfolio (0xwmb) from a 5-page static HTML site into a modern, data-driven single-page Next.js application with a Supabase backend and built-in admin panel. Also produce a clean 1-page ATS-friendly PDF CV generated from live data.

---

## Goals

1. **Single-page portfolio** — all content on one scrollable page, no multi-page navigation
2. **Minimalist dark professional theme** — cleaner than current (less visual noise, more whitespace)
3. **Supabase-backed content** — all CV data stored in Postgres, editable without touching code
4. **Admin panel** — password-protected `/admin` route for CRUD on all sections
5. **1-page PDF CV** — white background, ATS-friendly, 2-column, generated from live data via react-pdf

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (email/password for admin) |
| PDF | react-pdf |
| Deployment | Vercel |

---

## Project Structure

```
src/
  app/
    page.tsx              ← single-page portfolio
    admin/
      page.tsx            ← protected admin dashboard
      login/
        page.tsx          ← admin login page
    layout.tsx
    middleware.ts         ← route guard: redirects unauthenticated /admin to /admin/login
  components/
    sections/
      Hero.tsx            ← name, title, contact row, languages
      Summary.tsx
      Experience.tsx
      Projects.tsx
      Education.tsx
      Certificates.tsx
      Skills.tsx
    admin/
      ExperienceForm.tsx
      ProjectForm.tsx
      EducationForm.tsx
      CertificatesForm.tsx
      VolunteeringForm.tsx
      SkillsForm.tsx
      LanguagesForm.tsx
      ContactForm.tsx
      ProfileForm.tsx
    ui/                   ← shared Card, Button, Tag components
  lib/
    supabase.ts           ← Supabase client (anon for reads, service role for admin writes)
    pdf.ts                ← react-pdf CV document
```

### Admin Auth Guard
Protected via `middleware.ts` using `@supabase/ssr` — unauthenticated requests to `/admin/*` are redirected to `/admin/login`. Server-side session check, not bypassable client-side.

---

## Supabase Data Model

| Table | Key Fields |
|-------|-----------|
| `profile` | name, title, summary, photo_url, industries |
| `experiences` | role, company, years, points[], website, logo_url, order |
| `projects` | name, role, years, brief, points[], website, logo_url, socials{}, order |
| `education` | degree, institution, years, abroad_program, logo_url, order |
| `certificates` | name, issuer, year, logo_url, order |
| `volunteering` | name, issuer, year, logo_url, order |
| `skills` | category, items[], type ('technical'\|'soft'), order |
| `languages` | name, level, flag, order |
| `contact` | email, whatsapp, telegram, github, linkedin, twitter, farcaster |

### Row Level Security (RLS)
All tables have RLS enabled. Public `SELECT` via anon key (portfolio read). `INSERT/UPDATE/DELETE` restricted to authenticated session (admin only).

### Environment Variables
| Variable | Context | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Public read-only access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin writes (never exposed to client) |

Managed via `.env.local` locally and Vercel project environment settings in production.

---

## Website Layout (Single Page)

```
[Sticky Navbar]     0xwmb  ·  Experience  Projects  Education  Skills  [Download CV]

[Hero]              Photo · Name · Title
                    ─────────────────────────────────────
                    Email · LinkedIn · GitHub · X · Farcaster · Telegram
                    ES(C2) · EN(C1) · FR(B1)

[Summary]           Short paragraph

[Experience]        Role — Company                     2024–2025
                    · Bullet with metric
                    · Bullet with metric

[Projects]          3 cards in a row

[Education]         Degree, Institution, Abroad        2014–2021

[Certificates]      Compact grid of certificate badges

[Skills]            Grid of categorized tags

[Footer]            Built with Ethereum in mind
```

### Design Tokens
- Background: `#050810` (current, kept)
- Surface cards: `#0d1117` or `#111827`
- Accent: current Ethereum purple/blue
- Typography: Inter (body) + IBM Plex Mono (labels/code)
- No heavy grid background or ETH watermark on main content — keep only subtle footer accent

---

## PDF CV Layout (1-Page, White)

```
┌────────────────────────────────────────────────────────┐
│  WILLIAM MARTINEZ BOLAÑOS                              │
│  Product Manager · Web3 · DeFi · AI                   │
│  email · linkedin · github · phone                     │
├─────────────────┬──────────────────────────────────────┤
│ LEFT (30%)      │ RIGHT (70%)                          │
│                 │                                      │
│ EDUCATION       │ PROFESSIONAL SUMMARY                 │
│ ICESI 2014-21   │                                      │
│ SKEMA abroad    │ EXPERIENCE (reverse chronological)   │
│ MBS abroad      │ Role — Company         2024–2025     │
│                 │ · metric bullet                      │
│ SKILLS          │ · metric bullet                      │
│ (categorized)   │                                      │
│                 │ PROJECTS                             │
│ LANGUAGES       │ Name · Role · 1-2 bullets each       │
│ ES/EN/FR        │                                      │
│                 │ VOLUNTEERING                         │
│ CERTIFICATES    │ DEVCON VI/VII · ETHGlobal finalist   │
└─────────────────┴──────────────────────────────────────┘
```

- The Download CV button triggers a client-side `react-pdf` render inside a `"use client"` component. Data is pre-fetched server-side in `page.tsx` and passed as props to the PDF component — no client-side Supabase call needed for generation.
- Proper selectable text (ATS-safe — no image-based rendering)
- White background, black text, subtle gray section dividers

---

## Admin Panel

- Route: `/admin` — protected by Supabase Auth (email/password)
- Dashboard with tabs per section: Profile, Experience, Projects, Education, Skills, Languages, Contact
- Each tab: list of existing entries + Add/Edit/Delete forms
- No deployment needed to update CV content

---

## Out of Scope

- Blog or writing section
- Dark mode toggle
- Multi-language site content
- Analytics

---

## Migration Notes

- Current 5 HTML pages (experience, projects, academic, skills, index) are replaced by single `page.tsx`
- Content from HTML files needs to be seeded into Supabase tables once schema is created
- Images will be uploaded to Supabase Storage and their public URLs stored in the corresponding `logo_url` / `photo_url` fields in each table
- `styles-old.css` can be deleted
- `script.js` PDF logic is replaced by `react-pdf` in `lib/pdf.ts`
- Delete `.github/workflows/deploy.yml` (GitHub Pages) and configure Vercel GitHub integration to deploy from `main`
