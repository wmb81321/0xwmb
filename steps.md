 Clean. Here's the repo now:

  0xwmb/
  ├── CLAUDE.md              ← repo context for Claude
  ├── LICENSE
  ├── README.md
  ├── docs/                  ← spec + implementation plan
  ├── jobs/                  ← job applications
  └── portfolio/             ← Next.js app (the real site)
      ├── public/
      │   ├── upload-assets/ ← all images ready to upload to Supabase
      │   └── fonts/         ← drop Inter-Regular.ttf + Inter-Bold.ttf here
      ├── src/
      │   ├── app/           ← page.tsx, admin/, layout.tsx
      │   ├── components/    ← Navbar, sections, DownloadCV
      │   ├── lib/           ← types, supabase clients, pdf
      │   └── proxy.ts       ← admin route protection
      └── supabase/          ← schema.sql + seed.sql

  Your remaining manual steps before going live:

  1. Fill in portfolio/.env.local with your Supabase keys
  2. Run portfolio/supabase/schema.sql in Supabase SQL Editor
  3. Upload everything from portfolio/public/upload-assets/ flat to a portfolio-assets Supabase
  Storage bucket
  4. Replace <SUPABASE_URL> in seed.sql and run it
  5. Create an admin user in Supabase Auth
  6. Drop Inter-Regular.ttf + Inter-Bold.ttf in portfolio/public/fonts/
  7. Run cd portfolio && npx vercel --prod