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

## Open questions — must be answered before design

1. **What is the one job of this screen?** Look up a single person, work the unregistered
   backlog, or export a segment? Same framing as the dashboard's core question.
2. **What is behind the funnel?** Which dimensions are filterable today?
3. **Is there a user detail view**, or is the table the whole feature?
4. **What can a partner do to a user?** Transfer points, message, invite, deactivate?
5. **Does email exist?** The search placeholder claims it; no column shows it.
6. **What is `#` for?** Does any partner workflow need that ID visible?
7. **Registered vs unregistered** — is unregistered the same population as the dashboard's
   "invites not completed"?
8. **Why gender?** Is it used for anything, and is it optional at signup?
9. **41 users against 18,432 followers** on the dashboard — is that test data, or is the
   real ratio genuinely that wide?
10. **Export** — which formats, and does it honour the active filters?
11. **Date format** — day-first or month-first, and should Hijri appear alongside?
