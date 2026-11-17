---
name: 0xwmb, The Prospectus
description: Public portfolio of William Martinez Bolaños, set as an institutional offering memorandum.
colors:
  paper: "#f7f7f5"
  ink: "#0d1117"
  ink-muted: "#4a5260"
  rule: "#c9ccd2"
  inst: "#123a8c"
  inst-strong: "#0c2a6b"
  navy: "#0b1730"
  navy-raised: "#13234a"
  navy-ink: "#eef2f8"
  navy-muted: "#a7b4c9"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(3rem, 6.4vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.3
  lead:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
  small:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
rounded:
  none: "0px"
spacing:
  gutter-sm: "20px"
  gutter-md: "40px"
  gutter-lg: "80px"
  row: "32px"
  section: "64px"
  section-lg: "80px"
components:
  button-primary:
    backgroundColor: "{colors.inst}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.inst-strong}"
    textColor: "{colors.paper}"
  doc-link:
    textColor: "{colors.inst}"
  doc-link-hover:
    textColor: "{colors.inst-strong}"
  doc-link-on-navy:
    textColor: "{colors.navy-ink}"
  org-mark:
    size: "48px"
  tool-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    height: "88px"
  closing-band:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.navy-ink}"
---

# Design System: The Prospectus

Scope: the public site (`/`). The private admin (Life OS, `/admin`) still runs on the Sovereign Terminal system in `design/DESIGN.md`; both live side by side in `src/app/globals.css`, and the public tokens only apply inside the `.prospectus` wrapper.

## Overview

**Creative North Star: "The Prospectus"**

The candidate is presented like an institutional offering memorandum or annual report: a summary of terms up top, tabular proof below, and every claim traceable to a source. The page reads as a printed document on cool paper. Ink is near black, structure comes only from hairline rules, and colour is rationed: one institutional blue for the email action and links, and deep navy for the closing contact band.

Density is calm and documentary. Sections open with a full width ink rule and put their heading in the left margin, the way a filing sets its section titles. Nothing floats, glows or lifts. The world explicitly rejects the dark neon terminal portfolio and the cream editorial serif page.

**Key Characteristics:**
- Cool paper ground, near black ink, one blue, one navy band.
- Serif display for names and section heads; Public Sans for everything else, tabular figures in data.
- Hairline rules are the only structure. No cards, no shadows, no glow, no mono typeface.
- Square corners throughout.
- One motion idea: the rules typeset in once on load.

## Colors

A near monochrome document palette with a single institutional accent and a navy reserve for bands.

### Primary
- **Institutional Blue** (inst): the email action (filled button), document links, and the hero title line. 9.7:1 on paper.
- **Institutional Blue, pressed** (inst-strong): hover state for the blue button and blue links. 12.6:1 on paper.

### Secondary
- **Deep Navy** (navy): ground of the closing contact band. Never used for text or small fills on paper.
- **Raised Navy** (navy-raised): hairlines inside the closing band. 1.16:1 against navy, so it reads as tone, never as a border that carries meaning.
- **Navy Ink** (navy-ink): primary text and links on navy. 15.9:1.
- **Navy Muted** (navy-muted): secondary text on navy (lead line, socials, footer). 8.5:1 on navy, 7.3:1 on raised navy.

### Neutral
- **Cool Paper** (paper): page ground and the text colour on the blue button.
- **Ink** (ink): headings, body emphasis, and the full width rule that opens each section. 17.6:1 on paper.
- **Muted Ink** (ink-muted): summaries, bullets, dates, labels, source notes. 7.3:1 on paper, safe at the 12px small size.
- **Hairline** (rule): row dividers, column tops, portrait placeholder fill. 1.5:1 on paper; decorative only, never the sole carrier of information.

### Named Rules
**The One Blue Rule.** Institutional Blue marks only what can be acted on (email, links) plus the hero title line and a hovered profile handle. It never fills a surface larger than a button.

