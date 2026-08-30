/* One check for every table in the product.
   Each draws, measures and drops columns through the same fitTable(), so they
   are verified the same way rather than by three near-identical scripts that
   can drift apart the way the tables themselves once did. */
const { chromium } = require('playwright');

const TABLES = [
  { name:'transfers bulk',  route:'transfers',            view:'#view-transfers',    head:'#thead-t', cards:'tCards', prefix:'transfers.columns.' },
  { name:'transfers indiv', route:'transfers/individual', view:'#view-transfers',    head:'#thead-t', cards:'tCards', prefix:'transfers.columns.' },
  { name:'transactions',    route:'transactions',         view:'#view-transactions', head:'#thead-x', cards:'xCards', prefix:'transactions.columns.' },
  { name:'charge history',  route:'charges',              view:'#view-charges',      head:'#thead-c', cards:'cCards', prefix:'charge.columns.' },
  { name:'users',           route:'users',                view:'#view-list',         head:'#thead',   cards:null,     prefix:'users.columns.' },
];
const WIDTHS = [360, 480, 640, 760, 900, 1024, 1180, 1280, 1440, 1600, 1800];

(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  let bad = 0;
  for (const T of TABLES) {
    console.log(`\n== ${T.name} ==`);
    for (const lang of ['en','ar']) {
      const line = [];
      for (const w of WIDTHS) {
        const p = await b.newPage({ viewport:{ width:w, height:900 } });
        await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
        await p.goto(`file:///home/user/UX-lab/preview/app.html#/${T.route}`, { waitUntil:'domcontentloaded' });
        await p.evaluate(l => setLang(l), lang);
        await p.waitForTimeout(180);
        const r = await p.evaluate(T => {
          const sc = document.querySelector(T.view + ' .tbl-scroll');
          const tbl = document.querySelector(T.view + ' .tbl');
          const cards = T.cards ? document.getElementById(T.cards) : null;
          const over = [];
          document.querySelectorAll(T.view + ' *').forEach(el => {
            if (el.closest('.tbl-scroll') || el.ownerSVGElement) return;
            const b = el.getBoundingClientRect(), cw = document.documentElement.clientWidth;
            if (b.width && (b.right > cw + 1.5 || b.left < -1.5)) over.push(String(el.className).slice(0,24));
          });
          return { cards: !!cards && !cards.hidden,
                   n: document.querySelectorAll(T.head + ' th').length,
                   tableOver: sc && !sc.hidden && tbl.scrollWidth > sc.clientWidth + 1,
                   pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                   over: [...new Set(over)].slice(0,2) };
        }, T);
        const flags = [r.tableOver && 'TABLE', r.pageScroll && 'PAGE', r.over.length && 'OVER:'+r.over[0]].filter(Boolean);
        if (flags.length) { bad++; line.push(`${w}:❌${flags.join('/')}`); }
        else line.push(`${w}:${r.cards ? 'cards' : r.n}`);
        await p.close();
      }
      console.log(`  ${lang}  ${line.join('  ')}`);
    }
  }
  await b.close();
  console.log(bad ? `\n${bad} FAILURE(S)` : '\nall clean');
})();
