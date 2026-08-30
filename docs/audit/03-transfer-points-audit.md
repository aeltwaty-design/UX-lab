# UX/UI Audit — Feature 04: Transfer Points

**Screens:** `/report/transactions` — the batch list, plus two modals reached from the
primary action: "Transfer Points to a single user" and "Transfer Points by CSV file".

---

## What the feature is

Partners move points to their customers two ways: **one user at a time**, or **in bulk by
CSV**. The list currently shows only the CSV batches. Per the client, a second view for
single transfers exists but was never designed, and the two belong behind **tabs** on
this screen.

There is also an **approval step** that the current UI barely expresses: other people in
the partner's organisation upload a CSV, and an admin accepts or rejects it. Accepting
moves it to *ready*; rejecting moves it to *rejected*.

**That makes this screen an approval queue, not just a report** — and nothing in the
current design says so.

---

## A. The approval flow is invisible

### A1. Nothing identifies who uploaded a file
An admin is being asked to approve or reject someone else's work, and the table never
names that person. It is the first thing an approver needs and it is absent.

### A2. The three action icons carry no labels
An eye, a green tick and a red bin, unlabelled, on the only rows that can be acted on.
Two of the three change state irreversibly for someone else's submission.

### A3. Reject is drawn as a delete
A red bin says "this record will be destroyed". Rejecting a batch is a decision *about*
it, and the record must survive — the uploader needs to see it was rejected, and why.

### A4. No reason is captured on rejection
The uploader is told nothing. An approval queue without a reason field pushes the
conversation into a side channel.

### A5. Approvable rows are indistinguishable at a glance
The only cue that a row needs action is that it has three icons instead of one. The
queue does not surface how many are waiting.

## B. The numbers do not add up

### B1. A batch that transferred nothing reads "Completed"
`sdsd.csv` — 5 records, 2 invalid, 3 duplicate. That is zero valid rows. It transferred
0 points and 0 SAR, and its status says **Completed**. Nothing failed loudly; the file
simply achieved nothing and reported success.

### B2. Invalid and duplicate counts lead nowhere
The table says 2 invalid and 12 duplicate but gives no way to see *which* rows, so the
uploader cannot fix them and the approver cannot judge them.

### B3. Amount formatting is inconsistent within one column
`0.00 SAR`, `0 SAR` and `5660.00 SAR` appear together. Two of those are the same value
written two ways.

### B4. The points-to-riyal ratio here contradicts the platform rate
`sdsd.csv` shows **2,830,000 points** against **5,660.00 SAR** — 500 points per riyal.
The rate elsewhere in the product is **5 points = 1 SAR**. Either this column is the
purchase value that *earned* the points rather than their worth (as was settled for the
Users transaction table), or one of the two figures is wrong. Must be resolved before
either screen ships.

### B5. Six of nine rows show 0 points and 0 SAR
Same overloaded zero the dashboard audit raised: nothing distinguishes "genuinely
nothing" from "failed silently".

## C. Status

### C1. The status set is incomplete on screen and unexplained
Two values are visible — **Uploaded** and **Completed** — and the client describes two
more, **ready** and **rejected**. Nothing tells the reader what the sequence is or where
a given file sits in it.

### C2. Black is not a status colour
**Uploaded** renders as a solid black pill. Black carries no meaning in the palette, and
the state it marks — waiting for a human decision — is the most actionable on the page.

## D. The modals

### D1. The CSV rules contradict themselves
"most not use ',' character" followed by "separate between data by ','". The first is
also a typo for *must*. As written the reader is told both to avoid and to use the same
character. The intent is presumably: do not put commas inside values; commas separate
fields.

### D2. Both modals must become side panels
Per the client, transfers and any later action open a **side panel**, not a modal.

### D3. Two identifier concepts, named differently in each place
The single form asks for **Phone** and **Wala ID**; the CSV form asks for a **Type** of
*phone* or *user id*. Same idea, three names.

### D4. The rules that matter are buried
"Min: 50 – Max: 10,000 points. 30 min cooldown per user" sits as grey helper text under
the field. These are the constraints most likely to make a submission fail.

### D5. The link inside the warning box repeats the panel's own title
"Transfer Points by CSV file" appears as the heading *and* as a link inside it. If the
link downloads a template, it should say so.

