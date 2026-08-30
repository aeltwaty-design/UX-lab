# UX/UI Audit — Feature 02: Users

**Screen:** `comtechgold.test.walaone.com/users` — "Our Users", EN, ~1920px
**Sample:** 41 users, page size 10, 9 rows visible

---

## What the screen is

A paginated table of the partner's users. Columns: `#`, `NAME`, `PHONE`, `GENDER`,
`REGISTRATION`, `JOIN DATE`. Toolbar above it: page-size select, an unlabelled funnel
button, a search field, a registration-date picker, and an unlabelled purple export button.

**The pattern in the data matters more than any single defect.** Every row marked
*Un Registered* has **no name and no gender** — the NAME cell falls back to showing the
phone number. Registered rows carry a name and a gender. So "unregistered" here is not a
status on a profile; it means **the record is a bare phone number with no profile behind
it**. Any redesign has to be built around that, because roughly half the sample is in
that state.

---

## A. Data and content

### A1. The phone number is printed twice on every row
NAME shows the name with the phone beneath it, and PHONE shows the same number again.
Two columns, one value. On unregistered rows it is worse: NAME shows the phone, and
PHONE shows the same phone — the row carries the same string twice with nothing else.

### A2. `#` is a raw database ID in the most valuable column
`1882423548` — ten digits, first column, prime real estate. It is labelled `#`, which
implies a row number, but it is not sequential (…542 jumps to …537), so it is a
system key. A partner admin has no use for it at this width, and it pushes the actual
identity — the person — into second place.

### A3. "Un Registered" is misspelled
Two words with a capital R. Should be one word.

### A4. Gender is blank with no explanation
Empty cells on every unregistered row. The reader cannot tell "not collected", "not
supplied", or "we failed to load it".

### A5. The date format is ambiguous
`12/09/2025` — no way to know whether that is 12 September or 9 December. The sample
runs 12/09, 11/09, 10/09, which is consistent with either reading.

### A6. Why is gender on this screen at all?
It is the only demographic shown, it is absent for half the rows, and nothing on the
screen acts on it. Either it earns a place or it takes a column from something that does.

## B. Table behaviour

### B1. Rows do nothing
No row click, no detail view, no per-row action. The only interactive element is the
phone link. A table of people that cannot open a person is a list, not a tool.

### B2. No selection, so no bulk anything
No checkboxes. With ~half the base unregistered, "select all unregistered → send
reminder" is the obvious job on this screen and it is impossible.

### B3. Only one column sorts
`JOIN DATE` carries the sort control. Name, registration and phone do not.

### B4. Pagination is not visible
Page size is 10 against 41 users — four and a bit pages — with no pager in view.

### B5. No loading, empty or error state is evident
Same gap as the old dashboard.

## C. Toolbar

### C1. The funnel button is unlabelled and stateless
No text, no indication of what is filterable, and no way to see whether a filter is
active or to clear it.

### C2. Export is the loudest control on the page
It is the only filled purple button, so it outranks search and filtering. Export is a
secondary action. It is also icon-only and unlabelled.

### C3. Registration is the most useful filter and has no control
The one dimension that visibly splits the table has no dedicated filter, while
registration **date** — far less useful — gets its own picker.

### C4. The toolbar is spread across the full width with dead space
Five controls strung edge to edge, unrelated ones adjacent, with large gaps between.

### C5. Search scope is stated but not scoped
"Search By user Name, Email, Phone" — but there is no email column, so the reader
cannot tell whether email exists and is hidden, or the placeholder is inherited.

## D. Hierarchy and navigation

### D1. Three navigation labels, one wrong
The top bar still reads **`Dashboard`** on the Users page. Below it "Our Users", and
below that a second breadcrumb "home - Users". Three competing labels; the top one is
simply incorrect.

### D2. "Our Users" is odd
Possessive and vague. These are the partner's users; "Users" carries it.

### D3. The count is stranded
"41 Users" sits far from the table and from the filters. It is unclear whether it means
total users or the current filtered result.

## E. Visual

### E1. Red for "Un Registered" misuses status colour
Red reads as error or danger. An unregistered user is not an error — it is a funnel
stage, and per the dashboard work it is a **prospect**, the population you want to
convert. Marking your own opportunity in red is the same semantic inversion the
dashboard audit flagged.

### E2. Pills are heavy
Solid, fully-rounded, saturated fills for what is a binary state. In a dense table this
is a lot of ink for one bit of information.

