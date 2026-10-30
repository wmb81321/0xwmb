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

## Design System — "The Sovereign Terminal"
Full spec: `design/DESIGN.md` | Reference HTML: `design/code.html` | Screenshot: `design/screen.png`

**Creative North Star:** High-contrast precision. Custom-built OS kernel aesthetic. Brutalist terminal. NOT a web template.

### Color Tokens (Tailwind custom colors from design/code.html)
```
background:               #10131c   ← page base
surface:                  #10131c   ← same as background
surface-dim:              #10131c
surface-container-lowest: #0a0e16
surface-container-low:    #181c24   ← cards, sections
surface-container:        #1c2028   ← nav/sidebar
surface-container-high:   #262a33   ← active cards, inputs
surface-container-highest:#31353e   ← modals, floating
surface-bright:           #353943
surface-variant:          #31353e

primary:                  #e2f8ff   ← light cyan (text on dark)
primary-container:        #00D1FF   ← bright cyan (CTAs, glows)
primary-fixed-dim:        #00D1FF
on-primary:               #003642   ← dark text on cyan buttons
on-primary-container:     #002a33

secondary:                #d3fbff
secondary-container:      #00eefc
secondary-fixed-dim:      #00dbe9

tertiary:                 #fff7fc
tertiary-container:       #f2d2ff   ← system alerts / encrypted status

on-surface:               #e0e2ee   ← primary text
on-surface-variant:       #b2c8cc   ← secondary/metadata text
on-background:            #e0e2ee

outline:                  #7f909e   ← input borders
outline-variant:          #32434d   ← ghost borders (use at 15% opacity)
```

### Typography
- **Font:** Space Grotesk (all levels — headline, body, label)
- Display: 3.5rem, letter-spacing -0.02em
- Body: 1rem (text scale bumped up — `text-xs`=14px, `text-sm`=16px via `@theme` overrides in globals.css)
- `primary` (#e2f8ff) for command/label text; `on-surface-variant` (#b2c8cc) for metadata

### Layout Rules
- **0px border-radius everywhere** (except `full: 9999px` for pills/avatars)
- **No 1px borders** for section separation — use tonal surface shifts instead
- **Ghost Border:** `outline-variant` at 15% opacity for inputs/data tables only
- **Blackspace:** leave generous empty space — premium, not cramped
- Heavy left-aligned typography with intentional asymmetric layout
- Glassmorphism for floating HUD: `surface-container-low` at 70% opacity + `backdrop-filter: blur(12px)`

### Signature Components
- **Data Pulse:** 4×4px `primary` square pulsing (opacity 1.0→0.4) next to active headers
- **Primary CTA:** Sharp 0px corners, gradient from `primary` to `primary-container` at 135°, "flicker" on hover
- **Secondary CTA:** 0px corners, ghost border (`primary` at 20%), text in `primary`
- **Input fields:** No background fill, only 1px bottom border (`outline`), active = 2px `primary`

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
