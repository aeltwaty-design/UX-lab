/* Switching language must repaint everything, not just the parts that carry
   data-i18n. Views built in JS are invisible to applyI18n, so each has to be
   redrawn by name in setLang -- and forgetting one leaves real text in the
   language the reader just left. The Overview's date filter, activity feed and
   chart axis all sat in Arabic behind an English page until this caught it.

   The test is deliberately blunt: after a switch, no text in the wrong script
   anywhere on screen. Blocks that declare their own dir are the other language
   on purpose and are skipped, as are the language toggle and proper nouns. */
const { chromium } = require('playwright-core');

const ROUTES = ['overview','users','user/2423500','followers','follower/7710000','transfers',
  'transfers/individual','transactions','charges','exports','settings','releases','release/3'];
const ARABIC = /[؀-ۿݐ-ݿ]/;
const LATIN  = /[A-Za-z]{3,}/;
const ALLOW_LATIN = /Comtech|Gold|Apple|Wallet|WalaOne|English|PNG|JPG|SVG|CSV|XLSX|PDF|PO|INV|CHG|BCH|WLA|COMTECHGOLD|SAR/;

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: false, args: ['--headless=new','--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto('file://' + process.cwd() + '/preview/app.html#/overview');
  await p.waitForTimeout(700);

  let failures = 0;
  for (const from of ['ar','en']) {
    const to = from === 'ar' ? 'en' : 'ar';
    for (const route of ROUTES) {
      // land in `from`, on this route, then switch: the switch is what we test
      await p.evaluate(L => setLang(L), from);
      await p.evaluate(h => { location.hash = '#/' + h; }, route);
      await p.waitForTimeout(300);
      await p.evaluate(L => setLang(L), to);
      await p.waitForTimeout(300);

      const bad = await p.evaluate(({ to, arSrc, latSrc, allowSrc }) => {
        const AR = new RegExp(arSrc), LAT = new RegExp(latSrc), OK = new RegExp(allowSrc);
        const wrong = to === 'en' ? AR : LAT;
        const out = [];
        const walk = document.createTreeWalker(document.getElementById('main'), NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walk.nextNode())) {
          const txt = (n.nodeValue || '').trim();
          if (!txt || !wrong.test(txt)) continue;
          const el = n.parentElement;
          // SVG elements have no offsetParent, so measure instead: this has to
          // skip the chart axis sitting inside a hidden view on other routes.
          if (!el) continue;
          const box = el.getBoundingClientRect();
          if (box.width === 0 && box.height === 0) continue;
          if (el.closest('.langtog, #pv, .rel-alt-body')) continue;
          const flipped = el.closest('[dir]');
          if (flipped && flipped !== document.documentElement &&
              flipped.getAttribute('dir') !== document.documentElement.dir) continue;
          // Latin that is data, not copy: the page marks these .ltr itself,
          // and an address or a filename does not translate.
          if (to === 'ar') {
            if (OK.test(txt)) continue;                      // product and reference names
            if (el.closest('.ltr, .num, .amt, .mono')) continue;
            if (/@/.test(txt)) continue;                     // email addresses
            if (/\.(csv|xlsx|pdf|png|jpe?g|svg|txt)\b/i.test(txt)) continue;   // filenames
          }
          out.push(txt.replace(/\s+/g, ' ').slice(0, 46));
        }
        return [...new Set(out)].slice(0, 4);
      }, { to, arSrc: ARABIC.source, latSrc: LATIN.source, allowSrc: ALLOW_LATIN.source });

      if (bad.length) {
        failures++;
        console.log(`  ${from}->${to}  ${route.padEnd(22)} ${bad.length} not repainted`);
        bad.forEach(x => console.log(`       "${x}"`));
      }
    }
  }
  if (errs.length) console.log('  JS ERRORS:', errs.slice(0, 3));
  console.log(failures || errs.length ? `\n${failures} FAILURE(S)` : '\nall repaint on switch');
  await b.close();
  process.exit(failures || errs.length ? 1 : 0);
})();
