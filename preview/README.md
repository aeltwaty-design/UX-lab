# Preview — Feature 01: Dashboard

`dashboard.html` is a single self-contained file. Open it in any browser; no build step,
no network calls except the Google Fonts stylesheet.

## Preview controls

The dark panel at the bottom is a **review harness, not part of the product**. It toggles:

- **Language & direction** — عربي/RTL and English/LTR. Switches `dir` on the root, so the
  whole layout mirrors, not just the copy.
- **Data state** — Normal, Loading, Empty, Error. Every data surface has all four.
- **Sidebar** — expanded / collapsed.

Click the panel's header to collapse it.

## How it is built

- **Tailwind CSS**, precompiled from this file's own markup (v3.4.14) and inlined. No play
  CDN, so there is no runtime dependency and no flash of unstyled content.
- **Design tokens** as CSS custom properties at the top of the file, mirroring Singular's
  two-tier architecture (primitives → semantic). Provenance is marked per token:
  `[figma]` verbatim from the library, `[brand]` derived from #755BD8, `[derived]` by us.
- **RTL** via CSS logical properties and Tailwind logical utilities (`ms-` `me-` `ps-`
  `pe-` `start-` `end-`) throughout. No `left`/`right` in layout code.
- **Copy** from `src/i18n/content.json`, injected as the `I18N` object. Arabic is KSA
  business Arabic with Western numerals.
- **Chart** is hand-built SVG — no charting library — so the mark spec is exact: 2px
  lines, hairline grid, direct labels with a surface halo, crosshair and tooltip on hover.
  The time axis deliberately does **not** mirror in RTL; time reads left-to-right in every
  locale. Only the surrounding layout flips.

## Colour verification

Chart series (violet `#755BD8` / aqua `#1BAF7A`) were validated, not eyeballed:
CVD ΔE 24.7, normal-vision ΔE 30.9, both clear of the floors. Series 2 sits below 3:1 on
white, so both series carry direct labels as the required relief. The funnel is an ordinal
one-hue ramp (brand 400/500/700), monotone with visible step gaps.

Status colours are icon + label pairs, never colour alone. Every status `700` step clears
4.5:1 both on white and on its own `50` tint — the tint is the stricter test, since status
text sits on it.