**The Navy Reserve Rule.** Navy appears only as the full bleed closing band. No navy cards, panels or logo plates on paper.

## Typography

**Display Font:** Source Serif 4 (with Georgia, serif), weights 400 and 600 loaded; 600 in use.
**Body Font:** Public Sans (with system-ui, sans-serif), weights 400, 500, 600.

**Character:** a filing set in a modern institutional serif over a civic, neutral sans. The serif carries names and section titles; the sans carries every fact.

### Hierarchy
- **Display** (600, clamp(3rem, 6.4vw, 5.5rem), 0.98, -0.025em): the name in the hero. The closing "Let’s talk." uses the same face at clamp(2.75rem, 5.6vw, 5.5rem), line height 1.
- **Headline** (600, 2rem, 1.25, -0.01em): section titles in the margin column; also the closing email address (2.5rem from small screens up).
- **Title** (600, 1.75rem, 1.3): role names and venture names.
- **Lead** (400, 1.375rem desktop, 1.25rem mobile, relaxed): hero summary and closing line, capped near 38rem.
- **Body** (400, 1rem, 1.6): bullets, briefs, skill lists. Bullets cap at 42rem.
- **Label** (500, 0.9375rem, 1.4): navigation, buttons, dates, column labels (600), company names.
- **Small** (400, 0.75rem, 1.4): source notes, domains, metadata lines, footer. Uses the `--text-mono-xs` size token, but the face is Public Sans.

The hero title line is Label scale on mobile (1.0625rem) and 1.5rem on desktop, in Institutional Blue, weight 500.

### Named Rules
**The Tabular Facts Rule.** Anything numeric or dated (periods, project meta, credential meta) sits in a `.figures` context with tabular lining numerals.

**The Middot Rule.** Inline data is joined with a spaced middle dot ( · ). Ranges read "Jun 2025 to Dec 2025". Copy never uses hyphens or em dashes as punctuation.

## Layout

One container for everything: max width 1280px (max-w-7xl), side gutters 20px on phones, 40px from 640px, 80px from 1024px. On desktop the container is a 12 column grid with a 40px gap.

- **Hero:** 8 columns of text (name on one line, sized to the column width at every breakpoint; the title split at its middot onto two lines; summary; actions) and a 4 column aside (square portrait above the profile links). Stacks to one column below 1024px.
- **DocSection (the margin heading pattern):** a full width 1px ink rule, then 20px down (24px desktop) a grid where the section title takes 3 columns and the content the remaining 9. Sections pad 32px vertically, 48px on desktop: the page is compact. Every section below the fold except the closing band uses it, in this order: Projects founded (current ventures lead), Experience, Credentials, Expertise, Tools.
- **Inside a DocSection:** record rows use a 9 column subgrid (2 for the date or category, 7 for content) separated by hairlines with 24px row padding; projects and credentials use 3 equal columns, each topped by a hairline.
- **Bands:** navy sections bleed full width; content still sits in the container.
- There is no header: the cover opens the page. Anchored sections offset 24px.

**The Margin Heading Rule.** Section titles live in the left margin column, never centred above content.

## Elevation & Depth

Flat. There are no shadows anywhere in the public site. Depth is expressed by two means only: hairline rules on paper, and the tonal step from navy to raised navy inside bands.

**The Paper Rule.** Surfaces never lift. Hover states change colour or underline weight, not elevation. The one exception is a tool mark, which rises 3px inside its tile.

## Shapes

Square everything (0px radius, enforced globally). Rules are 1px. The portrait is a square crop (4:3 on phones); tool tiles are a borderless grid of 84px (88px from 640px) tall cells. No pills or circles are used on the public site.

## Components

