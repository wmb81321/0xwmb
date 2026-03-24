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
We utilize **Space Grotesk** for all levels to maintain a rigid, machine-readable identity that remains legible at high editorial scales.

*   **Display & Headline:** These should be treated as "data headers." Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) to create a sense of massive, looming data.
*   **Body & Labels:** Use `body-md` (0.875rem) for all standard text. The monospace nature of the font ensures that columns of data align perfectly, reinforcing the "cypher" aesthetic.
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