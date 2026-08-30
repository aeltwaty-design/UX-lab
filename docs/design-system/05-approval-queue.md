# Approval queues — the patterns this screen commits to

Transfer Points is the product's first screen whose job is a *decision* rather
than a *report*. The conventions below were settled here and should hold
wherever the product later asks someone to approve, reject or review a queue
of work.

Sources for the survey behind these are in
[`docs/research/2026-approval-queues.md`](../research/2026-approval-queues.md).

## 1. A queue is a filter, not a tab

Bulk and Individual are genuine tabs: two different kinds of record, with
different columns. "Waiting for review" is **not** a third tab — it is a
filter over the bulk list.

The reason is drift. A separate queue tab has to be kept in step with the
history it drains into, and the two inevitably disagree about what counts as
waiting. As a filter there is one collection, one count, one truth. The
sidebar badge, the banner above the table and the Overview's "waiting for your
approval" row all read the same field.

**Rule:** if an item leaves the queue by changing state rather than by being
deleted, the queue is a saved view over the list, never a separate list.

## 2. Rejected and failed are different things and must never look alike

| | Rejected | Failed |
|---|---|---|
| What it is | a person decided | the system broke |
| Colour | neutral grey | danger red |
| Shape | circle | triangle |
| Who acts next | the uploader, on the reason given | someone on our side |
| Retry offered | no — a new file is the fix | yes |

Collapsing both into error-red is the common default and it is wrong twice
over: it tells the uploader their judgement call was a system fault, and it
spends red — the one colour that should mean *something is broken* — on an
outcome that is entirely expected.

**Rule:** an expected human outcome never takes the danger colour.

## 3. Reject is not delete

The old screen drew reject as a red bin. Nothing is destroyed: the file, its
rows and the decision all survive, and the uploader needs every one of them.

Approve is a **filled primary**; reject is a **plain outline**. Not
green-and-red — that pairing carries its entire meaning in hue, which is the
one channel a colour-blind reviewer cannot read. Weight and fill survive where
hue does not.

**Rule:** red and trash iconography are reserved for irreversible destruction.
A reversible or record-preserving action takes a neutral outline.

## 4. Every count is a route to its rows

A file's breakdown reads `1,223 valid · 12 invalid · 5 duplicate`. Each of
those three is a control: it opens the file filtered to exactly the rows it
counts. The segments of the bar above it do the same.

The old viewer printed the counts on one screen and the rows on another with
nothing joining them, and silently dropped lines it could not parse — so the
count was a claim with the evidence removed.

**Rule:** a number describing a subset must be a link to that subset. If it
cannot be, it should not be shown.

## 5. Processing must be distinguishable from stuck

A status pill reading "Processing" looks identical whether a job is moving or
hung. Two things separate them, and both are shown on the row:

- a **determinate count** — `1,890 of 2,086 rows`
- **how long it has been running** — from the moment processing started

Past a threshold (60 minutes here) the row switches to the stuck treatment.
One batch in the mock data has been running for over three hours specifically
so this state is designed rather than assumed.

**Rule:** any state a system can enter and never leave needs a visible clock.

## 6. State a decision's cost before asking for it

Approving spends the balance. The approve panel states what will be sent, to
how many people, what it costs in riyal, and what is left afterwards — and
refuses rather than letting an approval overdraw.

The available-balance figure also carries **what the queue has already
committed**: points promised to files still awaiting a decision. Without it an
approver can approve their way past the balance one file at a time, each
decision looking affordable on its own.

**Rule:** show the balance *after* the action, not just before, and count what
is already promised.

## 7. Rejection without a reason is not a decision, it is a dead end

A reason is required, is captured at the moment of rejection, and travels with
the record where the uploader sees it. Five presets cover the recurring cases;
the free-text field stays editable after picking one.

Without this the uploader learns only that something was refused, and the
conversation moves to WhatsApp where the product cannot see it.

## 8. Actions open a drawer, not a dialog

The list being judged stays on screen while the decision is made. Panels stack
— a rejection can open from the file viewer — with a back arrow that returns
to what was being read. Escape steps back one level rather than discarding the
stack. Focus is trapped inside and returned to the control that opened it.

### RTL note, learned the hard way

`html[dir="rtl"] .pnl` scores (0,2,1); `.pnl.on` scores (0,2,0). Written that
way the closed state outranks the open one and **the drawer never opens in
Arabic**. Both closed states must be scoped to `:not(.on)` so the two never
compete.

This is the general shape of the bug: any direction-scoped rule that sets the
same property as a state class will silently beat it. Scope the base state,
not the state you are toggling.

## 9. Currency

Amounts use the riyal glyph **﷼** (U+FDFC), drawn from an Arabic face because
Poppins does not carry it, inside `direction:ltr; unicode-bidi:isolate` so a
figure never scrambles inside an Arabic sentence.

**Open question for the client.** Saudi Arabia announced a new riyal symbol in
February 2025, encoded as **U+20C1** in Unicode 17.0 (September 2025). Font
coverage is still incomplete, and much published material — including
WalaOne's own screens — still shows the legacy ligature U+FDFC. We use the
legacy glyph because it is what their material uses and it renders reliably.
Moving to U+20C1 is a brand decision with a font-coverage cost attached, and
should be taken deliberately rather than by drift.

## 10. Derived values beat stored ones when they disagree

Five points make one riyal, so a batch's value is arithmetic. It is computed
from the points every time and never read from the stored field, because the
stored field disagrees: one record here holds a value one hundredth of what
its points are worth. Where the two differ the derived figure is shown and the
row is flagged.

**Rule:** where a value can be derived from data the product already trusts,
derive it. A stored duplicate is a second source of truth, and second sources
of truth are only ever discovered when they are already wrong.
