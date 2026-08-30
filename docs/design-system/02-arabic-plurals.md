# Open item — Arabic (and English) number agreement

**Status:** known limitation, deliberate interim convention. Needs a ruling from the
UX lead; the real fix belongs in the React port.

## The problem

Arabic noun agreement changes with the count:

| count | required form | example |
|---|---|---|
| 1 | singular | تحويل |
| 2 | dual | تحويلان |
| 3–10 | plural | 3 تحويلات |
| 11–99 | singular accusative | 12 تحويلاً |
| 100+ | singular genitive | 100 تحويلٍ |

A flat string template — `"{count} تحويلات نقاط بانتظار موافقتك."` — has no way to branch
on the count. **No single Arabic form is correct across all ranges.** Any static choice is
right for some counts and wrong for others.

## What we chose, and why

`src/i18n/content.json` uses **plural everywhere**, consistently, across every
count-bearing string. Two reasons:

1. This is a triage worklist. The realistic common case for these five exception types is
   1–10 items, where plural is the grammatically correct form anyway.
2. It fails more gracefully. `12 تحويلات` reads as mildly colloquial to a native eye and is
   unremarkable in Gulf business-app copy. `3 تحويلة` — singular forced onto a count that
   wants plural — reads distinctly more wrong.

An earlier read of this called the file "inconsistent between the 3–10 and 11–99 ranges".
That was wrong. Every string uses the *same* rule; it only looked inconsistent because the
sample counts in the mock data happened to straddle the 3–10 / 11–99 boundary. Feed 12 into
`expiringOffers` and it shows the identical behaviour.

**English has the same class of bug** at n=1: `time.days` renders `1 days`. Lower stakes,
same structural cause.

## The two real fixes

1. **ICU / CLDR plural categories** (`zero` / `one` / `two` / `few` / `many` / `other`) per
   string, via `Intl.PluralRules` or an i18n library. This is the correct answer and it is a
   code decision, not something a flat JSON copy deck can express. **Do this in the React
   port.**
2. **Correctness by construction** — rephrase as a partitive: `{count} من التحويلات`
   ("{count} of the transfers"). The definite plural after `من` never changes form, so it is
   grammatically correct for every count with no branching at all. Cheaper than (1), but it
   means rewriting every count-bearing string and it shifts the register slightly.

## Decision needed

Keep the plural-always convention for the prototype, or switch to the partitive phrasing
now? Either way, option 1 lands with the React port.