### Brand mark (WM)
William's monogram is a WM ligature in a high-contrast serif: the W's last stroke is the M's first. Two forms, both in Storage `portfolio-assets/v2/brand/`:
- **Ligature** (`wm-ligature.svg`, paper on transparent): the favicon, app icon and Apple touch icon (`src/app/favicon.ico`, `icon.png`, `apple-icon.png`), set paper on a navy square and fitted to 90% of the tile at 16 to 48px, 74% above.
- **Seal** (`wm-seal.svg` paper on navy; `wm-seal-ink.svg` / `.png` navy on transparent): the ligature inside a hairline square frame. Used where it is shown large, such as the CV header (52pt, top right). Never below 32px: the frame does not survive.

### No header
The page has no header or sticky bar. The cover prints the name and the profile row (with Email), and Download CV closes the page, so a bar would only repeat them.

### Buttons
- **Shape:** square (0px).
- **One button, in the closing band.** Email lives once, as the blue tile in the cover's profile row; the page closes on Download CV.
- **Primary (Download CV):** paper fill, navy text, Label weight 500, 52px tall with 28px side padding, full width on phones. Hover fills Navy Ink.
- **Hover / Press:** fill shifts to inst-strong; on press scales to 0.98 over 160ms with the strong ease out.
- **Focus:** 2px Institutional Blue outline, 3px offset (navy ink on bands).
- There is exactly one button on the page. Everything else is a document link or a profile tile.

### Document links
Underlined text, 1px underline at 0.2em offset that thickens to 2px on hover (160ms). Blue on paper (inst, hovering to inst-strong); Navy Ink on bands.

### Languages
A ruled three column table closing the cover text: hairline above and below, hairline dividers between columns, each cell the language (Label 600, Ink) over its level (Small, Muted Ink, "Native (C2)"). On phones it sits between the summary and the portrait; on desktop it is pinned to the bottom of the text column so its lower rule aligns with the lower rule of the profile row beside the portrait.

### Profile links
One hairline-ruled row under the portrait, six equal cells, logos only (no names or handles on screen): Email first, then LinkedIn, GitHub, X, Telegram, Farcaster. Each cell is a 48px target holding a 28px square tile; the accessible name carries the network and handle ("LinkedIn: williammartinez8"), with the handle as a native tooltip. The Email tile is drawn in Institutional Blue (`public/socials/email.svg`) and stays in colour, because it is the action; the profile tiles illuminate exactly like organisation marks (grey ink warming to their real colours as they scroll into view; colour and a 1.04 scale on hover or focus).

### Organisation marks
Every organisation appears where it is mentioned: the logo is printed on the paper beside the entry (40px on phones and 48px on desktop in Projects founded and Experience, 40px in Credentials), multiplied onto the paper so white backgrounds drop out. Logos drawn white or pale for dark grounds get an ink version in Storage (`v2/*-ink.png`). The mark is decorative (empty alt) because the name is printed next to it. **Illumination:** marks rest in grey ink and warm into their real colours as they rise into the reading zone (scroll-linked, from 40% entered to mid viewport, then they stay lit); hovering or focusing the entry also restores colour, with a 1.04 scale. Only `filter` is animated, because `opacity` belongs to the optical-logo load fade. There is no separate logo wall.

**Optical logo sizing.** Every logo renders through optical sizing: on load the image is sampled on a small canvas, transparent padding is trimmed, and the visible artwork is sized by area (not longest side) with a mild density correction (solid plates shrink, line marks grow, clamped between 0.86 and 1.1). Logos stay invisible until measured (240ms fade) when scripting is on.

### Record rows
Projects founded and Experience share one row (`RecordRow`) so they read symmetrically: period left (Label, Muted Ink, tabular, "2025 to Present" / "Jun 2025 to Dec 2025"); then the organisation mark beside the role (Title) and the organisation name as the document link (no visible URLs anywhere: the name carries the link); details below in Body Muted Ink (a venture's one line brief, or a role's bullets), full width on phones and aligned to the role on desktop. Ventures follow the admin order, current first. Credentials columns read newest first, with the institution or issuer as the link.

