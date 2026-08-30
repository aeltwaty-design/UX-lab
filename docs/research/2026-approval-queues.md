# Approval Queues & Batch Review — Research, 2025–2026

Reference for **Feature 04: Transfer Points** (`docs/audit/03-transfer-points-audit.md`).
The screen is an approval queue with a batch-import review inside it, and a financial
summary on top. Nine questions, nine conventions, nine consequences for our build.

> **Method note.** Direct page fetches are blocked by the network proxy in this
> environment, so the evidence below comes from search extracts of the linked pages.
> Every claim carries its URL — verify exact wording at source before quoting it in a
> spec or a Figma annotation. Nothing here is a visual reference: we take the
> principle, never the look.

---

## 1. Approval queues — where the decision lives

**The queue is a place, not a value in a status column.** Every mature product gives
"waiting on you" its own addressable surface, and it is always a *filtered view of the
same collection*, not a different data set.

- **Ramp** surfaces bills needing you in two places — a **For approval** tab on Bill Pay
  and an **Inbox**, with a *Next approver = me* filter to narrow to your own decisions.
  Bulk approval is a checkbox column on that tab.
  ([support.ramp.com](https://support.ramp.com/hc/en-us/articles/4417843897747-Bill-Pay-approvals))
- **Brex** puts them under **Bills** or **Tasks**, and items labelled *Requires approval*
  are **sorted to the top of the list** rather than being visually shouted at. Notably,
  approvers can **edit most fields inline during approval** — correcting a description or
  a date without a reject-and-resubmit round trip.
  ([brex.com/support](https://www.brex.com/support/approval-chains))
- **Stripe Radar** ships a literal **Review queue** (Radar → Review queue), separate from
  Payments, and offers **two reading modes**: a list view "to scan reviews without seeing
  details about each payment", and a detailed view carrying the payment context needed to
  decide. Outcomes are *approve / refund / refund and mark fraudulent* — always more than
  a binary. ([docs.stripe.com/radar/reviews](https://docs.stripe.com/radar/reviews))
- **Linear Triage** is the purest statement of the pattern: a holding inbox that sits *in
  front of* the team's workflow so unreviewed work never lands in the real backlog.
  ([linear.app/docs/triage](https://linear.app/docs/triage))

**Controls: row, panel, or page?** The working rule across data-table guidance is that
the decision belongs next to the evidence. Inline row actions are right only when the row
itself carries everything needed; "if editing requires additional data or confirmation…
you might be better off opening a modal, popup, a separate detail view"
([Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)).
Cloudscape formalises the middle option as **split view** — a collection paired with a
split panel for contextual detail, "effective for quickly browsing or comparing key
resource details" ([cloudscape.design](https://cloudscape.design/patterns/resource-management/view/split-view/)).

**Bulk approve is a real affordance and a real hazard.** Polaris' IndexTable supports
promoted bulk actions and selection across pages
([polaris-react.shopify.com](https://polaris-react.shopify.com/components/tables/index-table)),
and Ramp ships it. But the approval-fatigue literature is blunt: when 95 of the last 100
were fine, reviewers "optimize by skimming, then pattern-matching, then clicking approve
as a reflex", and the safety layer becomes decoration
([tianpan.co](https://tianpan.co/blog/2026/06/25/approval-fatigue-how-human-in-the-loop-gates-decay-into-rubber-stamps),
[coresecurity.com](https://www.coresecurity.com/blog/what-rubber-stamping-and-why-it-serious-cybersecurity-concern)).
The mitigation is to route only genuine decisions to humans and to make the confirm cost
something deliberate — *"display scope before confirmation: recipient count, record
count, or transaction total"*.

**Queue tab vs history tab is a false dichotomy.** Polaris resolves it: tabs *are* saved
views — "each tab represents a subset of the list that has been sorted, filtered … and
saved with a unique name" — and tabs must "represent the same kind of content"
([polaris-react.shopify.com/components/navigation/tabs](https://polaris-react.shopify.com/components/navigation/tabs),
[index-filters](https://polaris-react.shopify.com/components/selection-and-input/index-filters)).
So it is one list, with the queue as a named, badge-counted view. Badge counts on tabs
are well-supported for exactly this: "unread messages, pending approvals, and new
activity" ([setproduct](https://www.setproduct.com/blog/badge-ui-design)).

**What this means for our screen:** BULK and INDIVIDUAL are different objects, so they
earn real tabs. The approval queue is *not* a third sibling — inside BULK, add saved
views (`All · Needs approval ⟨3⟩ · In progress · Completed · Rejected`) with the count
only on *Needs approval*. Default the admin to that view when it is non-empty. Row shows
a single **Review** entry point; approve/reject live in the review panel next to the
evidence, never as bare icons in the row. Ship without bulk approve in v1 — the counts
are small and each row moves real money; if it returns, it must state aggregate points
and SAR in the confirm.

---

## 2. Batch / bulk import review — valid, invalid, duplicate

**Partial import has won.** All-or-nothing is now treated as a defect: "when users upload
spreadsheets with a few invalid rows, all-or-nothing imports can block progress"; the
recommended strategy is to "ingest and persist only valid rows, skip and report invalid
rows, and give users clear, actionable feedback so they can fix and retry"
([CSVBox](https://blog.csvbox.io/partial-import-valid-rows/)).

**The count must be a route to the rows.** The single strongest convention is that every
error number is navigable. Flatfile's importer carries an **"Only show rows with
problems"** toggle so error rows are found without scrolling
([flatfile.com](https://flatfile.com/blog/optimizing-csv-import-experiences-flatfile-portal/)).
Vitaly Friedman's bulk-import guidance is the same shape: a validation step where users
"identify and fix issues directly within the interface", plus "allow users to see only
rows with errors and flag duplicates for repair"
([smart-interface-design-patterns.com](https://smart-interface-design-patterns.com/articles/bulk-ux/)).

**Fix in place, then fall back to a re-upload file.** HubSpot lets you correct values
*inside the mapping step* "rather than needing to edit and re-upload your file", and after
any import generates "both a summary and an optional error download… exactly which rows
failed, what caused the issue, and where to correct it"
([knowledge.hubspot.com](https://knowledge.hubspot.com/import-and-export/troubleshoot-import-errors)).
Shopify's importer runs **two validation passes** — a structural pass on headers/encoding
before any row is processed, then a row-level pass — and offers an **errors-only CSV** so
only the failed rows are fixed and re-uploaded
([productlasso teardown](https://productlasso.com/en/blog/shopify-csv-import-errors)).
The oldest version of this rule is still the clearest: rejected records should be written
to an error file **in the same layout as the import file**, so it can be repaired and
re-imported directly ([Oracle Siebel EIM](https://docs.oracle.com/cd/E05553_01/books/EIMAdm/EIMAdm_ImportData48.html)).

**Duplicates are a separate question with a separate answer.** Mailchimp checks
"duplicates, bounces, and unsubscribes" as a distinct class from format errors
([mailchimp.com](https://mailchimp.com/help/troubleshooting-contact-imports/)). Where
products handle them well they *ask*: the standard option set is **skip / overwrite /
merge / ask each time**, and Friedman's guidance is to "flag duplicates and ask users to
confirm how they'd like to manage them" before overwriting.

**Zero valid rows is the failure case everyone gets wrong.** Enterprise tools routinely
report "0 records imported" as a *successful* run with no error, and support forums are
full of people trying to work out what happened
([SAP community](https://community.sap.com/t5/enterprise-resource-planning-q-a/quot-0-records-imported-successfully-quot-error-for-importing-fixed-assets/qaq-p/11060588)).
A file that achieves nothing must not terminate in a success state.

**What this means for our screen:** the row's record count becomes four linked figures —
`120 records · 106 valid · 2 invalid · 12 duplicate` — where **invalid** and **duplicate**
are chips that filter the row table inside the review panel. The panel gets an
*errors only* toggle, a per-row reason ("Iqama number failed checksum", "already
transferred in batch #4471"), and a **Download error rows** action returning the original
columns plus a `reason` column. State the outcome in words before the approve button:
*"Approving transfers 106 of 120 rows — 2,650,000 points, 5,300.00 SAR."* Duplicate policy
must be an explicit, visible choice (skip is our default), not a silent behaviour. And a
batch with zero valid rows can never reach **Completed**: it terminates as *Nothing to
transfer* with the reason attached — this is audit finding B1, and it is a data-model fix,
not a copy fix.

---

## 3. Status / pipeline visualisation for a branching lifecycle

**Pills for the row, timeline for the panel, no stepper.** Steppers are for linear,
sequential, *user-driven* progress: they "guide users through a step-by-step process…
displaying each step in a linear progression"
([ServiceNow Horizon](https://horizon.servicenow.com/workspace/components/now-stepper)),
and the tracker/indicator distinction is explicit — "a progress tracker shows steps in a
user-driven process… a progress indicator is a loading animation showing system status"
([UXPin](https://www.uxpin.com/studio/blog/design-progress-trackers/)). A six-state
lifecycle with two exits is neither: rendering it as a stepper implies Rejected and Failed
are *stages on the way somewhere*, which they are not.

**Status must never be carried by colour alone.** Carbon's status-indicator pattern is
built from four elements — colour, shape, symbol, text — of which "at least three… must be
present" for WCAG, precisely because red/green confusion makes colour-only status
unreadable ([carbondesignsystem.com](https://carbondesignsystem.com/patterns/status-indicator-pattern/)).
Carbon also distinguishes weight: "filled icons are more visible and tend to carry more
weight… used for high attention statuses. Outlined icons are more delicate."

**Atlassian's lozenge vocabulary maps almost exactly onto our lifecycle**: `inprogress`
for "in progress, open, modified"; `moved` for "items that have changed and require
attention"; plus `success`, `removed`, `new`, `default`
([atlassian.design](https://atlassian.design/components/lozenge/)).

**Rejected ≠ Failed, and the honest signal is grey vs red.** Many badge systems lazily
collapse both into "error red"
([setproduct](https://www.setproduct.com/blog/badge-ui-design)) — but the severity-led
systems argue the opposite. Astro's status system runs a severity ladder where the lowest
level, *Off*, is **grey/neutral** and only the highest, *Alert*, is red, after research
showed that "wide overuse of red to indicate both 'off' and 'emergency' stripped the color
of its attention-getting power" ([astrouxds.com](https://www.astrouxds.com/patterns/status-system/)).
Stripe's own vocabulary separates the actor rather than the sentiment: `succeeded`,
`processing`, `canceled`, `requires_action`, `requires_payment_method`
([docs.stripe.com](https://docs.stripe.com/api/payment_intents/confirm)). And on naming:
"a status like *Pending* might be accurate from the system's point of view and still
nearly useless from the user's" — one label hiding "waiting on review, waiting on a sync…
or sitting in a broken state" ([Trevor Calabro](https://trevorcalabro.substack.com/p/fixing-bad-status-design)).

**History belongs in a timeline, not in the pill.** The audit-trail convention is a
vertical timeline of who / what / when / context, with a coloured dot per entry
([Velt](https://velt.dev/blog/approval-audit-trail-saas-products),
[shadcn timeline block](https://www.shadcn.io/blocks/timeline-audit-trail)).

**What this means for our screen:** six pills, each **icon + word**, never colour alone.

| State | Tone | Icon | Reads as |
|---|---|---|---|
| Uploaded | attention / amber | dot-outline | *waiting on you* |
| Ready | info / blue | check-circle outline | accepted, queued |
| Processing | info / blue + motion | spinner | machine working |
| Completed | success / green | check-circle filled | done |
| **Rejected** | **neutral / dark grey** | **circle-slash** | *a person decided* |
| **Failed** | **critical / red** | **warning triangle** | *the system broke* |

Grey for Rejected is the load-bearing decision: it is a legitimate, expected, archived
outcome of the workflow, and red would put it in the same bucket as a system fault while
diluting the one colour that must still mean "something is wrong". Rename **Uploaded** →
**Awaiting approval** (see §5 on naming). The lifecycle diagram itself belongs in the
review panel as a timeline — *Uploaded by Nawaf · 12 Mar 09:14 → Rejected by Sara ·
12 Mar 11:02* — not as a stepper in the row.

---

## 4. In-flight / processing state — and the stuck job problem

**Name the states finely enough to tell waiting from wedged.** GitLab's own issue tracker
argues for splitting a generic *Pending* into `Enqueued/Pending` versus `Pending/Blocked`
or `Pending/Stuck` — "to differentiate between jobs that can be expected to move to
another state simply by waiting and jobs that are likely to require some intervention"
([gitlab.com/-/issues/18879](https://gitlab.com/gitlab-org/gitlab/-/issues/18879)).

**Count things, don't spin.** The async-workflow pattern set is unusually concrete: a job
"might be queued (waiting its turn), running… completed with errors, or failed. If users
can't tell these apart, they'll assume the app is stuck", and *"Importing 3,200 rows
(1,140 processed)" beats "Processing"*
([LogRocket](https://blog.logrocket.com/ux-design/ui-patterns-for-async-workflows-background-jobs-and-data-pipelines/)).
The same source gives the anti-stuck mechanism directly: **"Show 'Last updated 2 minutes
ago' and offer a refresh. On the backend, mark jobs as stale if they haven't
heartbeated."** A queued item should also say *why* it is waiting and how many jobs are
ahead, "so that users know why they are waiting and won't assume that something is broken".

**Determinate whenever the denominator exists.** Use a determinate bar "when the progress
can be calculated against a specific goal"; indeterminate only when duration is genuinely
unknowable — and a bar may "change to a determinate indicator if enough information is
gathered" ([Carbon progress bar](https://carbondesignsystem.com/components/progress-bar/usage/),
[Material](https://m2.material.io/go/ios-progress-indicators/)). For a CSV batch we always
know the row count, so an indeterminate spinner is a choice not to tell the user something
we know.

**Refresh has a house style.** Cloudscape: put the **manual refresh button in the header
actions**, run automatic refresh "at predefined intervals, for example 10 seconds", and in
tables "use skeleton loading… skeleton rows preserve the table's column layout"
([cloudscape.design](https://cloudscape.design/patterns/general/loading-and-refreshing/)).
Announce the updated timestamp in an ARIA live region and label the refresh control.

**What this means for our screen:** a Processing row shows a **determinate bar with a
count** (`4,120 / 12,000 rows`) and a relative start time (`Started 4 min ago`). Above a
threshold with no heartbeat — 10 minutes is a sane first guess, to be confirmed against
real job times — the row flips to a distinct **Taking longer than expected** treatment
(amber, still not red, with a "Contact support" affordance); it must never look like a
quiet Ready row. Poll every ~10s only while at least one row is Processing, never
reordering rows under the reader's cursor; show `Last updated 12:04` plus a manual refresh
in the table header. Skeleton rows on first load only — never as a substitute for a real
processing state.

---

## 5. Rejection reasons

**The reason is mandatory, and it belongs to the record.** Expensify's model is the
reference: "when rejecting a report, the approver enters a comment to explain why they
will not approve the report. The rejection reason will be added to the expense, and it can
later be marked as resolved and resubmitted for approval"
([docs.expensify.com](https://docs.expensify.com/en/articles/2927-report-actions-approving-rejecting-and-editing)).
Crucially the object is **returned, not destroyed**: a rejected report "moves back to Draft
status and the submitter must fix any issues and manually resubmit", is skipped by
scheduled submission so it cannot silently re-enter the queue, and the submitter is
**notified**
([help.expensify.com](https://help.expensify.com/articles/new-expensify/reports-and-expenses/Understanding-Report-Statuses-and-Actions)).

**Preset *and* free text — configurable per severity.** Oracle's workflow model ships
selectable rejection reasons on a Reason drop-down, plus separate attributes for whether
*reasons* and *comments* are required
([docs.oracle.com](https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25d/faupd/rejection-reasons-for-workflows-0.html)).
On the control itself, Baymard is against reaching for a dropdown by reflex: with a small
known set, "opting for an open text field or radio button interface instead of a drop-down
… is a better choice"; dropdowns earn their place past ~10 options or where a structured,
analysable value is required ([baymard.com](https://baymard.com/blog/drop-down-usability)).
Structured reasons are what make the queue measurable later ("41% of rejections are
duplicate uploads") — so capture both: a small set of chips *plus* a note.

**What makes the feedback actionable is naming the next move.** NN/g's form-error
guidelines: users must "easily detect errors, understand how to fix them, and see the
error message while correcting the corresponding error", with a guideline for resolving it
([nngroup.com](https://www.nngroup.com/articles/errors-forms-design-guidelines/)). Feedback
research frames the same requirement as *specific, scaffolded, justified, actionable* — the
recipient's real gap is "what to do next", not "how did I do"
([UX Content Collective](https://uxcontent.com/how-to-write-error-messages/)).

**Sometimes the best rejection is an edit.** Brex lets approvers fix fields in place
"without needing to reject and resubmit the bill" — removing a whole class of rejections
([brex.com](https://www.brex.com/support/approval-chains)).

**What this means for our screen:** rejecting opens a required reason step with 4–5 preset
chips drawn from real causes — *Too many invalid rows · Duplicate of an earlier batch ·
Wrong source type · Value exceeds available balance · Other* — plus an always-visible note
field (required when *Other*). Store reason code and note separately. Surface it three
ways for the uploader: the row's Rejected pill carries a tooltip/subline *"Rejected by Sara
Al-Otaibi"*, the review panel timeline shows the full note, and the uploader is notified.
Wording should point at the fix ("Re-upload with the 12 duplicate rows removed"), not the
verdict. Keep an eye on the Brex escape hatch: if most rejections turn out to be one
fixable field, we have designed the wrong control.

---

## 6. Destructive-looking but not destructive

**Red is a budget, and rejection should not spend it.** Polaris: use critical tone "only
for destructive actions that are difficult or impossible to undo", and "don't overuse
critical styled buttons within a single view as it can dilute the meaning and importance
of the action" ([polaris.shopify.com/patterns/common-actions](https://polaris.shopify.com/patterns/common-actions)).
GitLab Pajamas is stricter still and gives us the exact case: danger buttons are for
destructive actions, **but** "in a long list of items where each contains a destructive
action, use the default variant to avoid having many danger buttons overwhelm the page",
and where the action is easily undone with no data lost, "consider adding no friction at
all… these kinds of destructive actions can be exempt of using the danger button variant"
([design.gitlab.com/patterns/destructive-actions](https://design.gitlab.com/patterns/destructive-actions/),
[button](https://design.gitlab.com/components/button/)). Astro's finding is the empirical
backstop: overusing red "stripped the color of its attention-getting power"
([astrouxds.com](https://www.astrouxds.com/patterns/status-system/)).

**Green-approve / red-reject is an accessibility anti-pattern.** Encoding the choice in
the red/green axis "can disconnect a large portion of your audience that are specifically
color-blind to these two colors"; the recommended construction is a **filled primary paired
with an outline/neutral secondary**, with meaning carried by label and icon as well as
colour ([Tutsos](https://tutsos.com/t/two-buttons),
[uxmovement](https://uxmovement.com/buttons/color-contrast-mistakes-to-avoid-on-buttons/)).
And red on a non-destructive control actively misleads: red "has a connotation of something
dangerous, whereas… close should clearly be taken as the neutral action with no
side-effects".

**Iconography is a promise about reversibility.** A trash can is read as "this record will
cease to exist"; the danger-zone literature reserves that treatment for account deletion,
data wiping and similar irreversible operations, kept in a separated, deliberately styled
region ([Smashing](https://www.smashingmagazine.com/2024/09/how-manage-dangerous-actions-user-interfaces/)).
Smashing's other rule is directly usable here: the confirm CTA must carry "a proper
label — 'Delete API Key' rather than a general word like 'Confirm'". And for anything
consequential, "display scope before confirmation: recipient count, record count, or
transaction total" ([UX Psychology](https://uxpsychology.substack.com/p/how-to-design-better-destructive)).

**What this means for our screen:** this closes audit finding A3 directly. **Reject is not
a delete.** In the review panel: `Approve` is the filled primary; `Reject` is a neutral
**outline secondary** — no red fill, no red text, and categorically **no trash icon**
(a circle-slash if an icon is needed at all). The record survives, visibly, in the Rejected
view — so the styling must not promise destruction the system will not perform. Red is
spent in exactly two places on this screen: the **Failed** status pill, and a genuine
destructive action if one ever exists (deleting an uploaded file before processing).
Friction is proportionate: rejecting opens a confirm carrying the reason field and restating
scope — *"Reject sdsd.csv — 5 records, 0 SAR. The uploader will be notified."* — and its
button says **Reject batch**, never *Confirm*. Approving spends real money, so it gets the
same treatment in the opposite direction: *"Approve — 2,650,000 points · 5,300.00 SAR"*.

---

## 7. Financial summary headers

**Three or four figures, one of which is clearly the verdict.** The consensus layout across
current fintech dashboards puts "total balance with trend at the top as a 'verdict row' —
the 'am I okay?' answer with the largest type on the page", followed by **money in motion**:
"upcoming and pending payments, transfers in flight, and cards awaiting approval"
([fintech dashboard teardown, 2026](https://adminlte.io/blog/fintech-dashboard-design-examples/)).
General dashboard guidance agrees on the hierarchy mechanism — "use larger type for
primaries, and apply restrained color to signal priority" — and on restraint, 3–4 critical
figures before detail ([UXPin](https://www.uxpin.com/studio/blog/dashboard-design-principles/)).

**"Available" is a compound, and good products decompose it on demand.** Stripe's balance
is explicitly available + pending (+ reserved), and its balance summary reports starting
balance, total activity, total payouts, ending balance
([docs.stripe.com/reports/balance](https://docs.stripe.com/reports/balance)). Mercury shows
one headline "Mercury balance" — "a birds eye view of available funds across all of your
… accounts, **including any pending transactions that are outgoing**" — with a control to
expand into "the detailed breakdown of available funds and pending transfers"
([support.mercury.com](https://support.mercury.com/hc/en-us/articles/28767842120852-Understanding-your-Mercury-balances)).
The pattern: one authoritative number, with its composition one click away.

**Warn before the commitment, not after the failure.** Payment-form guidance is to "capture
input mistakes through predictive inline validation before the transaction request reaches
the gateway", with a descriptive message adjacent to the offending field
([Evil Martians](https://evilmartians.com/chronicles/payment-form-best-coding-practices-that-dont-drop-sales)).
Where this is not done, the failure surfaces late and unhelpfully — Wise's API simply
returns a rejected transfer with `transfer.insufficient_funds`
([docs.wise.com](https://docs.wise.com/guides/product/send-money/funding/fund-by-transfer)) —
and Revolut's mitigation for scheduled payments is a **notification 24 hours ahead** when
the balance won't cover it
([help.revolut.com](https://help.revolut.com/en-CH/help/transfers/scheduled-transfers/insufficient-funds-for-scheduled-transfer/)).

**What this means for our screen:** three figures, not four cards of equal weight —
**Points transferred** (period), **Value transferred** (SAR, period), and **Available
points balance** as the verdict figure in larger type, visually separated from the two
period metrics (they answer different questions: "what happened" vs "what can I still
do"). Add the money-in-motion number the current screen lacks: **points committed in the
queue** — batches Awaiting approval plus Ready plus Processing — because an admin about to
approve needs available *minus* committed, not available. Pattern **F (Paired)** from
`docs/design-system/04-metric-card-patterns.md` fits available-vs-committed exactly; the
period metrics can stay on **A** or **B**. Then close the loop in the review panel: if
approving this batch would push committed past available, show an inline warning **before**
the approve button with the shortfall stated in both units — warn rather than hard-disable
unless the backend truly cannot queue it, and never let the shortfall be discovered as a
`Failed` row an hour later. Resolve the 500-points-per-riyal contradiction in audit B4
before any of these figures ship — a summary header built on an unresolved conversion rate
is worse than no header.

---

## 8. Side panels vs modals for forms

**The 2025–26 default for review-in-context is the panel.** "Unlike a centered modal, a
drawer slides in from the side while leaving the underlying page visible, allowing users to
remember where they were"; enterprise products (Linear, Intercom) use it for "editing
issues, viewing conversations, or inspecting records"
([onething.design](https://www.onething.design/post/modal-vs-drawer)). Cloudscape's split
view is the same idea formalised, with the useful detail that inside the panel you should
"omit the containers and place content like key-value pairs directly on the split panel…
to reduce visual noise" ([cloudscape.design](https://cloudscape.design/patterns/general/secondary-panels/)).

**But "panel" and "side modal" are two different components.** Twilio Paste draws the line
sharply: a **side modal** "is a focus trap and can't be tabbed out of", and typically must
be closed before returning to the main task; a **side panel**'s content "can be tabbed
through and then tabbed out of to return to the main page content"
([paste.twilio.design](https://paste.twilio.design/components/side-modal)). Carbon adds the
decision rule: side panels are for content that is non-blocking and "should be used for
optional or non-critical tasks only. If a user's response or input is required to progress
the workflow, use a modal dialog"
([carbondesignsystem.com](https://carbondesignsystem.com/components/modal/usage/)).

**Widths are conventional, not derived.** Pajamas drawer: **400px**
([design.gitlab.com](https://design.gitlab.com/components/drawer/)). Salesforce Lightning
panels: 320 (default) / 400 / 640
([lightningdesignsystem.com](https://www.lightningdesignsystem.com/guidelines/builder/panels/)).
Semrush Intergalactic defaults to 260. Below a responsive breakpoint every one of them goes
full-width.

**Stacking is discouraged.** Braid: nesting drawers is "supported but not encouraged in
order to keep experiences simple"
([seek-oss.github.io/braid-design-system](https://seek-oss.github.io/braid-design-system/components/Drawer/));
the general failure mode is "nested overlays… with no clear hierarchy [that] leave users
unsure how to get back".

**Unsaved changes get a modal, consistently.** Cloudscape: "when there are unsaved changes
on the page, and users attempt to navigate away or initiate any action that will discard
unsaved data, launch a modal for users to confirm or cancel", and the behaviour should be
consistent "irrespective of the size or severity of changes… so that users don't need to
guess whether friction will appear"
([cloudscape.design](https://cloudscape.design/patterns/general/unsaved-changes/)).

**What this means for our screen:** the batch review is a **panel, not a modal** — around
**520–560px** (wider than the 400px norm because it contains a row table), full-width below
~640px, opening from the **inline-end** via `inset-inline-end` so it lands on the left in
Arabic with no separate RTL code path. The list stays readable behind it; keep it
*scrollable and readable* but treat the panel as the active context — don't invite the
reader to start a second review mid-decision. **No panel-from-panel.** The reject
confirmation is the one place a real modal is right: input is required to progress, and
Carbon's rule says modal. If a reason has been typed and the panel is dismissed, show the
discard-changes confirm — and use the same confirm everywhere in the product. Close button
positioned with `inset-inline-end`; focus moves into the panel on open and returns to the
originating row on close.

---

## 9. Arabic / RTL specifics

**Numbers never flip.** Under the Unicode bidi algorithm digits are *weakly* directional
and always run left-to-right inside right-to-left text — "whether you write 123 in English
or ١٢٣ in Arabic, the digits are read in the same order"
([W3C](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics),
[Kitab](https://kitab.noorui.com/en/blog/numbers-in-rtl-languages)). The practical failure
is not the digits but the *runs around* them: amounts, IDs, file names and Latin brand
names get reordered by the algorithm unless isolated with `<bdi>` or
`unicode-bidi: isolate` ([Evil Martians](https://evilmartians.com/chronicles/600-million-people-write-right-to-left-2-fixes-your-app-needs)).
For currency the established Arabic order is number then unit — "1,500 ريال — the number
(LTR) followed by the Arabic word (RTL). Do not reverse this."

**The riyal symbol changed, and this is a 2025 decision point.** On **20 February 2025**
SAMA announced a new official Saudi riyal symbol derived from Arabic calligraphy; it was
encoded in **Unicode 17.0 (September 2025) as U+20C1 SAUDI RIYAL SIGN**, designed to work
correctly in both LTR and RTL contexts
([Wikipedia](https://en.wikipedia.org/wiki/Saudi_riyal_sign),
[fileformat.info](https://www.fileformat.info/info/unicode/char/20c1/index.htm)). Guidance
aimed at businesses says it "will gradually replace older abbreviations like SAR and SR in
financial documents, e-commerce platforms, banking apps", and that fintechs operating in
Saudi are expected to use the symbol rather than the ISO code
([ZenHR](https://blog.zenhr.com/en/what-the-new-saudi-riyal-symbol-means-for-businesses-in-2025),
[Tally](https://tallysolutions.com/mena/business-guides/new-riyal-symbol-usage-guidelines/)).
Two traps: **font coverage is still incomplete** — an unsupported font renders `.notdef`
(tofu) — which is why an official open-source font and web toolkits exist
([Saudi-Riyal-Font](https://github.com/emran-alhaddad/Saudi-Riyal-Font),
[riyal.js.org](https://riyal.js.org/)); and much published material shows the *legacy*
ligature **U+FDFC ﷼**, which is a different character from the new U+20C1. Pick one
deliberately and test it in both languages, both weights, and in PDF/CSV export.

**Mirror the layout, not the world.** Mirror navigation, panels, progress fill and
directional arrows; do **not** mirror logos, media controls, clock-direction arrows or
real-object imagery
([Firefox RTL guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html),
[rtl-guidelines](https://github.com/ItielMaN/rtl-guidelines)). The mechanism is logical CSS
throughout — `margin-inline-start`, `inset-inline-start`, `text-align: start` — "and one
codebase lays out correctly in both directions automatically", which is already our house
rule in `docs/DECISIONS.md`. The named failure is "pure mirroring": flipping everything via
CSS and scrambling the things that must stay LTR.

**What this means for our screen:** every amount, points figure, record count, file name
and batch ID is a bidi island — wrap it (`<bdi>` / `unicode-bidi: isolate`) so
`sdsd.csv` and `5,660.00` never reorder inside an Arabic sentence. Keep Western numerals
(project decision) and `font-variant-numeric: tabular-nums` so columns align. Align numeric
columns to the **inline-end** in both directions and keep the currency mark glued to its
number in a single isolated run, so the decimal points still line up when the table flips.
Status pills need `padding-inline` and no fixed width — Arabic status labels run longer
than English ("Awaiting approval" → "بانتظار الموافقة") and a pill sized to the English
string will clip; the pill's icon sits at the inline-start in both directions. On the riyal
mark, the recommendation is: adopt **U+20C1** with the official font bundled and a tested
fallback chain, keep the ISO code `SAR` in CSV/PDF exports and API payloads, and never mix
`SAR`, `SR` and a glyph in one column — which is audit finding B3, now with a currency-mark
decision attached to it.

---

## Still open

1. **The 500-points-per-riyal contradiction** (audit B4) blocks §7 entirely.
2. **Stuck-job threshold** in §4 is a guess until we have real processing times.
3. **Riyal glyph vs `SAR`** needs a rendering test on the project's Arabic and Latin font
   stacks before it becomes a token.
4. **Duplicate policy** (skip / overwrite / ask) is a product decision, not a design one —
   §2 assumes *skip*, stated visibly.
