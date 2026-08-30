# Preview

`app.html` is the whole prototype in one self-contained file. Open it in any browser; no
build step, no network calls except the Google Fonts stylesheet.

`dashboard.html` and `users.html` are earlier single-feature snapshots, kept for
reference. Everything since is in `app.html`.

## Routes

Hash routing, so links work from anywhere in the file:

| | |
|---|---|
| `#/overview` | dashboard |
| `#/users`, `#/user/:id` | Users list and profile |
| `#/followers`, `#/follower/:id` | Followers list and profile |
| `#/transfers`, `#/transfers/individual` | Transfer points, bulk and individual |
| `#/transactions` | Transactions — every point movement |
| `#/charges` | Charge history — the partner buying points |
| `#/exports` | Exports — every file the product generated |
| `#/login` | Sign in, then the SMS code — outside the shell |

The screens are linked to each other: the Overview's "waiting for your approval" and
"transactions failed" rows count the real transfer queue and open it filtered; a
registered user's profile can start a transfer with that person already chosen; the
sidebar badge and the queue banner read the same field; and a file on Transfer points
and the records it produced on Transactions each open the other, with the arriving
scope shown as a chip that can be taken off. The charges on `#/charges` total exactly
what Transfer points reports as "Points charged", so the two agree rather than one
asserting a number.

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
- **Copy** from `src/i18n/content.json` and `src/i18n/transfers.json`, injected as the
  `I18N` object. Arabic is KSA business Arabic with Western numerals. Every string is
  written by a dedicated content pass, never inline in the markup.
- **Tables fit themselves.** Rather than width breakpoints, the transfers table draws,
  measures itself against its scroller, and drops its least valuable column until it fits
  — then falls back to a card per row when even that will not do. It is therefore correct
  in both languages at any width, including ones nobody tested.
- **Side panels** for every action, never modal dialogs. They stack, trap focus, close on
  Escape one level at a time, and return focus to whatever opened them.
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

## Checks that run against this file

In `tools/` and the session scratchpad:

- **`keyreq.py --check`** — every `transfers.*` key the screen can ask for at runtime,
  including the ~35% assembled from a prefix plus a variable, diffed against the copy file
  in both languages. A plain grep finds only the literal ones and reports the rest as
  covered; that gap is how English headings once shipped on the Arabic Users page.
- **Arabic leak scan** — walks 17 states (both tabs, every panel, both menus, empty and
  error) looking for Latin text, placeholders, titles and aria-labels in the Arabic UI.
  Filenames, batch ids, phone numbers, CSV and B2B are allowed through.
- **Width sweep** — 8 widths × 2 languages, checking that nothing escapes the viewport and
  that the drawer is actually on screen. This is what caught the RTL specificity bug that
  kept the panel parked off-screen in Arabic.
- **Route regression** — 7 routes × 2 languages, asserting each renders its view with no
  raw keys, no unreplaced `{placeholders}`, no page-level horizontal scroll and no console
  errors.
