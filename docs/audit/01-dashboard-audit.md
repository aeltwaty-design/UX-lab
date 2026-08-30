# UX/UI Audit — Feature 01: Dashboard (Partner)

**Screen audited:** `comtechgold.test.walaone.com` — Partners Dashboard, EN, ~1920px viewport
**Tenant:** Comtech Gold · **Role shown:** `admin_test` / Partner · **Date of capture:** 30 Aug 2026

**Domain (corrected):** This is a **loyalty-points partner console**, not an HR system.
The partner manages point balances, transfers, refunds, offers, users and followers.
WalaOne is the platform; Comtech Gold is a white-labelled tenant on it.

---

## Verdict

The screen is not a dashboard. It is a **summary strip** — eight numbers with no
comparison, no trend, no drill-in and no action — sitting above roughly 500px of empty
white. It answers no question. A partner admin who opens it learns eight facts and
still has to go somewhere else to do literally anything.

Two findings below are not styling issues, they are **data-integrity failures visible on
the surface**. Those get fixed first, because no amount of visual polish survives a
dashboard that shows a negative million in the same typeface as a zero.

---

## A. Critical — data integrity & truth

### A1. A negative balance is rendered as neutral body text
`Total points available: −1,096,860`, set in the same weight, size and colour as every
`0` on the screen, with a calm lavender icon tile. A negative point balance is either a
serious account state (partner is overdrawn) or a data bug. Either way it is the single
most important thing on this screen, and the design gives it **less** emphasis than the
decorative border bars. No colour, no icon, no explanation, no recovery action.

### A2. The numbers contradict each other and are presented with equal confidence
`Total Users: 0` cannot coexist with `Total offers: 4094` and a −1,096,860 point balance.
Zero users cannot generate a million-point deficit. The dashboard states all three
flatly. It never reconciles them, never flags the contradiction, and gives the user no
way to tell which number to trust.

### A3. Zero is overloaded — it means four different things
Seven of eight cards read `0`. From the UI it is impossible to distinguish:
genuinely zero this period · no data loaded · the filter excludes everything · the
endpoint failed. All four render identically. This is the single most common cause of
mistrust in an internal tool.

### A4. The default date range includes four months of the future
Default is `January 1, 2026 – December 31, 2026`. Today is 30 Aug 2026, so ~34% of the
window has not happened. Metrics are being averaged and totalled over unrealised time.
This is very likely *why* so many cards read zero. Default should be a completed,
meaningful window (e.g. last 30 days) with the comparison period stated.

---

## B. High — the dashboard does no work

### B1. Eight equal cards = zero hierarchy
Every metric carries identical visual weight: same size, same card, same type scale.
Nothing tells the eye what matters. This is the exact uniform-grid pattern that 2026
practice has moved away from (see `docs/research/2026-dashboard-trends.md` §1.3).

### B2. Every number is a fact, not a metric
No trend, no delta, no comparison to a previous period, no sparkline, no target.
`4094 Total offers` — up or down? Good or bad? A number without a comparison cannot
support a decision.

### B3. Nothing is clickable
`Total Users: 0` should lead to Users. `Total Points Transferred` should lead to
Transactions. Every card is a dead end with no drill-in affordance.

### B4. No time dimension at all
A points economy is fundamentally a flow — issued vs redeemed vs expired over time.
There is not a single chart. The core story of the product is absent.

### B5. No activity feed
The nav exposes Transactions, Transfer Points and History of charge points. None of that
recent activity surfaces on the dashboard. The user must navigate away to see what
happened.

### B6. No actions — the dashboard is a report, not a launchpad
Nothing can be *done* here. No "Transfer points", no "Charge points", no "Create offer",
no "Invite users". 2026 practice puts primary actions above the fold.

### B7. ~500px of dead vertical space
Content stops at roughly y=500 on a 1080px viewport. The page uses under a third of the
screen and then stops, with a centred `Created by Wala One` floating in the void.

### B8. Cards waste their own area
Each card is ~380px wide holding an icon and two short lines pinned to the inline-start
edge, leaving over half the card empty. That space should hold a sparkline, a delta, or
a drill-in affordance.

---

## C. Sidebar — the client flagged this, and it earns it

### C1. The brand slot is a broken image
The very first element in reading order is a broken-image placeholder glyph. On a
white-label product, the tenant's logo failing to load is the worst possible first
impression.

### C2. Duplicate icons for different concepts
**Users** and **Followers** use the *same* two-person icon. Two different data models,
one glyph. The user cannot distinguish them at a glance.

### C3. Icon metaphors are wrong or swapped
**Transfer Points** uses a *line-chart* icon — the analytics metaphor for a transfer
action. **Transactions** uses the exchange-arrows glyph that actually belongs to Transfer
Points. **Exports** uses a person-ish glyph unrelated to exporting.

