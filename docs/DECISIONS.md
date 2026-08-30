# WalaOne Dashboard — Project Decisions

Agreed working rules. Anything not written here is still open.

## Deliverable

1. **Phase 1 — Static HTML + Tailwind CSS.** Each screen ships as a standalone,
   openable page. You review the visuals here.
2. **Phase 2 — React.** Once a feature's visuals are approved, it is ported to React
   components with no visual change.

Features are done one at a time. We do not start the next feature until the current
one is approved.

## Bilingual (AR / EN)

- One codebase, one set of components, live language toggle.
- `dir="rtl"` / `dir="ltr"` switching on the document root.
- Tailwind logical utilities only: `ms-` `me-` `ps-` `pe-` `start-` `end-`.
  No `ml-` / `mr-` / `left-` / `right-` in layout code.
- Arabic is **KSA business Arabic** — friendly and professional. Not literal
  translation, not Modern Standard formality, not Egyptian/Levantine phrasing.
- Western numerals (0–9) in the Arabic UI.
- All Arabic copy is produced by a dedicated content pass, not written inline
  while building components.

## Data

- Realistic Saudi mock data (names, Iqama/ID formats, SAR amounts, Hijri + Gregorian
  dates) held in dedicated data modules.
- Routed through a service/fetch layer so real endpoints drop in without touching UI.
- **Loading, empty and error states are built for every data surface.** A screen is
  not complete with only its happy path.

## Review loop

Per feature: build → live shareable preview link + code pushed to
`claude/walaone-dashboard-redesign-nwindp` → your notes → revisions → approval → next feature.

## Design source of truth

1. The Figma file (tokens, components, spacing, type scale) — overrides everything.
2. `docs/research/2026-dashboard-trends.md` — for patterns Figma doesn't specify.
3. The old screens — for *scope and functionality only*, never for visual direction.

## Quality bar

The checklist at the end of `docs/research/2026-dashboard-trends.md` applies to every
screen before it is called done.