### E3. Phone rendered as a purple link
Reads as a hyperlink with no indication of what it does — call, copy, or open a profile.

### E4. Row height is generous for the content
~60px rows carrying short single-line values, which limits how many people fit on screen.

### E5. Sidebar and top bar carry every defect already fixed for the dashboard
Broken tenant image, duplicate icons, mismatched metaphors, `DASHBOARD` group with one
child, inert nav. All resolved in Feature 01 and simply inherited here.

## F. RTL and accessibility

- **F1.** Built LTR-first, same as the dashboard.
- **F2.** Table semantics need checking: header cells, scope, and an accessible sort
  state that announces direction.
- **F3.** Status is colour **plus** text, which is correct — the pills keep their labels.
- **F4.** The two icon-only buttons have no visible or accessible name.
- **F5.** Phone numbers set LTR inside an RTL layout need explicit direction handling or
  they render with the digits reordered.

---

## Resolved — answers from the client

### R1. The job: **work the unregistered backlog**
This screen exists for conversion — find the people who are phone numbers with no
profile and get them registered. That matches what the data shows: roughly half the base
is in that state. Everything else the screen does is secondary to it.

Consequence: the registered/unregistered split is the spine, not a status pill. Selection
and a bulk reminder are first-class, not an afterthought.

### R2. Actions on a user
Three, all confirmed:
- **Send reminder / invite to register** — the conversion action for phone-only records
- **Transfer points** to a specific user
- **Open a full profile** — balance, transaction history, offer redemptions

So rows are not inert. Each needs a primary action inline and a route into the profile.

### R3. Unregistered vs the dashboard's "invites not completed" — **unconfirmed**
Client is checking with the backend team. **Assumption taken:** they are the same
population. The dashboard's "Invites not completed" row will link into this screen
pre-filtered to unregistered, and the two counts must agree.

This is marked in the build so it is cheap to unpick. If they turn out to be different
sets, the dashboard link and the shared count both have to change, and the two states
need distinct labels so they stop colliding.

### R4. Columns: keep gender, keep the ID, add email
All three earn a place, but not all in the default view — eight columns would cram the
table. Resolution: a **column-visibility control**.

- **Default:** Person · Contact · Status · Points balance · Joined
- **Optional:** User ID (copyable) · Email · Gender · Last activity

The ten-digit ID leaves the first column but stays reachable and copyable, since support
and reconciliation need it. Gender keeps a real "not collected" treatment rather than an
empty cell.

### R5. The profile page is **in scope this round**
Designed alongside the table, not deferred.

### R6. Dates: **day-first with a written month**
`12 Sep 2025` / `12 سبتمبر 2025`. Unambiguous in both languages and survives being read
aloud. Replaces `12/09/2025`, which could not be parsed reliably.

### R7. Bulk reminders: **not built — design the target behaviour**
Designed as it ought to work, and the rules below are a **spec for the backend**, not a
description of what exists:
- Select many, including select-all-matching-filter
- A confirmation step stating the recipient count — this is outward-facing and cannot be
  undone
- A per-user **cooldown** so the same person is not repeatedly contacted, with anyone
  inside it shown as ineligible and excluded from the count
- A **per-send cap**, surfaced in the UI rather than failing silently at submit

### R8. Filters — all four
Registration status · Join date range · Points balance · Activity recency.
These replace the unlabelled funnel and absorb the separate Registration Date picker.

---

## Still assumed, not confirmed

1. **Export** — assumed CSV and XLSX, honouring the active filters, with the row count
   stated before download. Export drops to a secondary control; it is not the loudest
   thing on the page.
2. **Scale** — 41 users against 18,432 followers on the dashboard is almost certainly test
   data. Mock data will use a realistic partner-sized base so pagination, selection and
   the bulk cap are exercised properly.
3. **Search scope** — assumed name, phone and email, matching the old placeholder.

---

# Addendum — User detail page

**Screen:** `/users/2423548` — "User details" for `agsh`, a **registered** user.
Three tabs supplied: Information, Transactions, Parked.

## Structure

Three stacked cards. Card 1: the name, "Registered Since Friday 12th of September 2025
02:35:11 AM", and three stat tiles — `↑ 0.00 Total points transferred`,
`↓ 0.00 Total points refund`, `🔒 610.00 Parked`. Card 2: the tab row alone. Card 3: the
tab's content.