### C4. Mixed icon styles and optical weights
Solid people icons sit next to a light stroked chart icon. Fill and stroke styles are
mixed, so the rail reads as visually noisy and unaligned.

### C5. "DASHBOARD" is a section header containing one item called "Dashboard"
A category and its only child share a name. The group label earns nothing and costs a
full row of vertical rhythm.

### C6. Group labels are as loud as the items
All-caps headers consume nearly the same visual weight as the navigable items beneath
them, flattening the hierarchy they exist to create.

### C7. Only the active item has a defined row treatment
The active pill is a white chip with shadow and a purple icon; every other item is bare
text. There is no consistent row structure, so the active state reads as one chip
floating in an empty column rather than one selected row among peers.

### C8. All nav labels are purple/blue
Every item is coloured like an unvisited hyperlink. Nav items are not links to be
"visited" — this reads as a list of anchors, and the contrast against white is weak.

### C9. ~200px gap before the bottom block
A large unexplained void between `Latest app releases` and the `My Profile / Logout`
group makes the menu look unfinished rather than deliberately anchored.

### C10. Questionable grouping
`Exports` is a reporting/data action, not a setting. `Latest app releases` is a
changelog and does not belong in primary navigation at all — that is a what's-new
popover or a help surface.

### C11. No collapse control
280px of permanent chrome on every single screen, with no way to reclaim it on smaller
viewports or for focused table work.

### C12. Nav is inert
No search. No counts or badges — nothing tells the user that transactions are pending or
that something needs attention. The rail transmits no state.

---

## D. Top bar

### D1. A one-item breadcrumb is not a breadcrumb
`Dashboard` sits alone as a crumb with no hierarchy above it — and then the H1 eighty
pixels below says `Dashboard` again. The same word, twice, stacked.

### D2. No global search
A system with users, followers, transactions and 4,094 offers has no way to find
anything from the header. This is a functional gap, not a styling one.

### D3. No notifications
No bell, no badge, no surface for "something needs you".

### D4. Ambiguous language switcher
`عربي | EN` — the active state is unclear (is the boxed one selected, or the action?),
and the two labels are inconsistent in kind: a native endonym next to an ISO-style
abbreviation. Should be `عربي / English` or `AR / EN`, and the selected state must be
unmistakable.

### D5. Identity block is weak
`admin_test` over `Partner` — a test-account name, and a role label ambiguous between
"your role" and "your organisation type". No chevron or affordance signalling the avatar
opens a menu.

### D6. The header is tall and empty
~65px of height holding one crumb at the inline-start edge and a control cluster at the
inline-end, with a vast void between.

### D7. Split identity, misaligned corner
Tenant brand lives in the sidebar; user identity lives in the top bar; the two blocks sit
at different heights, creating a visible misaligned L at the top inline-start corner.

---

## E. Visual system

### E1. Colour is pure decoration — the project's clearest principle violation
Eight cards carry eight different accent colours (purple, teal, red, orange, blue, teal,
grey, magenta) on their inline-start border and icon tile. None of it means anything.
Worse, the semantics are actively **inverted**: a calm purple sits on the alarming
−1,096,860, while an alarm-red sits on `Total Points Refunded: 0` — red on a value where
zero is the *good* outcome.

### E2. Flat typographic hierarchy
Value ~24px semibold, label ~12px, and nothing else. No unit, no context line, no
tertiary layer. Labels sit in a low-contrast blue-grey that likely fails AA on white.

### E3. Uniform elevation
Every surface sits on the same shadow plane. No depth logic distinguishes primary
content from secondary.

### E4. Weak page anchor
The `Dashboard` H1 is small relative to the space it occupies and competes with the
duplicate breadcrumb above it.

---

## F. RTL readiness — structural, not cosmetic

### F1. The layout is built LTR-first
Sidebar pinned left, breadcrumb left, **inline-start accent borders on all eight cards**,
icon-then-text ordering throughout. A language toggle exists, but toggling copy is not
localisation — the *structure* must mirror. Those eight left-border bars are the tell:
they will almost certainly stay on the left in Arabic, which is broken.

### F2. Only one Arabic word exists on the screen
`عربي` in the toggle. The Arabic experience cannot be assessed from this capture, which
in itself suggests the AR side has had far less attention than the EN side.

### F3. Number formatting is unspecified for Arabic
`-1,096,860` and `4094` — note the second has no thousands separator while the first
does. Inconsistent in English already; in Arabic, KSA convention requires Western
numerals (0–9) with consistent grouping.

---

## G. Accessibility

