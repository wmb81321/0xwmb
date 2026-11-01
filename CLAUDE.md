# 0xwmb Portfolio — CLAUDE.md

## Project Overview
William Martinez Bolaños personal portfolio and CV site.
Next.js 16 + Supabase + Tailwind + react-pdf + Vercel.
Next.js app lives at the repo root.

## Architecture
- **Framework:** Next.js 16.1.7 App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Auth:** Supabase Auth — email/password + Google OAuth
- **PDF:** @react-pdf/renderer (built-in fonts only — never .woff, TTF only if needed)
- **Deployment:** Vercel (auto-deploy from `main`, root directory = `/` (repo root))
- **Bundler:** Turbopack (default in Next.js 16)

## Key Files
- `src/app/page.tsx` — single-page portfolio (server component, fetches all data)
- `src/app/admin/page.tsx` — admin dashboard (protected)
- `src/app/admin/AdminDashboard.tsx` — full admin UI, config-driven (FIELDS, TABLE_MAP, TABS)
- `src/app/admin/actions.ts` — generic server actions: `upsertRecord`, `deleteRecord`, `uploadLogo`
- `src/app/admin/login/page.tsx` — login page (email/password + Google OAuth button)
- `src/app/auth/callback/route.ts` — OAuth callback, exchanges code for session → redirects to /admin
- `src/proxy.ts` — admin route guard via @supabase/ssr (Next.js 16 uses proxy.ts not middleware.ts)
- `src/lib/types.ts` — all shared TypeScript types
- `src/lib/supabase.ts` — browser client (anon key)
- `src/lib/supabase-server.ts` — server + admin clients
- `src/lib/pdf.tsx` — react-pdf CV document (two-column A4 layout)
- `supabase/migrations/` — DB schema with RLS, as timestamped migrations identical to the live migration history (start at `20260321123603_initial_schema.sql`)
- `supabase/seed.sql` — initial content seed

## Supabase Tables
`profile`, `experiences`, `projects`, `education`, `certificates`, `volunteering`, `skills`, `languages`, `contact`, `job_applications`

RLS: public SELECT (anon key) on all tables except `job_applications`.
`job_applications` is admin-only (no public SELECT — private job tracking).

## Job Applications (`job_applications` table)
Private table for tracking job opportunities. Admin-only (no public RLS).
Fields: `company`, `position`, `website` (company site), `application_url` (link to apply),
`description` (full job posting text), `status` (saved/applied/interviewing/offered/rejected/withdrawn),
`applied_at` (date string), `notes` (personal notes), `order`, `created_at`.

Source files for job postings live in `jobs/` at the repo root (markdown files, one per job).
To add a job: parse the markdown → admin panel `/admin` → Jobs tab → create entry with `status = 'saved'`.

## Design Systems
- **Public site (`/`): "The Prospectus".** Full spec: `DESIGN.md` (repo root) + `.impeccable/design.json`; product truth in `PRODUCT.md`; direction contract in `.impeccable/surfaces/src-app-page-tsx.md`.
  Paper white, ink, one institutional blue (email action + links only), hairline rules, navy bands for the logo wall and the close. Source Serif 4 display, Public Sans text. Copy: executive, short, no dashes.
  Logos render through `src/components/home/OpticalLogo.tsx` (optical sizing); background-removed logos live in Supabase Storage `portfolio-assets/v2/`.
- **Admin (`/admin`, Life OS): "The Sovereign Terminal".** Spec: `design/DESIGN.md` (dark surfaces, cyan, Space Grotesk + JetBrains Mono, 0px radius). Its tokens share `src/app/globals.css` with the Prospectus tokens; do not mix the two on one surface.

