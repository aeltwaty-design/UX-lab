# Figma Extraction — Pass 1

**File:** `Clients Dashboard (Handoff)` — `VzAsfqvwa4nVWsuJKP8xQx`
**Library in use:** **Singular (V1.0.0)** (team library, subscribed to the file)

---

## What the link resolved to

The supplied node `8203:55902` is a **single component** — an Arabic input field
(label `اسم الموظف`, placeholder `مثل, نواف سعود الجاسم`, helper `يجب أن يكون ثلاثياََ`).
Not the foundations page and not the dashboard screens.

It was still worth pulling: it exposed the token naming convention and the Arabic
type styles.

---

## Token architecture (confirmed)

Singular is a **two-tier system**, which is what we want:

```
Primitives  ->  Theme (semantic)  ->  component usage
Primary/500     bg/primary/pressed
                text/Primary
```

- **Primitives** collection — raw ramps: `Primary/50` … `Primary/900`
- **Theme** collection — semantic tokens scoped to usage
  (`SHAPE_FILL`, `TEXT_FILL`, `STROKE`, `FRAME_FILL`)

Our CSS variables should mirror this: a primitive layer, then a semantic layer that
references it. Components reference **only** semantic tokens.

## Tokens confirmed so far

Pulled from the live node — these are real values, not guesses.

| Token | Value |
|---|---|
| `text/Primary` | `#111317` |
| `text/Secondary` | `#40444C` |
| `bg/standard/default` | `#FFFFFF` |
| `border/input` | `#CCD2E0` |
| `Space/100` | `8px` |
| `Space/150` | `12px` |
| `Space/200` | `16px` |
| `radius/150` | `12px` |
| `Font Size/Text/XS` | `12px` |
| `Font Size/Text/S` | `14px` |
| `Font Size/Text/M` | `16px` |
| `Font Weight/400` | Regular |
| `Font Weight/500` | Medium |

**Spacing** is a 4px-based scale where the token number is `px x 12.5`
(`100`=8, `150`=12, `200`=16). **Radius** uses the same numbering (`150`=12px).

## Arabic typography (confirmed)

**Family: `FF Shamel Unique`** — a variable font, with axes `CTGR` and `wdth`
present in the design (`"CTGR" 0, "wdth" 100`).

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| `Arabic/Text/Regular/Medium` | 16 | 500 | 1.5 | 0 |
| `Arabic/Text/Small/Regular` | 14 | 400 | 1.5 | 0 |
| `Arabic/Text/Tiny/Regular` | 12 | 400 | 1.5 | 0 |

`letter-spacing: 0` is correct and matches best practice.

> **Open point — line height.** The system sets Arabic at **1.5**. General guidance
> for Arabic is **1.6–1.8**, because the script's ascenders, descenders and dot
> clusters need more vertical room than Latin. FF Shamel may well be drawn with
> metrics that make 1.5 comfortable, so this is a question for the design owner
> rather than a defect — but at 12px (`Text/XS`) with stacked Arabic diacritics it
> is worth checking. Raised with the client; Figma remains source of truth until
> they rule.

## Component inventory (found in Singular)

`🆗 Button` (set) · `⏺️ Icon button` (set) · `▣ Button group` (set) · `⛴️ Dock` (set) ·
`Table cell` (set) · `Docked input date picker [desktop]` · `Modal date picker` ·
`🎹 inputfield`

Buttons, button group and Dock were updated **2026-04-26**, so they are current.

## Primary colour override

Client direction: the brand primary is **`#755BD8`**, replacing Singular's green.
Full derived ramp with verified contrast lives in `tokens/primary.css`.

Method: OKLCH, hue held at −71.3°, perceptually even lightness ladder, 500 pinned
to `#755BD8` exactly, pale steps gamut-mapped rather than clipped.

| Step | Hex | | Step | Hex |
|---|---|---|---|---|
| 50 | `#F5F4FF` | | 500 | **`#755BD8`** |
| 100 | `#EAE8FF` | | 600 | `#6246BE` |
| 200 | `#D7D4FF` | | 700 | `#4E349D` |
| 300 | `#BFB7FF` | | 800 | `#3A2678` |
| 400 | `#9C89FF` | | 900 | `#271A54` |

Every interactive pairing passes WCAG AA. `400` is decorative only — it fails as
text on white (2.82:1).

---

## Blocked — what is still needed

`get_metadata` on the file lists only one page, `5:2 "Thumb"`, which is just the
handoff cover (title block + `HANDOFF` status stamp). The pages holding the actual
screens are not being enumerated by the API.

**Needed from the client — node-specific links** (select frame → right-click →
*Copy link to selection*):

1. The **Dashboard screen(s)** in the handoff file — the primary target.
2. The **foundations / colour page**, if one exists, to confirm the full semantic
   Theme set rather than the fragment recovered from one input field.
3. Ideally a **sidebar / navigation** frame, since that is the component the client
   flagged hardest.

Still missing from the token set: full grey ramp, semantic status colours
(success / warning / danger / info), elevation and shadow scale, the Latin type
family and scale, and the remaining spacing and radius steps.