## E. Carried over from earlier audits

Ambiguous numeric dates (`09/08/2026 11:34`); no loading, empty or error states; nine
columns with no responsive strategy; and the old shell throughout — all already solved
in the shared components this feature will inherit.

---

## Confirmed by the client

1. Two tabs on this screen: the CSV batch list, and a single-transfer list.
2. Admin accepts or rejects uploaded files: accept → *ready*, reject → *rejected*.
3. The riyal symbol and the WalaOne point mark appear in the table.
4. Clicking a file name downloads it.
5. Transfers and later actions open a **side panel**, never a modal.
6. The primary action carries both options.

---

# Addendum — the file viewer and the newer reference screen

Two further screens supplied **for understanding only**; their visual design is not to be
carried across.

## The file viewer ("عرض الملف")

Opens on a batch and shows the rows inside it, paginated into numbered pages
(صفحة #1 … #5). Columns: `# Row`, `Ref no.`, `Name`, `Amount`, `Mobile no.`

Two things in the data matter more than the layout:

### F1. The row numbers are not sequential
1, 3, 4, 6, 7, 8, 9, 12, 13, 20 — with 2, 5, 10, 11 and others missing. So the viewer is
showing a **subset** of the file, and the numbers are the original line numbers. Nothing
on screen says which subset, or why the others are absent.

### F2. Duplicate reference numbers are visible but unmarked
`num66` appears six times across the visible rows. The batch list counts duplicates in a
column; this viewer contains them and does not flag a single one. Together those two
screens hold the whole answer and neither joins it up: **the count is in one place, the
offending rows in another, and nothing links them.**

This is the fix for the earlier finding that invalid and duplicate counts lead nowhere.
The viewer already has the rows — it needs to mark their state.

## The newer reference screen

An Arabic, WalaOne-branded Transfer Points screen. Useful for what it reveals about the
**data model**, not its styling.

### N1. Bulk and individual are two views of one feature
The navigation carries تحويل النقاط with two children — عمليات النقاط بالجملة (bulk) and
عمليات النقاط الفردية (individual). Confirms the two-tab structure the client described.

### N2. There is a "source type" dimension not present in the old screen
نوع المصدر takes values برامج ولاء (loyalty programme), فاتورة (invoice), ملف (file),
ترشيح (referral) and B2B. A real dimension, and an obvious filter, that the old design
omits entirely.

### N3. Individual transfers name who performed them
تمت بواسطة carries an avatar, a name and a phone. The **bulk list has no equivalent**,
which is exactly the gap flagged for the approval queue — the batch list never says who
uploaded the file it is asking an admin to approve.

### N4. The riyal glyph is used, not the letters
القيمة renders as ﷼ before the figure rather than "SAR" after it.

### N5. Three summary figures head the screen
إجمالي النقاط المشحونة (total charged), النقاط المحولة (transferred) and رصيد النقاط المتاح
(available balance) — the wallet, restated in the context of this feature.

### N6. The ratio question gets worse, not better
The old batch list shows 2,830,000 points against 5,660.00 SAR — 500 points per riyal.
This screen shows 2,504 points sent against a value of ﷼1,150,150 — roughly 459 riyal per
point, the inverse. The two cannot both describe the same relationship, and neither
matches the platform's 5 points = 1 SAR. Likely placeholder data in the newer mockup, but
it has to be settled before a value column ships anywhere.

---

## Resolved — answers from the client

### R1. Value is the points' worth in riyal, at 5 points = 1 SAR
Not the purchase value. So **both existing screens show wrong figures**: the batch list's
2,830,000 points against 5,660.00 SAR implies 500:1, and the newer screen's 2,504 points
against ﷼1,150,150 implies roughly 459:1 the other way. Neither is 5:1.

Consequence for the build: the value column is **derived from the points**, not read from
the field, and the live data is treated as a defect the same way the negative balance was.
Where a stored value disagrees with points ÷ 5, the UI shows the derived figure and marks
the row rather than printing a number it cannot stand behind.

### R2. Six states, not four
`Uploaded` → `Ready` → `Processing` → `Completed`, with `Rejected` off the first step and
`Failed` off processing.

Design consequences:
- **Uploaded** is the only state that needs a human, so it carries the attention treatment
  and drives the queue count.
- **Processing** must be visibly in flight, so a stuck batch reads as stuck rather than as
  quietly pending forever.
- **Failed** is a real error; **Rejected** is a decision. They must not share a colour.
  Rejected is a stage, not a fault — the same distinction drawn for unregistered users.

### R3. Source type on both tabs, as column and filter
`برامج ولاء` loyalty programme · `فاتورة` invoice · `ملف` file · `ترشيح` referral · `B2B`.
On the bulk tab this describes what the batch is **for**, not how it arrived, so it varies
and earns its place there too.

### R4. The approval queue gets all four
1. **Who uploaded** each batch — avatar, name and phone, matching the individual tab, so
   the approver can see whose work they are judging.
2. **A reason is required on rejection**, captured in the panel and shown to the uploader.
   Without it a rejection communicates nothing and the conversation leaves the product.
3. **Invalid and duplicate rows are marked in the file viewer**, and filterable, so the
   count and the evidence finally live in the same place.
4. **The three summary figures head the screen** — total charged, transferred, available
   balance — so the approver sees the balance a batch will spend before approving it.

## Still assumed

- The individual-transfer constraints from the old form — minimum 50, maximum 10,000
  points, 30-minute cooldown per user — are carried forward as stated.
- Clicking a file name downloads it; the download itself is out of scope for a prototype,
  so it will be shown as the affordance with a confirmation.

---

## What was built

Route `#/transfers`, with `#/transfers/individual` for the second tab. Reached
from the sidebar, from the Overview's "waiting for your approval" and
"transactions failed" rows, and from any registered user's profile.

### Answers to the findings

| Audit finding | What the screen does |
|---|---|
| The list never says who uploaded a file | An uploader column with avatar, name and phone, matching the individual tab. Below 1160px of table width it folds into the file cell rather than disappearing. |
| Three unlabelled icon actions | Labelled buttons. A row offers only what it can do — an action that cannot apply is absent, never greyed out. |
| Reject drawn as a red delete bin | Approve is a filled primary, reject a plain outline. No red, no bin: nothing is destroyed. |
| No rejection reason captured | Required before the button will submit, with five presets, kept on the record and shown to the uploader. |
| `sdsd.csv` — zero valid rows, "Completed" | The breakdown bar renders with no green segment at all, the row reads "nothing could be sent", and the detail panel says so plainly. Approving a zero-valid file is blocked. |
| Amounts as `0.00 SAR`, `0 SAR`, `5660.00 SAR` | One derived figure, one format, the ﷼ glyph, tabular figures. |
| The CSV rules contradicted themselves on commas | Four rules, one statement each. |
| Counts of invalid and duplicate rows lead nowhere | Every count is a control that opens the file filtered to exactly those rows. |
| The viewer skips file lines and repeats `num66` unmarked | Every row is shown, the file's own line numbers are kept, and a duplicate names the line it repeats. |
| Two statuses visible, no lifecycle | Six states in three visual families, each with an explanation on hover. |
| No sense of what a batch will cost | The approve panel gives the cost, the balance after it, and refuses to overdraw. The available figure carries what the queue has already committed. |

### Deliberately not done

- **The file does not really download.** Clicking a filename confirms the
  action; a prototype has no file to hand over.
- **The CSV is not really parsed.** Choosing a file produces a plausible batch
  so the states after it can be designed, but no bytes are read.
- **`Processing` does not really advance.** Its counter is derived from how
  long the batch has been running, which is enough to design both the moving
  and the stuck case.

### Still open

1. **The riyal symbol.** We use the legacy ﷼ (U+FDFC) because WalaOne's own
   screens do. The 2025 official symbol is U+20C1 and font coverage is still
   patchy. Someone should decide rather than let it drift — see
   `docs/design-system/05-approval-queue.md` §9.
2. **Stored values disagree with the rate.** Every value on this screen is
   computed from the points at 5:1. On real data that will contradict what the
   current system prints, in one case by a factor of a hundred. Whoever owns
   that field should hear it from us before a partner notices.
3. **Who may approve.** The screen assumes the viewer is an admin. If approval
   is a permission, an uploader viewing their own batch needs a different set
   of controls, and we have not designed that.
4. **Bulk approve.** Not built. Approving several files at once is a natural
   ask and a genuinely dangerous control; worth its own conversation rather
   than an assumption.
