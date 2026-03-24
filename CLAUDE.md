# 0xwmb Portfolio — CLAUDE.md

## Project Overview
William Martinez Bolaños personal portfolio and CV site.
Rebuild from static HTML → Next.js 14 + Supabase + Tailwind + react-pdf + Vercel.

## Architecture
- **Framework:** Next.js 14 App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage)
- **PDF:** @react-pdf/renderer (TTF fonts only — never .woff)
- **Deployment:** Vercel (auto-deploy from `main`)
- **New project lives in:** `portfolio/` directory

## Key Files
- `portfolio/src/app/page.tsx` — single-page portfolio (server component, fetches all data)
- `portfolio/src/app/admin/page.tsx` — admin dashboard (protected)
- `portfolio/src/middleware.ts` — admin route guard via @supabase/ssr
- `portfolio/src/lib/types.ts` — all shared TypeScript types
- `portfolio/src/lib/supabase.ts` — browser client (anon key)
- `portfolio/src/lib/supabase-server.ts` — server + admin clients
- `portfolio/src/lib/pdf.tsx` — react-pdf CV document
- `portfolio/supabase/schema.sql` — DB schema with RLS
- `portfolio/supabase/seed.sql` — initial content seed

## Supabase Tables
`profile`, `experiences`, `projects`, `education`, `certificates`, `volunteering`, `skills`, `languages`, `contact`, `job_applications`

RLS: public SELECT (anon key), writes restricted to `authenticated` role.
`job_applications` is admin-only (no public SELECT — private job tracking).

## Job Applications (`job_applications` table)
Private table for tracking job opportunities. Admin-only (no public RLS).
Fields: `company`, `position`, `website` (company site), `application_url` (link to apply),
`description` (full job posting text), `status` (saved/applied/interviewing/offered/rejected/withdrawn),
`applied_at` (date string), `notes` (personal notes), `order`, `created_at`.

When adding a new job from a file in `jobs/`:
1. Parse the markdown to extract company, position, description, and application link.
2. Use the admin panel `/admin` → Jobs tab to create a new entry.
3. Set `status = 'saved'` initially.

Source files for job postings live in `jobs/` at the repo root (markdown files, one per job).

## Design Tokens (Tailwind)
- `bg` = `#050810` (page background)
- `surface` = `#0d1117` (cards)
- `accent` = `#6366f1` (indigo)
- `text-dim` = `#9ca3af`
- Fonts: Inter (body), IBM Plex Mono (labels/mono)

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL       # public, client + server
NEXT_PUBLIC_SUPABASE_ANON_KEY  # public, read-only
SUPABASE_SERVICE_ROLE_KEY      # server only, never expose to client
```

## PDF Notes
- Fonts must be `.ttf`/`.otf` — placed in `portfolio/public/fonts/`
- Stylesheet named `pdf` (not `s`) to avoid arrow-function param shadowing
- Data pre-fetched server-side in `page.tsx`, passed as props to `DownloadCV` client component

## Admin Panel
- Route: `/admin` (protected by middleware)
- Login: `/admin/login` (Supabase Auth email/password)
- Middleware matcher: `['/admin', '/admin/:path*']` — both needed in Next.js 14
- Uses server actions (`actions.ts`) with `revalidatePath('/')` after writes

### Adding a new admin section
The admin dashboard is fully driven by config in `AdminDashboard.tsx`. To add a new table:
1. Add it to `FIELDS` (field definitions with types)
2. Add it to `TABLE_MAP` (tab label → Supabase table name)
3. Add it to `LIST_TABS` if it's a multi-record table (vs single-record like Profile/Contact)
4. Add the tab label to `TABS`
5. Add a `cardSummary` case for how the collapsed card looks
No changes needed to `actions.ts` — upsert/delete are fully generic.

## Legacy Files
Old static HTML files are in `legacy/` — do not modify. The active site is `portfolio/`.

## Spec & Plan
- Spec: `docs/superpowers/specs/2026-03-14-portfolio-redesign-design.md`
- Plan: `docs/superpowers/plans/2026-03-14-portfolio-redesign.md`
