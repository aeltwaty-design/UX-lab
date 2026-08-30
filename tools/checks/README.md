# Checks

Each script drives `preview/app.html` in headless Chromium and asserts something the
prototype has already got wrong once. Run them from the repo root with Playwright
installed:

```
node tools/checks/<name>.js
```

Set `CHROMIUM` if your browser is not at the default Playwright path.

| Script | What it asserts | Why it exists |
|---|---|---|
| `arabic-leak-scan.js` | No Latin text, placeholder, title or aria-label anywhere in the Arabic UI, across 17 states | English headings shipped on the Arabic Users page. The scanner that missed them matched only key-shaped strings, so a plain "Users" passed |
| `width-sweep.js` | Nothing escapes the viewport, and the drawer is really on screen, at 8 widths × 2 languages | `html[dir="rtl"] .pnl` outscores `.pnl.on`, so the panel never opened in Arabic |
| `column-fit.js` | The table fits its scroller at every width in both languages, or has become cards | Every width threshold written by hand was wrong within a day |
| `route-regression.js` | 7 routes × 2 languages render with no raw keys, no unreplaced `{placeholders}`, no page scroll, no console errors | Several `str.replace` patches failed silently and were only found by a person looking at the screen |
| `states-and-keyboard.js` | Exactly one of loading/empty/error/real shows per state; focus enters the drawer and returns; panels stack and go back; rejecting without a reason is refused | — |

`../keyreq.py --check` is the non-browser one: it expands the i18n keys built at runtime
from a prefix plus a variable and diffs them against the copy file in both languages.

`no-duplicate-names.js` is the non-browser one added after a settings preview
toggle silently replaced the Users profile's tab switcher: both were called
`setTab`, the later definition won, and nothing failed until someone clicked a
tab. The page is assembled from many spliced modules, so it asserts that every
top-level function and const is declared exactly once.
