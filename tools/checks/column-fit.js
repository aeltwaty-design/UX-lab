const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  for (const lang of ['en','ar'])
  for (const w of [360, 480, 640, 760, 900, 1024, 1180, 1280, 1440, 1600, 1800]) {
    const p = await b.newPage({ viewport:{ width:w, height:900 } });
    await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
    await p.goto('file:///home/user/UX-lab/preview/app.html#/transfers', { waitUntil:'domcontentloaded' });
    await p.evaluate(l => setLang(l), lang);
    await p.waitForTimeout(180);
    const r = await p.evaluate(() => {
      const sc = document.querySelector('#view-transfers .tbl-scroll');
      const tbl = document.querySelector('#view-transfers .tbl');
      const cards = document.getElementById('tCards');
      return { cards: !cards.hidden, nCards: cards.querySelectorAll('.card-row').length,
               tableShown: !sc.hidden,
               over: !sc.hidden && tbl.scrollWidth > sc.clientWidth + 1,
               overBy: !sc.hidden ? tbl.scrollWidth - sc.clientWidth : 0,
               cols: [...document.querySelectorAll('#thead-t th')].map(t=>t.textContent.trim()).filter(Boolean),
               pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
    });
    const mode = r.cards ? `CARDS(${r.nCards})` : `table[${r.cols.length}]`;
    const bad = (r.over ? ` ❌ overflows by ${r.overBy}` : '') + (r.pageScroll ? ' ❌ PAGE SCROLL' : '');
    console.log(`${lang} ${String(w).padStart(4)}  ${mode.padEnd(12)} ${r.cols.join(', ')}${bad}`);
    await p.close();
  }
  await b.close();
})();
