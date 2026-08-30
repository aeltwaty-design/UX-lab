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

## 2. There is no failed state — rejection is the only way out

**Revised after client review.** The product has no failure state for a
transfer: a batch either goes through or an admin declines it. Five states,
not six — uploaded, reviewing, ready, completed, rejected.

The principle the removed state carried still governs the screen: **an
expected human outcome never takes the danger colour.** Rejected is a
decision, so it takes neutral grey and a circle. Red stays unspent here, which
is the point — nothing on this screen is broken, so nothing on it is red.

Should a failure state ever be introduced, it must not share a colour, an icon
or a shape with rejection. Collapsing the two into error-red is the common
default and it is wrong twice over: it tells an uploader their judgement call
was a system fault, and it spends the one colour that should mean *something
is broken*.

### The states, and their colours

No two are told apart by their icon alone:

| State | Treatment |
|---|---|
| Uploaded | warning tint, pulsing dot — the only one addressed to a person |
| Reviewing | *hidden for now* — info teal, spinning eye, with a clock |
| Ready | brand purple, clock — approved, queued to send |
| Completed | success green, check |
| Rejected | neutral grey, circle-cross |

The first draft gave Reviewing and Ready the same teal, separated only by
their icons. That is a distinction a glance does not make.

**Reviewing is hidden at the client's request** (`REVIEWING_ENABLED = false`).

Hiding a status is not the same as hiding a pill. A record parked in a state
nobody can see is a record no filter reaches, no count includes and no reader
can explain — so the flag also moves any batch that would be under review into
the state it is on its way to, keeps that state out of the filter menu,
suppresses its progress and stuck notes, and counts those batches as committed
against the balance like any other approved file. Flip the flag and all of it
returns together.

**Rule:** a feature flag that hides a state must also account for the records
in it. Hiding the label alone leaves them stranded.

## 3. Reject is not delete

The old screen drew reject as a red bin. Nothing is destroyed: the file, its
rows and the decision all survive, and the uploader needs every one of them.

Approve is a **filled primary**; reject is a **plain outline**. Not
green-and-red — that pairing carries its entire meaning in hue, which is the
one channel a colour-blind reviewer cannot read. Weight and fill survive where
hue does not.

**Rule:** red and trash iconography are reserved for irreversible destruction.
A reversible or record-preserving action takes a neutral outline.

## 4. Validate before accepting, not after

**Revised after client review.** Records are checked while a file is being
uploaded, not after it lands in the queue, and only usable records are
uploaded. So a file in the list is clean by definition, and an admin reviewing
it is judging the transfer — who it is for, how many points, what it costs —
not proofreading a spreadsheet.

This is the stronger design. A queue that carries broken records asks every
reviewer to re-discover the same problems, and lets the person best placed to
fix them — whoever made the file — find out last.

The breakdown moved with it. Choosing a file now produces a check before it is
submitted: how many records were read, how many will be uploaded, how many
will not and why, with a panel naming the problem on each one. **The count and
its evidence stay in one place**, which is what the principle was always
about:

**Rule:** a number describing a subset must be a link to that subset. If it
cannot be, it should not be shown.

The old viewer printed counts on one screen and records on another with
nothing joining them, and silently dropped lines it could not parse — a claim
with the evidence removed. That is the failure this guards against, wherever
the count lives.

## 5. Reviewing must be distinguishable from stuck

A status pill reading "Processing" looks identical whether a job is moving or
hung. Two things separate them, and both are shown on the row:

- a **determinate count** — `1,890 of 2,086 records`
- **how long it has been running** — from the moment processing started

Past a threshold (60 minutes here) the row switches to the stuck treatment.
One batch in the mock data has been running for over three hours specifically
so this state is designed rather than assumed.

**Rule:** any state a system can enter and never leave needs a visible clock.

## 6. State a decision's cost before asking for it

Approving spends the balance. The approve panel states what will be sent, to
how many people, what it costs in riyal, and what is left afterwards — and
refuses rather than letting an approval overdraw. Nothing is skipped, because
nothing unusable reached the queue.

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

## 10. Derive what can be derived

Five points make one riyal, so a batch's value is arithmetic: points ÷ 5,
computed every time it is shown. There is no stored value to read, so there is
nothing to disagree with, no flag, and no message explaining a discrepancy the
product cannot produce.

**Rule:** where a value can be derived from data the product already trusts,
derive it. A stored duplicate is a second source of truth, and second sources
of truth are only ever discovered when they are already wrong.

## 11. Records, not rows

The product counts **records** (سجلات). A file has records; only the file
viewer's line numbers refer to *lines* (سطر), because those are positions in a
text file rather than things in the system.

Small, but worth fixing once and holding: a screen that calls the same thing a
row here and a record there makes a reader wonder whether they are two things.
