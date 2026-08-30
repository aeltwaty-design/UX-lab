# Metric card patterns

Six treatments of the same figure, kept as a reference so any of them can be dropped
into a screen later. The standalone comparison page has been removed — this document
replaces it.

All six are built from the shared primitives below and the project tokens. Only **B**
is currently in use, in the Points overview card.

## Shared primitives

```css
.m   { background:#fff; border:1px solid var(--n-200); border-radius:var(--r-150);
       padding:14px; min-width:0; display:flex; flex-direction:column }
.m-l { font-size:11px; color:var(--n-700); font-weight:500;
       white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.m-v { font-size:22px; font-weight:700; line-height:1.15; letter-spacing:-.01em; margin-top:2px }
.m-d { display:flex; align-items:center; gap:4px; font-size:11px; font-weight:600;
       color:var(--n-700); margin-top:3px }
.m[data-tone="up"]   .m-d { color:var(--success-700) }
.m[data-tone="warn"] .m-d { color:var(--warning-700) }
```

The delta always pairs an arrow icon with the figure — direction is never carried by
colour alone. Values use `.num` (`font-variant-numeric: tabular-nums`) and Western
numerals in both languages.

---

## A — Minimal

Label, value, delta. No card chrome; hairline separators between items.

**Use when** several metrics sit together and none outranks the others — the eye reads
the row, not each box.
**Trade-off** nothing tells you whether a number is good or bad without reading the
delta. Cheapest vertically: four metrics in ~90px.

```css
.mA { border:none; background:none; padding:14px 16px; border-radius:0;
      border-inline-start:1px solid var(--n-200) }
.mA:first-child { border-inline-start:none }
/* below 560px the divider becomes horizontal */
@media (max-width:560px){ .mA{ border-inline-start:none; border-top:1px solid var(--n-200) } }
```

## B — Sparkline  ← currently in use

Label, value, delta, and a 30-day shape.

**Use when** the trend matters as much as today's number.
**Trade-off** answers "up or down, and how steadily" without a click; costs ~40px of
height. **The line is brand purple on every tile** — the status palette is reserved for
state, so direction comes from the arrow and label, never the line colour.

```css
.mt-s { width:100%; height:30px; margin-top:auto; padding-top:8px; display:block; overflow:visible }
```
Line: `stroke-width:1.75`, `vector-effect="non-scaling-stroke"`, area fill from a
`var(--p-500)` gradient at .22 → 0 opacity, endpoint dot `r=2.4` in `var(--p-600)`.

## C — Icon-led

Tinted icon tile above the label.

**Use when** metrics sit on a dense page and people are hunting for one specific figure.
**Trade-off** closest in shape to the old dashboard — but each colour must *mean*
something (points out, points in, waiting, returned). Only works if every metric has an
honest icon; a decorative one puts us back where we started.

```css
.m-ico { width:34px; height:34px; border-radius:var(--r-100);
         display:grid; place-items:center; margin-bottom:10px }
```

## D — Period comparison

Two bars: this period against the previous one.

**Use when** "compared to what?" is the real question.
**Trade-off** the most honest about change, and the only option where the delta is
verifiable on the card. Needs two bars of room, so it suits two or three metrics, not eight.

```css
.cmp   { margin-top:10px; display:flex; flex-direction:column; gap:5px }
.cmp-r { display:flex; align-items:center; gap:8px; font-size:10px; color:var(--n-700) }
.cmp-t { width:52px; flex:none }
.cmp-b { display:block; height:7px; border-radius:999px; flex:1;
         background:var(--n-100); overflow:hidden }
.cmp-f { display:block; height:100%; border-radius:999px }
```
Current period fills `var(--p-500)`, previous `var(--n-300)`, both scaled against the
larger of the two. **`display:block` on the track and fill is required** — they were
inline spans at first and `height` silently did nothing.

## E — Target progress

Value plus a bar toward a goal.

**Use when** the metric genuinely has a target. Do not invent one — a progress bar with a
fabricated goal is worse than no bar.
**Trade-off** turns a number into a judgement ("are we on track?"), which is right for
quota-style metrics and meaningless for the rest.

```css
.tgt-b { height:7px; border-radius:999px; background:var(--n-100); overflow:hidden }
.tgt-f { height:100%; border-radius:999px; background:var(--p-500) }
.tgt-x { display:flex; justify-content:space-between; font-size:10px;
         color:var(--n-700); margin-top:5px }
```
**The bar caps at 100%, the label must not.** Over target, the fill switches to the
warning colour and the label shows the true figure (e.g. 120% ▲). Capping both hides the
overage, which is the one thing the card exists to show.

## F — Paired

Two related figures in one card with a split ratio bar.

**Use when** two figures only mean something next to each other — issued against
redeemed, pending against refunded.
**Trade-off** halves the card count and makes the relationship the subject. Only works
for figures sharing a unit.

```css
.dual      { display:flex; gap:18px }
.dual > div{ flex:1; min-width:0 }
.dual-bar  { height:8px; border-radius:999px; display:flex; overflow:hidden;
             margin-top:12px; gap:2px }
@media (max-width:560px){ .dual{ flex-direction:column; gap:12px } }
```
The 2px `gap` is the surface spacer between adjacent fills — segments never touch.

---

## Choosing

| If the question is… | Use |
|---|---|
| "What are the numbers?" | A |
| "Which way is this going?" | B |
| "Where is the one I need?" | C |
| "Better or worse than before?" | D |
| "Are we on track?" | E |
| "How do these two relate?" | F |