## PDF Notes
- Fonts: built-in PDF fonts (Helvetica/Helvetica-Bold) — no external font files needed
- Stylesheet object named `pdf` (not `s`) to avoid arrow-function param shadowing
- Two-column A4 layout: left 31% (education/languages/certs/volunteering), right flex-1 (summary/experience/projects/skills)
- Left column uses `sectionTitleSm` (marginTop: 5) to prevent vertical overflow; right uses `sectionTitle` (marginTop: 8)
- `wrap={false}` on individual entries to prevent mid-entry page splits

## Admin Panel
- Route: `/admin` (protected by proxy.ts)
- Login: `/admin/login` — email/password + Google OAuth ("Continue with Google")
- OAuth flow: signInWithOAuth → Google → `/auth/callback` → exchange code → redirect to `/admin`
- After OAuth, add `<origin>/auth/callback` to Supabase → Authentication → URL Configuration
- Server actions in `actions.ts` with `revalidatePath('/')` after writes
- Access is role-based: `public.user_roles` (owner/accountant/family) + `private.is_owner()` / `private.has_role()`
  SQL helpers in the non-exposed `private` schema (migrations in `supabase/migrations/`). `proxy.ts` requires a role row;
  every server action calls `requireRole()` from `src/lib/auth.ts` and checks the `WRITABLE_TABLES` allowlist.
  New tables must be added to `WRITABLE_TABLES` and get a `(select private.is_owner())` (or `has_role`) RLS policy.
- Supabase project: `nfzppyfqtcvwwokrrvca` ("Portafolio"). Apply migrations via the Supabase MCP.
- Admin panel ("Life OS") = route group `src/app/admin/(panel)/`. The layout requires a role plus a strong session
  (passkey, or aal2 via `?recovery=1` + TOTP).
  - `/admin` is the Command center.
  - `/admin/areas/[slug]` holds 11 areas, defined in `src/app/admin/areas.ts`: tabs over existing tables, filtered per area.
  - `/admin/inbox`, `/admin/jarvis` (memory) and `/admin/vault` (private docs).
  - `/admin/site` (public CV) and `/admin/security` (passkeys).
  - Area status dots come from `src/lib/areas-status.ts`.
- Jarvis (Telegram) lives in `src/lib/jarvis/`.
  - `router.ts`: Jev route + topic.
  - `agent.ts`: Haiku/Opus split, memory, usage log.
  - `tools.ts`: the exact column SCHEMA; proposals are validated, then confirmed by a tap.
- 2025 ledger (Finances area, Jarvis read + annotate only): `personal_statements`, `personal_bank_movements`, `personal_exchange_movements`,
  `personal_crypto_orders`, `personal_flow_links` (migration `20261030120000`). Rows come from statement loaders; Jarvis sums them with `finance_totals`.
- Private tables are `public.personal_*` with owner-only RLS and no anon grants. They reuse the config-driven editor:
  add FIELDS + TABLE_MAP + LIST_TABS + cardSummary in `AdminDashboard.tsx`, the tab in `src/app/admin/tabs.ts`,
  and the table in `WRITABLE_TABLES` (`actions.ts`). Never store secrets: last-4 + password-manager links only.
  Personal seed data is applied directly to the DB and is NOT committed (public repo).

### Adding a new admin section
Config-driven — all changes go in `AdminDashboard.tsx`:
1. Add to `FIELDS` (field definitions with types: text/textarea/url/number/image/array/keyvalue/select)
2. Add to `TABLE_MAP` (tab label → Supabase table name)
3. Add to `LIST_TABS` if multi-record (vs single-record like Profile/Contact)
4. Add the tab label to `TABS`
5. Add a `cardSummary` case
`actions.ts` is fully generic — no changes needed.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL       # public, client + server
NEXT_PUBLIC_SUPABASE_ANON_KEY  # public, read-only
SUPABASE_SERVICE_ROLE_KEY      # server only, never expose to client
```

## Vercel Project
- Project name: `0xwmb` (team: ekinoxis-team)
- Root Directory must be **blank / repo root** (app was moved from `portfolio/` to root in March 2026)
- Auto-deploys from `main` branch of `wmb81321/0xwmb` repo
