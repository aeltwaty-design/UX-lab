const { chromium } = require('playwright');
/* Latin text sitting in an Arabic UI. Legitimately-Latin things are allowed:
   filenames, batch and reference ids, phone numbers, B2B, CSV, the tenant name.
   Everything else that reads as English words is a leak. */
// Reference codes, ids, filenames and the tenant's own name are Latin by
// nature; everything else Latin in an Arabic page is a leak.
const OK = /^(?:[\d\s.,:/·—–-]+|BCH-\d+|TRF-\d+|TX-\d+|USR-\d+|FLW-\d+|INV-\d+|COMTECHGOLD(?:\/[A-Z]+)?\/[0-9]+|CHG-\d+|PO-\d+-\d+|EXP-\d+|Admin Charge|[a-z.@]+|[0-9_]+_[a-z]+\.csv|B2B|CSV|CG|MA|\d+K|⌘K|[A-Za-z0-9._-]+\.csv|Comtech Gold|WalaOne|English|[A-Z]{1,2})$/;
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
      // One test for text and attributes alike. Attributes used to get only the
      // whole-string check, so an aria-label that legitimately names a file -
      // "تنزيل 2026_08_29_charges.csv" - was reported as a leak.
      const ALLOW = /^(?:CSV|B2B|COMTECHGOLD|DIRECT|RET|(?:INV|BCH|TRF|TX|CHG|PO|EXP)(?:-[0-9-]+)?|WalaOne|9665X+\.?|[a-z.]+@[a-z.]+|[A-Za-z0-9._-]+\.csv)$/;
      const isLeak = txt => {
        if (!txt || !LATIN.test(txt) || OK.test(txt)) return false;
        const words = txt.split(/[^A-Za-z0-9._@X-]+/)
                         .map(w => w.replace(/^\.+|\.+$/g, ''))     // sentence punctuation is not part of the word
                         .filter(w => /[A-Za-z]{2,}/.test(w));
        return !words.every(w => ALLOW.test(w));
      };
      const out = [];
      const walk = (root) => {
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = w.nextNode())) {
          const el = n.parentElement;
          if (!el || el.closest('#pv') || el.closest('script') || el.closest('style')) continue;
          const pnl = el.closest('#pnl');
          if (pnl && pnl.hidden) continue;          // a closed drawer is not on screen
          if (el.offsetParent === null && !pnl) continue;
          const txt = n.textContent.trim();
          if (!isLeak(txt)) continue;
          out.push({ txt: txt.slice(0, 64), where: (el.className && String(el.className).slice(0,26)) || el.tagName });
        }
      };
      walk(document.body);
      // placeholders, titles and aria-labels are text too
      document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
        if (el.closest('#pv')) return;
        const p2 = el.closest('#pnl');
        if (p2 && p2.hidden) return;
        if (!p2 && el.offsetParent === null && el.tagName !== 'BODY') return;
        ['placeholder','aria-label','title'].forEach(a => {
          const v = el.getAttribute(a);
          if (v && isLeak(v.trim()))
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
  await scan('file viewer',    () => { closePanel(); openViewer('BCH-1031'); });
  await scan('single form',    () => { closePanel(); openSingle(); });
  await scan('upload form',    () => { closePanel(); openUpload(); });
  await scan('upload checked', () => { upPick(); renderUpCheck(); });
  await scan('upload review',  () => openUpReview());
  await scan('review dupes',   () => uprFilter('duplicate'));
  await scan('rejected batch', () => { closePanel(); openBatch('BCH-1034'); });
  await scan('ready batch',    () => { closePanel(); openBatch('BCH-1038'); });
  // the transactions screen and its panel
  await scan('transactions',   () => { closePanel(); location.hash = '#/transactions'; });
  await scan('txn filters',    () => xfilToggle());
  await scan('txn columns',    () => { xfilClose(); xcolToggle(); });
  await scan('txn panel',      () => { document.getElementById('xcolMenu').hidden = true;
                                       openTxn(TXNS.find(x => x.batch).id); });
  await scan('txn no ref',     () => { closePanel(); openTxn(TXNS.find(x => !x.ref).id); });
  await scan('charge history', () => { closePanel(); location.hash = '#/charges'; });
  await scan('charge filters', () => cfilToggle());
  await scan('charge panel',   () => { cfilClose(); openCharge(CHARGES[0].id); });
  await scan('exports',        () => { closePanel(); location.hash = '#/exports'; });
  await scan('export filters', () => efilToggle());
  await scan('export columns', () => { efilClose(); ecolToggle(); });
  // sign in, both steps, which live outside the shell
  await scan('sign in',        () => { closePanel(); location.hash = '#/login'; });
  await scan('sign in help',   () => lgHelp());
  await scan('verify code',    () => { lgHelp(); AUTH_STEP='otp'; renderLogin(); startResend(); });
  await scan('code resent',    () => { otpResend(); });
  await scan('empty state',    () => { stopResend(); location.hash = '#/transfers'; setState('empty'); });
  await scan('empty state 2',    () => { closePanel(); location.hash = '#/transfers'; setState('empty'); });
  await scan('error state',    () => setState('error'));
  await b.close();
})();
