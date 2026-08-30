# Design Research — Dashboards & Internal Systems, 2026

Reference for the WalaOne Dashboard redesign. Every design decision in this project
should be traceable to something in this document or to the Figma design system.

---

## 1. What changed in 2026

The baseline expectation for an internal/admin dashboard moved. Five shifts matter for us:

### 1.1 Decision-first, not KPI-grid-first
The old default — a row of 4 stat cards, then charts — now underperforms on usability.
The current approach: decide the **one question the screen answers**, then rank every
metric, chart and control against that question.

> "Density is earned through hierarchy, not crammed in."

**For WalaOne:** the dashboard must answer one question for an HR/ops admin —
most likely *"Is anything wrong with my workforce today, and what needs me?"*
Everything else steps back.

### 1.2 Progressive disclosure is the dominant pattern
Surface the single metric that answers *"is everything okay?"* first. Details on demand,
via drill-in, expand, or a side panel — never all at once.

### 1.3 Bento grid layout
The premier 2026 layout for complex dashboards. Deliberate **asymmetry** — varying
column spans — establishes hierarchy instantly. This replaces the uniform 4×equal-card
grid that AI-generated dashboards default to (and which the current WalaOne build
almost certainly uses).

### 1.4 Colour carries meaning, not decoration
Near-monochrome UI where status colours (green / amber / red) hold **all** the semantic
weight. If a colour doesn't mean something, it shouldn't be there.

### 1.5 Role-aware surfaces
Dashboards adapt to who's looking. An owner, an HR manager and a line manager should
not get the same screen. Internal/investigative dashboards stay flexible; presentation
dashboards summarise.

---

## 2. Patterns worth stealing (competitor teardown)

Screens reviewed on Mobbin — HR / workforce platforms, web:

| Product | Pattern worth taking |
|---|---|
| **Deel** | Onboarding/offboarding tracker as a **stage funnel** (Draft → Pending invite → Invited → Onboarding → Ready to start → Active) rather than a flat count. Grey out zero-states so live numbers pop. |
| **Deputy** | Attendance framed as **exceptions** — "No shows / Late arrivals / Early departures" with count + % of all shifts + trend. Not "attendance rate: 94%". |
| **7shifts** | Named-person superlatives ("Most Reliable", "Most Often Late") turn a table into an insight. Note their honest empty states. |
| **Remote** | "Things to do" + "Quick actions" above the fold. The dashboard is a **launchpad**, not a report. |
| **Aboard** | Greeting + inline action chips ("Add employee", "Create post"). Low ceremony, high speed. |
| **Employment Hero** | Tabbed metric widget (Headcount / Turnover / Diversity / Salary / Time to Hire) — one card, five questions, no scroll cost. |
| **Workable** | Personal balances (leave days available) sit beside team data. Admins are employees too. |

**Consistent across all of them:** left/inline-start icon rail + label sidebar, a persistent
global search, a notification bell with count, and an avatar menu. Content area is a
white/near-white canvas with soft-radius cards and a very restrained palette.

---

## 3. Arabic / RTL — non-negotiables

These are the details that make bilingual dashboards feel native rather than translated.

### 3.1 Typography
- **Line height:** Arabic needs **1.6–1.8**, vs 1.4–1.5 for Latin. Do not share one value.
- **Base size:** Arabic glyphs read smaller at the same px. Minimum **16–18px** body.
- **Letter spacing:** `letter-spacing: 0` on every Arabic block. Tracking breaks Arabic
  letter joining — it is a real rendering bug, not a taste issue.
- **Font pairing:** the Arabic and Latin faces must share a skeleton. A geometric Latin
  sans paired with a calligraphic Arabic is visual dissonance. Pair by structure.

### 3.2 Numerals — KSA specific
Saudi Arabia uses **Western Arabic numerals (0–9)** in digital and business contexts,
**not** Eastern Arabic numerals (٠–٩). Use `0-9` in the Arabic UI. This is the single most
common mistake in "Arabised" dashboards.

### 3.3 Layout
- Navigation flows right-to-left; brand/logo sits **inline-start** (visually right in AR).
- Use logical CSS properties everywhere: `margin-inline-start`, `padding-inline-end`,
  `text-align: start`. Never `left` / `right`.
