# 0xwmb

Portfolio and CV of William Martinez Bolaños, technical product manager in crypto and AI.

Live content comes from Supabase and is edited in a private admin; the CV downloads as an ATS-friendly PDF generated in the browser.

## Stack

Next.js 16 (App Router, Turbopack) · Supabase (Postgres, Auth, Storage) · Tailwind CSS 4 · react-pdf · Vercel

## Run it

```bash
npm install
# .env.local needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm run dev                  # http://localhost:3000
```

Pushes to `main` deploy to Vercel.

## Where things are

| Path | What |
| --- | --- |
| `src/app/page.tsx` | The public page |
| `src/lib/pdf.tsx` | The CV PDF |
| `src/app/admin/` | Private admin |
| `supabase/migrations/` | Database schema and RLS |
| `brand/` | WM personal brand mark |
| `DESIGN.md` · `PRODUCT.md` | Design system and product brief for the public site |
| `design/DESIGN.md` | Design system for the admin |
| `CLAUDE.md` | Working notes for AI agents |
| `docs/` | Ideas and history |

## License

MIT, see `LICENSE`. Content (text, photos, logos) is not covered by the license.