### Expertise and Tools
Skills are split in two sections. **Expertise** lists what William does (practice areas without logos) as ruled rows: category left (Label 600), items right as hairline chips (1px rule border, square, 12px by 6px padding, Label in Ink, 8px gaps, wrapping). Chips are not interactive, so they have no hover. Items are sentence case, keeping acronyms (DAO, OTC, RWA, DeFi). Never join items with middots. **Tools** lists what he works with as a grid: category left, tiles right in 4, 5 or 6 columns with no borders: only the mark and its name. Each tile shows the tool's own mark in full colour (32px box, 36px from 640px, optically sized for paper) above its name in Small Muted Ink, so the stack is recognisable at a glance. Marks come from each brand's official artwork, stored in `public/brand/tools/`; marks whose brand colour fails on paper are set in Ink. Hover lifts the mark 3px with a 1.06 scale and darkens the name. A skill row is a Tools row when any of its items has a logo.

### Closing band
Navy band with generous top space (96px, 128px desktop): "The full record." in display serif, one Lead line in Navy Muted, then a raised navy hairline over the Download CV button. Profile links are not repeated here; they live once, under the portrait. The foot sits under another hairline in Small: copyright left, place and updated date right.

### Motion
The document settles in once; nothing loops. All motion is CSS and is removed under reduced motion.
- **Cover entrance:** name, title, summary and profile links fade up 14px in order (`.enter` with `--i`, 70ms stagger, 700ms, cubic-bezier(0.23, 1, 0.32, 1)).
- **Portrait plate:** the photo is revealed from the bottom edge with a slight settle from 1.06 scale (`.plate-in`, 1100ms).
- **Rules typeset in:** hairlines scale in from the left (`.rule-in` on load; `.rule-scroll` draws section rules as the section arrives).
- **Scroll settle:** rows and columns fade up 24px as they enter the viewport and then stay put (`.reveal`, scroll-driven, `entry 0%` to `entry 45%`). Browsers without scroll timelines show content static.
- **Logo illumination:** organisation marks warm from grey ink to full colour as they scroll into view (`.illuminate`, scroll-driven `view()`, `entry 40%` to `cover 50%`, filter only). Colour, not movement, so it also runs under reduced motion.
- **Tool cascade:** tool tiles rise 18px from 0.96 scale one after another as their row scrolls in (`.tile-in`, scroll-driven, each tile's range offset 4% by its position `--i`).
- **Anchors:** in-page navigation scrolls smoothly.
- **Feedback:** colour transitions (160 to 200ms), underline thickening, button press 0.98, organisation marks regain colour with a 1.04 scale, tool marks lift 3px with a 1.06 scale.

## Do's and Don'ts

### Do:
- **Do** open every content section with the DocSection pattern: ink rule, margin heading in 3 columns, content in 9.
- **Do** keep Institutional Blue for actions and links; a surface may hold one blue filled button.
- **Do** source every figure, and set numbers and dates in tabular figures.
- **Do** show an organisation's logo where the organisation is mentioned, printed on the paper; never in a separate wall or on a navy plate.
- **Do** route every logo through optical sizing.
- **Do** write copy that is executive and short; join data with middots and write ranges with "to".
- **Do** keep targets at least 44px tall and focus outlines visible (blue on paper, navy ink on navy).

### Don't:
- **Don't** use cards, shadows, glow, gradients or rounded corners; structure comes from hairlines.
- **Don't** use a monospace face or uppercase tracked labels; small text stays in Public Sans.
- **Don't** put a short label or category above a heading as an eyebrow; metadata goes beside or below what it describes.
- **Don't** introduce a second accent colour or use navy as a panel on paper.
- **Don't** add motion outside the Motion list: no parallax, no looping, no motion that blocks reading.
- **Don't** use hyphens or em dashes as punctuation in copy.
