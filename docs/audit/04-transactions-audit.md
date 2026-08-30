# Feature 05 — Transactions

The screen at `/transactions`. Three screenshots: the list, and the funnel's
filter panel opened at each of its two dropdowns.

Client's framing:
1. *"There's no additional pages, it's just one Page"*
2. *"The 'Name' Column is User, So put the user column 'avatar - Name - ID number'"*

## What the screen is

Every point movement in the partner's programme, one row each: a reference,
the person it concerned, an amount, a points figure, whether that person is
registered, what kind of movement it was, and when. 57 rows in this account,
ten to a page.

It is the global version of a table the product already has — the Transactions
tab on a user's profile shows the same events for one person, with columns
Reference, Direction, Points, Purchase value and Date. The two should agree
with each other, and currently do not: **the profile table has a Direction
column and this one does not.**

## The rate contradiction, with evidence

Every row on this screen is **exactly 500 points per 1.00 of amount**:

| Amount | Points | Ratio |
|---|---|---|
| 1000.00 | 500,000 | 500 |
| 1.40 | 700 | 500 |
| 1.76 | 880 | 500 |
| 500.00 | 250,000 | 500 |
| 1360.00 | 680,000 | 500 |
| 0.02 | 10 | 500 |
| 2.00 | 1,000 | 500 |
| 200.00 | 100,000 | 500 |
| 0.10 | 50 | 500 |
| 0.00 | 0 | — |

Ten rows, no exceptions. This is not a stray record; it is the relationship the
live system uses.

It contradicts the rate this project has been building to. The brief said
*5 points = 1 SAR*; asked directly during the Transfer Points work, the answer
was *"Value = the points' worth in riyal at 5:1"*, and the Transfer Points
screen now computes every value that way. The same 500:1 relationship appeared
there too — 2,830,000 points against 5,660.00 — and was recorded as a data
defect on the strength of that answer.

It is now much harder to call a defect. **Either the Transfer Points screen is
computing every value a hundred times too high, or this screen's Amount column
is not what it appears to be.** Both cannot stand.

The `0.02 → 10 points` row is the most telling: a welcome bonus with an amount
of two halalas. That reads like what the points cost the partner, not what a
customer spent.

## Findings

**T1 — Two columns are empty on every row.** `ORIGIN ID` and `COMMENT` carry
nothing in any of the ten rows. Two of nine columns are holding space for
data that may never arrive.

**T2 — Three rows have no reference number.** The blanks fall on *Welcoming
points* and *Referral* rows — system-generated events that plausibly have no
reference. But an empty cell in an identifier column reads as missing data
rather than as "not applicable".

**T3 — The `NAME` column contains phone numbers.** Every row. The column is
headed NAME and holds none. This is what the client's second note fixes.

**T4 — A value in the data cannot be filtered.** The Source Type filter offers
File, Loyalty Programs, Invoice, Referral, B2B. The table contains **Welcoming
points**, which is not in that list. Anyone filtering by type cannot reach
those rows, and cannot discover that they exist.

**T5 — Two filtering systems, unexplained.** A funnel opens a panel with
*Account active* and *Source Type*. Beside it sits a separate *Select type*
dropdown. The column is headed *Type of transactions*. Three names, and it is
not visible whether they are two concepts or three.

**T6 — Every row says the same thing.** `REGISTRATION` reads *Registered* on
all ten, in green. A column whose value never varies is spending width to say
nothing — though the filter implies unregistered rows exist somewhere.

**T7 — The filter panel has no way to finish.** No Apply, no Clear, no count
of what is active. It overlaps the table it is filtering, so the effect of a
choice is hidden behind the panel making it.

**T8 — Pagination cannot navigate.** *Previous* and *Next* only. With 57 rows
at ten a page that is six pages with no way to reach page four, and no
"showing 1–10 of 57" anywhere near the table. The total sits detached in the
top-right corner instead.

**T9 — Amounts carry no currency.** `1000.00`, `0.02`, `0.00` — no symbol, no
unit, in a column headed only *Amount*. Nothing on the screen says what it is
denominated in.

**T10 — The export control is an unlabelled icon.** Same finding as the
Transfer Points row actions: a purple button whose only clue is a glyph.

**T11 — The page-size control leads the toolbar.** *10* sits at the far
inline-start, ahead of search and filters, separated from the pagination it
governs at the other end of the page.

**T12 — No sorting.** No column offers it. On a 57-row ledger that will grow,
date and amount are the obvious ones.

**T13 — No direction.** The profile's version of this table distinguishes
points in from points out. This one does not, so a refund and an award look
identical.

## Questions before design

1. **The rate.** Ten of ten rows say 500 points per unit of amount. What is
   the Amount column — what a customer spent, what the partner paid for the
   points, or the points' redemption value? And does the 5:1 answer given
   during Transfer Points still hold, given this data?
2. **Origin ID and Comment** — ever populated, and by what?
3. **Type, source type, and transaction type** — how many distinct concepts
   are there, and does *Welcoming points* belong in the same list as *File*?
4. **How does a row relate to Transfer points?** Does approving a 1,240-record
   file produce 1,240 rows here?
5. **"One page only"** — does that rule out a side panel for one transaction,
   and should the person's name link to their existing profile?
6. **"ID number"** in the user cell — the الرقم التعريفي we just renamed, and
   does the phone number still appear beside it?

---

## Resolved — answers from the client

### R1. The rate stays at 5 points = 1 ﷼; this screen's data is wrong

Ten rows at exactly 500:1 are not evidence enough to move the rate. Value is
points ÷ 5 here as everywhere else, computed rather than read, and the live
figures on this screen are wrong by a factor of a hundred.

That makes three screens now carrying the same discrepancy — the batch list,
the newer reference screen, and this one — all consistent with each other and
all inconsistent with the stated rate. **Whoever owns that field should hear
this from us before a partner reconciles a statement**, because our figures
will disagree with theirs everywhere.

### R2. One list of types, and the filter is missing values

Transaction type is a single dimension. *Welcoming points* belongs in it
alongside File, Loyalty programme, Invoice, Referral and B2B — the filter was
simply incomplete, which is why those rows could not be reached.

### R3. Origin ID and Comment stay

They are populated for some transaction types. Since they are empty far more
often than not, they are **available as columns but off by default**, and
always present in the side panel so a value is never lost.

*Assumption, flagged:* an origin id belongs to transactions that came from
something external — invoices and B2B settlements — and a comment to
transfers a person made by hand. If either is populated for other types, say
so and I will change which rows carry them.

### R4. A row opens a side panel; the person links to their profile

No new page, consistent with Transfer points. The reference also links back to
the file the transaction came from, where it came from one.

### R5. The user cell is avatar, name, phone

*"Phone number, it's mistake from me"* — the third line is the phone, not the
ID number. Identical to the Users table, which is the point: the same person
should look the same everywhere in the product.

### R6. One row per recipient, linked to its batch

Approving a 1,240-record file produces 1,240 rows here, each able to open the
batch it came from. That closes the loop between the two screens: a batch says
how many people it reached, and this screen says who they were.

### R7. Direction comes to this screen

The profile's transactions tab already distinguishes points in from points
out; without it here, a refund and an award look identical. The two tables now
agree.
