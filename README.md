# WalaOne Partner Dashboard — prototype

## To look at it

Open **`preview/app.html`** in any browser. Double-click it. That is the whole
prototype: one self-contained file, no server, no build, works offline.

Open **`docs/architecture.html`** the same way for how it is built.

Inside the prototype, a **Preview controls** panel sits in the bottom corner:

- **Language & direction** — Arabic (RTL) or English (LTR), a real mirror, not
  translated text on a left-to-right page.
- **Data state** — Normal, Loading, Empty, Error. Every screen is designed for
  all four.
- **Sidebar** — collapsed, to check the layout at the narrower content width.

Your language choice is remembered between visits.

## Screens

`#/overview` · `#/users` · `#/user/:id` · `#/followers` · `#/follower/:id` ·
`#/transfers` · `#/transactions` · `#/charges` · `#/exports` · `#/settings` ·
`#/releases` · `#/release/:id` · `#/login`

Every screen is a URL you can paste to someone.

## To change the copy

The text lives in `src/i18n/*.json`, keyed by language, then by a flat dotted
key. Edit a string there and run:

```
node tools/merge-i18n.js
```

That folds the sources into the dictionary inside `preview/app.html`. Nine
prefixes are replaced wholesale, so deleting a string from a source file really
removes it from the page rather than leaving the old text behind.

The merge also reports **alias keys** — a string the page reads under one name
while the copy file holds it under another. An edit to an aliased key never
reaches the screen, which is how a rename silently does nothing.

## To verify a change

```
npm install          # playwright-core only
node tools/checks/route-regression.js
node tools/checks/lang-switch.js
node tools/checks/column-fit.js
node tools/checks/arabic-leak-scan.js
node tools/checks/states-and-keyboard.js
node tools/checks/no-duplicate-names.js
```

Each runs a headless browser against the real rendered page. `tools/checks/README.md`
says what each one catches and why it exists. They need a Chromium binary; set
`CHROME=/path/to/chrome` if the default path is wrong for your machine.

## The one rule about money

**5 points = 1 SAR**, everywhere, no exceptions. Value is never stored on a
record — it is `valueOf(points)`, computed at render, so nothing can carry a
figure that disagrees with the rate.
