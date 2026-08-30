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