- In Tailwind: `ms-` / `me-` / `ps-` / `pe-` / `start-` / `end-`, plus `rtl:` variants for
  the handful of cases logical properties can't cover (icon rotation, chart direction).
- **Do not mirror:** logos, media playback controls, charts with a time axis (time still
  runs left→right), phone numbers, and Latin brand names.

### 3.4 Content length
Plan for Arabic running **20–30% longer** than English in some strings. Buttons, table
headers and stat-card labels must not break when the language flips. Every component gets
tested in both directions before it ships.

### 3.5 Dates
Saudi business context expects **Hijri alongside Gregorian**. Decide per-surface which
leads.

---

## 4. Applied checklist for WalaOne

Each screen we ship must pass all of these:

- [ ] Screen answers **one** clearly stated question; hierarchy proves it
- [ ] Bento grid with intentional col-spans — no uniform card row
- [ ] Colour used only for status/meaning; UI otherwise near-monochrome
- [ ] Every metric has: value, comparison/trend, and a way to drill in
- [ ] Loading, empty and error states designed — not afterthoughts
- [ ] Real actions available above the fold (launchpad, not report)
- [ ] Flips to RTL with zero layout breakage
- [ ] Arabic reads as native KSA business Arabic — friendly, professional, never
      machine-translated
- [ ] Western numerals in Arabic; correct line-height; zero letter-spacing
- [ ] Keyboard reachable; visible focus; AA contrast minimum

---

## Sources

- [10 Best SaaS Dashboard Design Examples & Trends (2026) — AdminLTE](https://adminlte.io/blog/saas-dashboard-design-examples/)
- [35 SaaS Dashboard Design Examples, Trends and Patterns (2026) — 925 Studios](https://www.925studios.co/blog/saas-dashboard-design-examples-2026)
- [50 Best Dashboard Design Examples for 2026 — Muzli](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/)
- [Enterprise UX Design Guide 2026 — Fuselab Creative](https://fuselabcreative.com/enterprise-ux-design-guide-2026-best-practices/)
- [Dashboard Design Guide (2026): UX Best Practices — Aufait UX](https://www.aufaitux.com/blog/dashboard-design-examples-inspiration-best-practices/)
- [SaaS Dashboard Design Best Practices: 2026 UX Frameworks — FlowmazeUX](https://flowmazeux.com/saas-dashboard-design-best-practices/)
- [Arabic RTL Typography for Web Design: 2026 Guide — Voxire](https://voxire.com/blog/arabic-rtl-typography-web-design-2026/)
- [Best Website Design Practices for RTL Arabic Layouts in 2026 — Cloudtopia](https://cloudtopia.net/articles/best-website-design-practices-for-rtl-arabic-layouts-in-2026)
- [RTL Design for Arabic Websites — Saudisoft](https://localization.saudisoft.com/rtl-design/)
- [Arabic Power BI Dashboards: RTL, Hijri & Bilingual Patterns — Beyond The Analytics](https://beyondtheanalytics.com/blog/arabic-power-bi-dashboards-rtl-localization)

**Screens referenced (Mobbin):**
[Deel](https://mobbin.com/screens/fb197e1a-8fc1-4c06-8ef3-8d143084834b) ·
[Deputy](https://mobbin.com/screens/a94b862d-1c9d-4cdf-b7a5-299fa1144bdd) ·
[7shifts](https://mobbin.com/screens/66c3e5cd-85f3-43d1-adbb-c01916ba6112) ·
[Remote](https://mobbin.com/screens/76c50f31-44a7-4435-bb51-9aa866a3026e) ·
[Aboard](https://mobbin.com/screens/d50c4515-c4a4-4d51-b229-abee29c71944) ·
[Employment Hero](https://mobbin.com/screens/1e85c626-f51f-4c9c-9f9f-ab34a237f6da) ·
[Workable](https://mobbin.com/screens/5f4ce948-2219-4ade-9edd-80a127dedd96) ·
[Oyster](https://mobbin.com/screens/6ea4e106-b2c0-4f29-baca-923e4c23fed6)
