const { chromium } = require('playwright');
/* Latin text sitting in an Arabic UI. Legitimately-Latin things are allowed:
   filenames, batch and reference ids, phone numbers, B2B, CSV, the tenant name.
   Everything else that reads as English words is a leak. */
const OK = /^(?:[\d\s.,:/·—–-]+|BCH-\d+|TRF-\d+|USR-\d+|FLW-\d+|B2B|CSV|CG|MA|\d+K|⌘K|[A-Za-z0-9._-]+\.csv|Comtech Gold|English|[A-Z]{1,2})$/;
const LATIN = /[A-Za-z]{2,}/;
const ALLOW_INLINE = /^(?:CSV|B2B|9665X+|[A-Za-z0-9._-]+\.csv)$/;
(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  const p = await b.newPage({ viewport:{ width:1500, height:1000 } });
  await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto('file:///home/user/UX-lab/preview/app.html#/transfers', { waitUntil:'domcontentloaded' });
  await p.evaluate(() => setLang('ar'));
  await p.waitForTimeout(250);

  const scan = async (label, setup) => {
    if (setup) { await p.evaluate(setup); await p.waitForTimeout(350); }
    const hits = await p.evaluate(([okSrc, latSrc]) => {
      const OK = new RegExp(okSrc), LATIN = new RegExp(latSrc);
      const out = [];
      const walk = (root) => {
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = w.nextNode())) {
          const el = n.parentElement;
          if (!el || el.closest('#pv') || el.closest('script') || el.closest('style')) continue;
          if (el.offsetParent === null && !el.closest('#pnl')) continue;
          const txt = n.textContent.trim();
          if (!txt || !LATIN.test(txt) || OK.test(txt)) continue;
          // a Latin acronym or format example inside an Arabic sentence is fine
          const ALLOW = /^(?:CSV|B2B|9665X+\.?|[A-Za-z0-9._-]+\.csv)$/;
          if (txt.split(/[^A-Za-z0-9._X-]+/).filter(w => /[A-Za-z]{2,}/.test(w)).every(w => ALLOW.test(w))) continue;
          out.push({ txt: txt.slice(0, 64), where: (el.className && String(el.className).slice(0,26)) || el.tagName });
        }
      };
      walk(document.body);
      // placeholders, titles and aria-labels are text too
      document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
        if (el.closest('#pv')) return;
        ['placeholder','aria-label','title'].forEach(a => {
          const v = el.getAttribute(a);
          if (v && LATIN.test(v) && !OK.test(v.trim()))
            out.push({ txt: '@' + a + ': ' + v.slice(0,56), where: (el.className && String(el.className).slice(0,26)) || el.tagName });
        });
      });
      return out;
    }, [OK.source, LATIN.source]);
    const uniq = [...new Map(hits.map(h => [h.txt, h])).values()];
    console.log(`\n${label}: ${uniq.length ? uniq.length + ' LEAK(S)' : 'clean ✓'}`);
    uniq.slice(0, 14).forEach(h => console.log(`   "${h.txt}"   [${h.where}]`));
  };

  await scan('bulk list');
  await scan('individual tab', () => setTTab('individual'));
  await scan('back to bulk',   () => setTTab('bulk'));
  await scan('filters open',   () => tfilToggle());
  await scan('columns open',   () => { tfilClose(); tcolToggle(); });
  await scan('cta menu',       () => { document.getElementById('tcolMenu').hidden = true; ctaToggle(); });
  await scan('batch detail',   () => { document.getElementById('ctaMenu').hidden = true; openBatch('BCH-1041'); });
  await scan('approve',        () => { closePanel(); openApprove('BCH-1041'); });
  await scan('reject',         () => { closePanel(); openReject('BCH-1041'); });
  await scan('file viewer',    () => { closePanel(); openViewer('BCH-1031','all'); });
  await scan('viewer invalid', () => vwFilter('invalid'));
  await scan('single form',    () => { closePanel(); openSingle(); });
  await scan('upload form',    () => { closePanel(); openUpload(); });
  await scan('rejected batch', () => { closePanel(); openBatch('BCH-1034'); });
  await scan('failed batch',   () => { closePanel(); openBatch('BCH-1033'); });
  await scan('empty state',    () => { closePanel(); setState('empty'); });
  await scan('error state',    () => setState('error'));
  await b.close();
})();
