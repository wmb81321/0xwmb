# WM brand

William Martinez Bolaños's personal mark: a **WM ligature** in a high-contrast serif, where the W's last stroke is the M's first.

## Files

| File | What it is | Use it for |
| --- | --- | --- |
| `wm-ligature.svg` | The ligature alone, paper on transparent | Favicon, app icons, avatars, small placements |
| `wm-seal.svg` | Ligature in a hairline square frame, paper on navy | Large placements on dark grounds: slides, covers, social banners |
| `wm-seal-ink.svg` | The seal in navy ink on transparent | Large placements on light grounds: CV header, letterheads, print |
| `wm-seal-ink.png` | Same, 480 px raster | Tools that cannot take SVG (react-pdf, email signatures) |
| `icons/wm-*.png` | The ligature on a navy square at 16, 32, 48, 180, 192 and 512 px | Ready-made app and profile icons |
| `explorations/` | The four Recraft V4.1 directions as generated, plus a comparison sheet | Reference only. Direction 1 became the ligature, direction 2 the seal |

## Colour and type

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#f7f7f5` | The mark on dark grounds |
| Navy | `#0b1730` | Ground behind the mark; the mark on light grounds |
| Institutional blue | `#123a8c` | Links and the email action on the site, never the mark |

Companion typefaces: **Source Serif 4** (display) and **Public Sans** (text), as on [the site](../DESIGN.md).

## Rules

- **Seal never below 32 px.** Its hairline frame disappears; use the ligature instead.
- **Ligature at icon sizes** fills 90% of the tile at 16 to 48 px and 74% above.
- **Two colours only:** paper on navy, or navy on paper or white. No gradients, shadows, outlines or recolouring.
- **Clear space** around the seal of at least a quarter of its width.
- **Do not redraw or retype it.** The ligature is drawn artwork, not a font setting.

## Where it lives

- **Source of truth:** this folder (versioned in git).
- **Delivery:** Supabase Storage `portfolio-assets/v2/brand/`. The CV loads `wm-seal-ink.png` from there.
- **Site icons:** `src/app/favicon.ico`, `src/app/icon.png` and `src/app/apple-icon.png` are built from `icons/`.
- **Usage in the site design:** the "Brand mark (WM)" section of [`DESIGN.md`](../DESIGN.md).
