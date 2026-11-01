> **Scope note (2026-10-31):** this document now governs the private admin (Life OS, `/admin`) only. The public site (`/`) uses "The Prospectus" system, documented in `/DESIGN.md` at the repo root.

# Design System Strategy: The Sovereign Terminal

## 1. Overview & Creative North Star
**Creative North Star: The Silent Architect**
This design system moves beyond the cliché "hacker" aesthetic of the 90s and enters the realm of high-end, sovereign digital environments. It is built for the user who commands their data through a refined, brutalist interface. We reject the "web-template" look in favor of a UI that feels like a custom-built OS kernel.

The experience is defined by **High-Contrast Precision**. By utilizing a strictly monochromatic dark base interrupted by surgical strikes of vibrant cyan (`#69daff`), we create a sense of focused urgency. Layouts should favor intentional asymmetry—using heavy left-aligned typography contrasted with wide-open "dead space" on the right—to mimic a terminal output that is being read in real-time.

---

## 2. Colors: The Digital Void
The palette is rooted in `surface` (#0d0e0f), a true-black variant that provides the infinite depth required for the "Cyan Glow" to pop.

*   **The "No-Line" Rule:** Standard 1px borders are strictly prohibited for sectioning. To define boundaries, use tonal shifts. A content block should be defined by moving from `surface` (#0d0e0f) to `surface-container-low` (#121315). The eye should perceive a change in depth, not a physical barrier.
*   **Surface Hierarchy & Nesting:** Use nesting to imply importance.
    *   *Base Level:* `surface`
    *   *Mid-Level (Navigation/Sidebar):* `surface-container` (#191a1b)
    *   *Focus-Level (Active Cards/Inputs):* `surface-container-high` (#1e2021)
*   **The "Glass & Gradient" Rule:** To achieve a premium "cyber" feel, use `surface-variant` with a `backdrop-filter: blur(12px)` at 60% opacity for floating overlays. 
*   **Signature Textures:** For primary CTAs, do not use a flat fill. Apply a subtle linear gradient from `primary` (#69daff) to `primary-container` (#00cffc) at a 135-degree angle to simulate a light-emitting diode (LED) glow.

---

## 3. Typography: Monospace Authority
Two families (source: Figma file `5zU4vrevqf1OjCPKNoKh5o`, frame 12-2 "Public homepage — logos", Oct 2026):

*   **Space Grotesk** (`font-sans` / `font-headline`) — display, headings, body copy, CTAs.
*   **JetBrains Mono** (`font-mono`) — every "machine" string: nav, status bar, section meta (`01 // LOG.EXPERIENCE`), dates, chips, domains (`giveth.io ↗`), labels.

**Type scale** (Tailwind tokens in `src/app/globals.css` `@theme`):

| Token | Size | Tracking | Use |
|---|---|---|---|
| `text-display-lg` | 7rem (112px) | -0.045em, lh 0.92 | Hero name |
| `text-display-md` | 5.5rem (88px) | -0.04em, lh 0.95 | Contact headline |
| `text-headline` | 3.5rem (56px) | -0.03em | Section titles |
| `text-title-xl` | 2.5rem (40px) | -0.03em | Contact email |
| `text-title-lg` | 2rem (32px) | -0.02em | Project names |
| `text-title-md` | 1.75rem (28px) | -0.01em | Experience roles |
| `text-lead` | 1.375rem (22px) | — lh 1.5 | Hero summary |
| `text-title-sm` | 1.0625rem (17px) | — | Credential / contact card titles |
| `text-cta` | 0.9375rem (15px) | 0.04em | Buttons |
| `text-mono-sm` | 0.8125rem (13px) | — | Nav, dates, chips |
| `text-mono-xs` | 0.75rem (12px) | — | Meta, labels, domains |
| `text-mono-2xs` | 0.625rem (10px) | — | Logo-wall domains |

*   **Display & Headline:** Treated as "data headers": heavy, tight tracking, left-aligned. The last word of a display line can switch to `primary-container` (cyan) for emphasis (`Bolaños`, `sovereign.`).
*   **Body & Labels:** Body copy in Space Grotesk 16px (`on-surface-variant`); all metadata in JetBrains Mono so columns of data align, reinforcing the "cypher" aesthetic.
*   **Section header pattern:** 6px glowing `primary-container` square + `text-headline` title on the left; `text-mono-xs` meta (`02 // PROC.FOUNDED — 3 RUNNING`) on the right.
*   **Typographic Hierarchy:** Leverage `primary` (#69daff) for "Command" text (labels and CTAs) and `on-surface-variant` (#ababac) for "Log" text (secondary metadata). This distinction allows the user to scan for actionable data instantly.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "organic" for this system. We use light and transparency to define Z-index.

*   **The Layering Principle:** Instead of shadows, use the `surface-container` tiers. A "floating" modal should be `surface-container-highest` (#252627) sitting atop a `surface-dim` (#0d0e0f) backdrop with a 40% black overlay.
*   **Ambient Shadows:** If a shadow is required for extreme contrast, use a "Glow Shadow." Use the `primary` color (#69daff) at 8% opacity with a 32px blur. This creates an atmospheric bloom rather than a traditional shadow.
*   **The "Ghost Border" Fallback:** For input fields or high-density data tables where separation is critical, use a "Ghost Border": `outline-variant` (#474849) at **15% opacity**. It should be barely visible—perceived more as a suggestion of a container than a hard line.
*   **Glassmorphism:** All floating HUD (Heads-Up Display) elements must use `surface-container-low` at 70% opacity with a heavy background blur to allow the "terminal" background text to bleed through.

---

## 5. Components: Precision Modules

### Buttons
*   **Primary:** Sharp 0px corners. Fill: `primary` (#69daff). Text: `on-primary` (#004a5d) in All Caps.
*   **Secondary:** 0px corners. Border: 1px Ghost Border (`primary` at 20%). Text: `primary`.
*   **States:** On hover, the Primary button should trigger a "flicker" animation (0.1s opacity shift) to mimic a digital screen glitch.

### Input Fields
*   **Style:** No background fill. Only a 1px bottom-border using `outline` (#757576). 
*   **Active State:** The bottom border transforms into `primary` (#69daff) with a 2px height. The cursor should be a solid block (`primary`) that blinks at a 500ms interval.

### Cards & Lists
*   **Separation:** Forbid the use of divider lines. Use `spacing-8` (1.75rem) or `spacing-10` (2.25rem) to create clear groupings.
*   **Data Grids:** Use `surface-container-low` for alternating row backgrounds (zebra striping) at very low contrast (5% difference) instead of lines.

### Signature Component: The "Data Pulse"
*   A small 4x4px square of `primary` that sits next to active headers, pulsing slowly (opacity 1.0 to 0.4) to indicate a live connection or "sovereign" status.

### Logos (`src/components/home/OpticalLogo.tsx`)
*   **Optical sizing, never raw `object-contain`.** Logos are trimmed of transparent padding and sized by visual *area* inside their box, with a mild density correction (solid plates slightly smaller, line marks slightly larger). Wide wordmarks and tall marks then read at the same weight.
*   Logos sit directly on the surface. Use background-removed artwork (Supabase Storage `portfolio-assets/v2/`); never a white or black plate unless the plate is part of the brand (Giveth, ESP).
*   Box sizes: logo wall 140×80, experience 120, projects 220, credentials 72.

### Signature Interaction: "Scan Target"
*   Linked logo tiles show four 14px `primary-container` corner brackets on hover/focus. They close in from `scale(1.06)` (260ms `ease-out-strong`), the surface steps up one tone (`surface-container`), the artwork scales to 1.04 and the domain label turns cyan. Hover effects are gated to `(hover: hover) and (pointer: fine)`; keyboard focus shows the same brackets.

### Motion
*   Tokens: `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)` for entries and feedback, `--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement. UI motion stays under 300ms.
*   **One authored moment per page:** the network wall "boots" tile by tile as it scrolls in (CSS scroll-driven `clip-path` reveal, no JS). Nothing else enters with an animation.
*   `prefers-reduced-motion`: keep opacity and color, drop all movement.

---

## 6. Do's and Don'ts

### Do
*   **DO** use 0px border-radius everywhere. Rounded corners break the "terminal" immersion.
*   **DO** leave large areas of `background` (#0d0e0f) empty. Whitespace (or "Blackspace") conveys premium sophistication.
*   **DO** use `tertiary` (#ac89ff) sparingly for "System Alerts" or "Encrypted" status icons to provide a break from the cyan.

### Don't
*   **DON'T** use 100% white (#ffffff) for long-form body text; use `on-surface-variant` (#ababac) to reduce eye strain and maintain the "dim terminal" vibe.
*   **DON'T** use standard "Material Design" shadows. They feel like consumer software; this is professional-grade hardware aesthetic.
*   **DON'T** use icons with rounded terminals. Only use sharp, geometric, or pixel-perfect icon sets.