- **G1.** Card labels are low-contrast blue-grey on white — likely below 4.5:1.
- **G2.** Status is communicated by colour alone on the accent bars and icon tiles.
- **G3.** No visible focus treatment is evident anywhere in the UI.
- **G4.** The negative balance has no accessible severity signal — a screen reader
  announces it identically to any other figure.
- **G5.** Cards are not keyboard-reachable because they are not interactive at all (B3).

---

## Patterns to apply in the redesign

| Source | What to take |
|---|---|
| [Dub — Partner Program](https://mobbin.com/screens/5c4afe12-1c7b-4126-9ae6-2f414bd99fd7) | **Closest analogue.** Sidebar grouped Overview / Partners / Insights / Engagement / Configuration — solves C5, C6, C10. Metric cards carry inline **sparklines** (Clicks 123, Leads 23, Sales 2) — solves B2. |
| [Contra](https://mobbin.com/screens/260c5866-e7d6-40d4-a835-0efe5b8c63fd) | The "soul" the client says is missing: named greeting, **Rewards & Milestones** progress, **Your action items** checklist, inline primary action. Dashboard as launchpad — solves B6. |
| [Square Loyalty](https://mobbin.com/screens/5a23a277-5dcc-4609-97c5-23033e8738a4) | Honest zero states with explanatory subtext, plus **Manage tiers / Manage rewards** buttons inside the card — solves A3 and B3. |
| [Epidemic Sound](https://mobbin.com/screens/cf697049-1ecf-4f61-861b-32bb330142d7) | Empty states that *explain themselves*: "No paying users yet! When your link generates paying users, you can keep track of your credits here." — the model for our seven zero cards. |
| [Wix Loyalty](https://mobbin.com/screens/580754b9-0573-49b4-a46b-c8eebb63e19d) | Config rows with status toggles and clear earn-rules language. |
| [Teachable](https://mobbin.com/screens/4d0b47d5-13f4-4183-a11a-00d1fe55b3f4) | Summary row directly above the table it summarises, with export in place. |

---

## Resolved — answers from the client

These are settled. Design against them.

### R1. The core question: **"What needs my attention right now?"**
The dashboard is an **operational triage screen**, not an analytics report. It leads with
exceptions and pending items — low balance, pending transfers, failed transactions,
expiring offers — and only then shows supporting metrics. This is the decision that fixes
B1, B6 and the client's "no soul" complaint at the same time: the screen stops being a
list of facts and starts being a worklist.

Consequence: the eight-card uniform grid is not reworked, it is **replaced**. Exceptions
get top billing; steady-state numbers step back into a supporting tier.

### R2. A negative balance is a **bug**, not a state
Balance must never go below zero. So −1,096,860 is not a figure to present — it is
**untrustworthy data**, and the design must say so rather than rendering it as fact.

Design implication: an **anomaly / data-integrity state** for any impossible value —
visually distinct from both a healthy value and a normal error, stating plainly that the
figure can't be right, suppressing the bogus number from driving any other calculation on
the screen, and offering a report-issue route. No overdraft treatment, no top-up path.

This also raises A2 in priority: if impossible values are reachable, contradictory
metrics (0 users + 4,094 offers) need the same integrity check, not just this one card.

### R3. Theming: **fixed WalaOne palette for all tenants**
Tenants supply a logo only; the palette does not change per tenant. Token layer stays
simple — semantic tokens map to fixed brand values, no per-tenant brand tier.

The brand slot still needs a real fallback though (see C1): tenant initials or a
monogram, never a broken-image glyph.

### R4. Users vs Followers are **two distinct models**
- **Users** — hold accounts and point balances, and transact.
- **Followers** — subscribed to the partner's brand for offers; an audience, not
  necessarily registered.

Design implications:
- Two genuinely different icons — the shared glyph (C2) is a real defect, not a nitpick.
- They are **sibling surfaces**, not a filter of one another.
- This also explains `Total Users` / `Users Registered` / `Users Unregistered` on the old
  screen: that is a **conversion funnel** (audience → registered → active), currently
  rendered as three disconnected equal cards. It should read as one funnel — the
  [Deel](https://mobbin.com/screens/fb197e1a-8fc1-4c06-8ef3-8d143084834b) stage pattern
  applies directly.

---

## Still open

1. **Roles.** Is `Partner` one of several roles (platform admin, partner admin, staff)?
   Role-aware surfacing is a 2026 baseline and would change what each user sees.
2. **Total offers (4,094)** — created by this partner, or available across the network?
   Catalogue size or activity count? Determines whether it is a headline metric or
   supporting context.
3. **Which exceptions exist in the API?** R1 makes the triage list the spine of the
   screen, so we need the real set of attention-worthy events (pending transfers, failed
   transactions, expiring offers, low balance thresholds, unregistered-user backlog).
   Until confirmed, I will design against a reasonable set and mark it clearly as an
   assumption.