**A new concept appears here that exists nowhere else in the product I have seen:
"Parked" points**, marked with a padlock. 610.00 held, and the Parked tab lists two rows
(600 + 10) that sum to it exactly.

## Findings

### G1. "Parked" is never explained
A padlock, a number, and a tab. Nothing says what parked means, why points are held, what
releases them, or whether the user can see it. It is the largest figure on the page and
the least understood.

### G2. The points-to-riyal relationship contradicts what the dashboard was told
The Parked rows read `600 Points / 1 SAR` and `10 Points / 0 SAR`. The dashboard's
conversion rate is **5 points = 1 SAR**. These cannot both be describing the same
relationship. Either `AMOUNT` means something other than the points' value — the basket
value that earned them, say — or one of the two is wrong. **This must be settled before
either screen ships**, because both display a points-to-SAR figure to the same person.

### G3. `0 SAR` is printed as a value
The second row shows `10 Points / 0 SAR`. Either the amount is genuinely zero and should
say so in words, or it is a rounding artefact of a sub-riyal value, which is worse — it
prints a wrong number confidently.

### G4. STATUS is a bare green arrow
No label, no tooltip. Colour and icon with no text, which is the one thing the rest of the
product gets right. It is also the only column whose meaning cannot be guessed.

### G5. The Parked table's NAME column says "Comtech Gold" on every row
That is the partner, not the user, on the user's own page. The column is constant, so it
carries no information and takes a fifth of the table.

### G6. The empty Transactions tab renders headers and nothing else
No message, no explanation, no suggestion. Identical in kind to the old dashboard's
unexplained zeros — the reader cannot tell "no transactions yet" from "failed to load".

### G7. "Registered Since Friday 12th of September 2025 02:35:11 AM"
Second-level precision on a join date, written out longhand, and inconsistent with the
list's `12/09/2025` for the same event.

### G8. "Total points refund" is ungrammatical
Should be "refunded", or "Total refunds".

### G9. Personal Info holds three fields
Full Name, Mobile Number, Gender. No email — although the list's search placeholder
claims to search it. No user ID. No email or ID means the detail page cannot answer the
support question the list was too narrow to answer either.

### G10. The page has no actions
Nothing can be done to this user from their own page — no transfer points, no reminder,
nothing. The three actions confirmed for this feature are all absent.

### G11. The ⓘ beside Mobile Number has no evident purpose
No visible tooltip target or explanation.

### G12. Tabs sit in their own card, separated from their content
The tab row is card 2 and the panel it controls is card 3. A tab and its panel are one
component; splitting them across two surfaces breaks that relationship.

### G13. Three uniform stat tiles
Same flat, equal-weight pattern the dashboard audit rejected — and one of the three
(Parked) is the important one.

## Not yet seen

**The unregistered user's detail page.** All three screenshots are the same registered
user on different tabs. Since an unregistered record is a bare phone number with no name
and no gender, its detail page is the more interesting of the two: most of Personal Info
is empty, and it is where the reminder action belongs.

## Resolved — detail page

### R9. Parked: **keep it as it is, do not invent a meaning**
Client does not have a definition to give. So the design keeps the concept, labels it
plainly, and **does not fabricate an explanation**. It gets a "what is this?" affordance
with the copy left as an explicit slot for the client to fill once the rule is known.

That is the honest treatment. Inventing a plausible-sounding definition would be worse
than the current padlock, because a wrong explanation is believed.

Parked does get the visual weight it deserves — it is the largest figure on the page and
was previously one of three equal tiles.

### R10. `AMOUNT` is the **purchase value that earned the points**
So there is no contradiction with 5 points = 1 SAR — the two columns describe different
things. But "Amount" sitting beside "Points" reads as the points' worth, which is exactly
how it was misread here. **The column is renamed** to say what it is.

`0 SAR` still needs handling: either a genuinely zero-value transaction, which should say
so in words, or a sub-riyal value rounded to zero, which is a wrong number printed
confidently. Treated as the former, flagged as the latter if the data says otherwise.

### R11. Unregistered detail page: **designed from the data model**
An unregistered record is a phone number with no name, no gender and no verified contact.
Its page is built around what IS known — phone, join date, any parked points — with the
missing fields shown as "not collected yet" rather than left blank, and **Send reminder
as the primary action**.

### R12. The STATUS arrow is **direction — points in or out**
Replaced with an icon **and a word**. A bare coloured arrow is the one place this product
lets colour carry meaning alone, which the rest of the audit spent its time removing.
