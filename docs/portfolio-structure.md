# 0xwmb Portfolio — Page Structure Document
> For use with Stitch / design tools. Full breakdown of every section, field, and layout pattern.

---

## Overview

Single-page portfolio website for **William Martinez Bolaños** — Product Manager, Researcher, and Ethereum Community Leader. The page is data-driven (all content lives in a database) and includes a downloadable PDF CV.

**Persona:** Web3 / Crypto / AI professional. Builder. Community leader. The design should feel technical, credible, and modern — not corporate.

---

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR (fixed, top)                                │
├─────────────────────────────────────────────────────┤
│  HERO                                               │
│  → Photo · Name · Title · Industries · Socials      │
│  → Language badges                                  │
├─────────────────────────────────────────────────────┤
│  SUMMARY                                            │
│  → Long-form text paragraph                         │
├─────────────────────────────────────────────────────┤
│  EXPERIENCE                 (anchor: #experience)   │
│  → List of roles (logo · role · company · bullets)  │
├─────────────────────────────────────────────────────┤
│  PROJECTS                   (anchor: #projects)     │
│  → 3-column card grid                               │
├─────────────────────────────────────────────────────┤
│  EDUCATION                  (anchor: #education)    │
│  → List (logo · degree · institution · abroad)      │
├─────────────────────────────────────────────────────┤
│  CERTIFICATES                                       │
│  → Horizontal pill/badge row                        │
├─────────────────────────────────────────────────────┤
│  SKILLS                     (anchor: #skills)       │
│  → 2-column grid: Tooling / Core Competencies       │
├─────────────────────────────────────────────────────┤
│  DOWNLOAD CV (CTA section)                          │
│  → Centered button → generates PDF in-browser       │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
│  → "Built with Ethereum in mind"                    │
└─────────────────────────────────────────────────────┘
```

---

## Section 1 — Navbar

**Position:** Fixed top bar, full width, blurred background.

| Element | Detail |
|---------|--------|
| Logo/brand | `0xwmb` — monospace, accent color (indigo) |
| Nav links | Experience · Projects · Education · Skills |
| CTA | "Download CV" — outlined accent button |
| Mobile | Hamburger → dropdown with same links |

---

## Section 2 — Hero

**Layout:** Full-width, horizontal split on desktop — photo left, text right. Padding top to clear navbar.

| Field | Type | Example |
|-------|------|---------|
| `photo_url` | Image (circular, ~96px) | Professional headshot |
| `name` | H1, large bold | "William Martinez Bolaños" |
| `title` | Subtitle, accent color, monospace | "Product Manager, Researcher, ETH Community Leader" |
| `industries` | Small text, dimmed | "Crypto • Blockchain • Artificial Intelligence" |
| Social links | Icon row (PNG icons) | LinkedIn · GitHub · X · Farcaster · Telegram |
| Language badges | Inline pill list | 🇪🇸 Spanish C2 · 🇬🇧 English C1 · 🇫🇷 French B1 |

**Social icons available:** `/socials/linkdn.png` · `/socials/github.png` · `/socials/x.png` · `/socials/farcaster.png` · `/socials/telegram.png`

---

## Section 3 — Summary

**Layout:** Single full-width text block, max-width container, bordered top.

| Field | Type | Example |
|-------|------|---------|
| `summary` | Long paragraph | ~250 words, professional bio |

---

## Section 4 — Experience

**Layout:** Vertical list of entries, each with logo + text block. Bordered top.

**Per entry:**

| Field | Type | Example |
|-------|------|---------|
| `logo_url` | Image (40×40, bordered) | Company logo |
| `role` | Bold heading | "Token Analyst" |
| `company` | Linked text (→ website) | "Giveth" |
| `years` | Monospace badge, right-aligned | "Apr 2024 - Apr 2025" |
| `linkedin` | Icon link (LinkedIn PNG) | optional |
| `twitter` | Icon link (X PNG) | optional |
| `points` | Bulleted list (·) | 2–3 achievement bullets |
| `website` | Hyperlink on company name | "https://giveth.io" |
| `order` | Integer (sort order) | |

**Current entries (4):**
1. Teacher & Mentor — Universidad Buenaventura de Cali
2. Token Analyst — Giveth
3. IT Project Manager — Corporación Talentum
4. Brand Manager — Manuelita

---

## Section 5 — Projects

**Layout:** 3-column card grid on desktop, 1-column on mobile. Cards have hover state (border highlight).

**Per card:**

| Field | Type | Example |
|-------|------|---------|
| `logo_url` | Image (32×32) | Project logo |
| `name` | Bold heading | "ETH CALI" |
| `role` | Subtitle | "Founder" |
| `years` | Monospace, right | "2022–Present" |
| `brief` | Short description | "Building Web3 adoption through..." |
| `points` | 2 bullet points (·) | Achievements |
| `website` | Link → "site →" | "https://ethcali.org" |
| `socials` | Key-value: twitter/linkedin/github links | Shown as text links |
| `order` | Integer | |

**Current entries (3):** ETH CALI · Ekinoxis · Convexo

---

## Section 6 — Education

**Layout:** Vertical list, same pattern as Experience. Bordered top.

**Per entry:**

| Field | Type | Example |
|-------|------|---------|
| `logo_url` | Image (40×40) | University logo |
| `degree` | Bold | "B.A. Economics & International Business" |
| `institution` | Text | "Universidad ICESI" |
| `years` | Monospace | "2014–2021" |
| `abroad_program` | Italic/dim text (optional) | "Abroad: MSc Project Management, SKEMA Paris" |
| `website` | ↗ link | optional |
| `linkedin` | LinkedIn icon | optional |
| `twitter` | X icon | optional |
| `order` | Integer | |

**Current entries (2):** Both Universidad ICESI (dual degree + 2 abroad programs)

---

## Section 7 — Certificates

**Layout:** Horizontal wrapping row of pill/badge cards. Bordered top.

**Per badge:**

| Field | Type | Example |
|-------|------|---------|
| `logo_url` | Image (24×24) | Issuer logo |
| `name` | Small bold text | "Uniswap Hooks Incubator" |
| `issuer` | Dimmed text | "Atrium Academy" |
| `year` | Dimmed text | "Q3 2025" |
| `website` | ↗ link | optional |
| `linkedin` | LinkedIn icon | optional |
| `twitter` | X icon | optional |
| `order` | Integer | |

**Current entries (2):** Uniswap Hooks Incubator (Atrium Academy) · Bloomberg BMC (Bloomberg)

---

## Section 8 — Skills

**Layout:** 2-column grid. Left = "Tooling" (technical). Right = "Core Competencies" (soft).

**Per category:**

| Field | Type | Example |
|-------|------|---------|
| `category` | Small bold label | "Programming Languages" |
| `type` | `technical` or `soft` | determines which column |
| `items` | Array of strings → pill tags | ["JavaScript", "TypeScript", "Solidity"...] |
| `logos` | Optional map: skill name → image URL | `{"Solidity": "https://..."}` |
| `order` | Integer | |

**Technical categories (5):**
- Programming Languages: JavaScript · HTML · CSS · TypeScript · Solidity · Python · SQL
- Programming Tools: Remix · OpenZeppelin · Vercel · Figma · VS Code · Git
- Product Management: Notion · Airtable · Jira · Google Workspace · Miro
- CRM & Growth: HubSpot · Mailchimp · Canva · Analytics
- AI Build: Claude Code · Cursor · V0 · ChatGPT · Gemini

**Soft categories (3):**
- Business Development: Institutional negotiations · C-suite consulting · Deal execution · Strategic partnerships · Market expansion
- Custody & Treasury: DAO Governance · OTC Institutional Ramps · Compliance Frameworks · Treasury Management · Risk Management
- Blockchain & Web3: DeFi · Tokenization · Custody Integrations · RWA · Smart Contracts

---

## Section 9 — Download CV (CTA)

**Layout:** Centered section, bordered top.

| Element | Detail |
|---------|--------|
| Button | "Download CV (PDF)" — accent background |
| Behavior | Generates PDF in-browser using @react-pdf/renderer |
| PDF content | Name · Title · Contact · Education · Languages · Certificates · Volunteering · Summary · Experience · Projects · Skills |

---

## Section 10 — Footer

| Element | Detail |
|---------|--------|
| Text | "Built with Ethereum in mind" |
| Style | Centered, monospace, small, dimmed |

---

## Current Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#050810` | Page background (near black, slight blue tint) |
| `surface` | `#0d1117` | Cards, panels |
| `surface-2` | `#111827` | Input backgrounds, nested surfaces |
| `accent` | `#6366f1` | Indigo — primary CTA, links, highlights |
| `accent-dim` | `#4f46e5` | Hover state for accent |
| `border` | `#1f2937` | All borders |
| `text` | `#f9fafb` | Primary text |
| `text-dim` | `#9ca3af` | Secondary text, labels |
| `muted` | `#6b7280` | Tertiary text, timestamps |

**Fonts:**
- Body: `Inter` (Google Fonts, weights 300–700)
- Mono: `IBM Plex Mono` (labels, code, dates, IDs)

**Container:** max-width `5xl` (64rem / 1024px), centered, `px-6` padding

**Navbar height:** 64px (fixed, scroll offset applied via `scroll-margin-top`)

---

## Data Content Summary

| Section | Records | Key visual |
|---------|---------|------------|
| Profile | 1 | Photo, name, title |
| Experience | 4 | Company logos |
| Projects | 3 | Project logos, 3-col cards |
| Education | 2 | University logos |
| Certificates | 2 | Issuer logos |
| Volunteering | 4 | Org logos (Ethereum Foundation, ETHGlobal, etc.) |
| Skills | 8 categories | Tag pills |
| Languages | 3 | Flag emojis |
| Contact | 1 | 7 social links |

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| Mobile (`< md`) | Single column layout, hamburger nav |
| Desktop (`≥ md`) | Multi-column (Projects 3-col, Skills 2-col, Experience full-width) |

---

## Notes for Designer

- The brand identity is **`0xwmb`** — the `0x` prefix signals Ethereum/web3 culture
- Color palette should stay **dark-first** — this is a developer/crypto audience
- The accent color (indigo `#6366f1`) is intentional — Ethereum's color language
- Monospace font for all metadata (dates, labels, IDs) is an important design pattern
- Logos come from Supabase Storage — they're real company/project logos, not placeholders
- Social icons are local PNGs: LinkedIn, GitHub, X, Farcaster, Telegram
- The PDF CV is generated in-browser — no server-side PDF route
