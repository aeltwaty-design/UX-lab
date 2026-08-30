const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  const widths = [360, 480, 640, 820, 1024, 1280, 1440, 1680];
  const bad = [];
  for (const lang of ['ar','en']) {
    for (const w of widths) {
      const p = await b.newPage({ viewport:{ width:w, height:900 } });
      await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
      const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('file:///home/user/UX-lab/preview/app.html#/transfers', { waitUntil:'domcontentloaded' });
      await p.evaluate(l => setLang(l), lang);
      await p.waitForTimeout(160);
      const r = await p.evaluate(() => {
        // anything sticking out past the viewport
        const over = [];
        document.querySelectorAll('#view-transfers *').forEach(el => {
          if (el.closest('.tbl-scroll')) return;   // a scroller is allowed to be wider than the page
          if (el.ownerSVGElement) return;          // <use> reports the symbol's own box, not layout
          const b = el.getBoundingClientRect();
          if (b.width && (b.right > document.documentElement.clientWidth + 1.5 || b.left < -1.5))
            over.push((el.className && String(el.className).slice(0,38)) || el.tagName);
        });
        return { scrollW: document.documentElement.scrollWidth,
                 clientW: document.documentElement.clientWidth,
                 cols: document.querySelectorAll('#thead-t th').length,
                 over: [...new Set(over)].slice(0,4) };
      });
      // and the drawer in RTL
      const pnl = await p.evaluate(async () => {
        openViewer('BCH-1041','invalid');
        await new Promise(r=>setTimeout(r,300));
        const el = document.getElementById('pnl'), b = el.getBoundingClientRect();
        const cw = document.documentElement.clientWidth;
        return { left: Math.round(b.left), right: Math.round(b.right), cw,
                 onScreen: b.right > 4 && b.left < cw - 4,
                 rows: document.querySelectorAll('.vw-tbl tbody tr').length };
      });
      const flag = [];
      if (r.scrollW > r.clientW + 1) flag.push('H-SCROLL ' + r.scrollW + '>' + r.clientW);
      if (r.over.length) flag.push('overflow:' + r.over.join(','));
      if (!pnl.onScreen) flag.push('PANEL OFFSCREEN ' + pnl.left + '..' + pnl.right + ' of ' + pnl.cw);
      if (errs.length) flag.push('JS:' + errs[0].slice(0,60));
      console.log(`${lang} ${String(w).padStart(4)}  cols=${r.cols} vwRows=${pnl.rows}  ${flag.length?'❌ '+flag.join(' | '):'ok'}`);
      if (flag.length) bad.push(lang+w);
      await p.close();
    }
  }
  console.log(bad.length ? '\nFAILURES: ' + bad.join(', ') : '\nall clean');
  await b.close();
})();
