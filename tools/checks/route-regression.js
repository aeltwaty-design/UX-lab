const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  let fails = 0;
  const check = (name, ok, detail) => { console.log(`${ok?'✓':'❌'} ${name}${detail?'  '+detail:''}`); if(!ok) fails++; };

  for (const lang of ['ar','en']) {
    console.log(`\n=== ${lang} ===`);
    for (const route of ['overview','users','followers','transfers','transfers/individual','user/2423501','follower/2423601']) {
      const p = await b.newPage({ viewport:{ width:1440, height:1000 } });
      await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
      const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(`file:///home/user/UX-lab/preview/app.html#/${route}`, { waitUntil:'domcontentloaded' });
      await p.evaluate(l => setLang(l), lang);
      await p.waitForTimeout(220);
      const r = await p.evaluate(() => {
        const on = [...document.querySelectorAll('.view')].filter(v=>v.classList.contains('on')).map(v=>v.id);
        const body = document.getElementById('main').textContent;
        const rawKeys = (body.match(/\b(?:transfers|users|followers|nav|actions|states|attention)\.[a-zA-Z.]+/g)||[]);
        const braces  = (body.match(/\{[a-z]+\}/g)||[]);
        return { view: on[0]||'NONE', chars: body.length,
                 rawKeys: [...new Set(rawKeys)].slice(0,4),
                 braces: [...new Set(braces)].slice(0,4),
                 hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth+1 };
      });
      check(`${route.padEnd(22)} view=${r.view.replace('view-','').padEnd(9)}`,
            r.view!=='NONE' && r.chars>200 && !r.rawKeys.length && !r.braces.length && !r.hscroll && !errs.length,
            [r.rawKeys.length?'RAW KEYS:'+r.rawKeys.join(','):'',
             r.braces.length?'PLACEHOLDERS:'+r.braces.join(','):'',
             r.hscroll?'H-SCROLL':'', errs.length?'JS:'+errs[0].slice(0,50):''].filter(Boolean).join(' '));
      await p.close();
    }
  }

  // the cross-feature paths added this round
  console.log('\n=== connections ===');
  const p = await b.newPage({ viewport:{ width:1440, height:1000 } });
  await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/UX-lab/preview/app.html#/overview', { waitUntil:'domcontentloaded' });
  await p.evaluate(() => setLang('ar')); await p.waitForTimeout(250);
  const att = await p.evaluate(() => ({
    pending: document.querySelector('#attPending .att-d')?.textContent.trim(),
    failed:  document.querySelector('#attFailed .att-d')?.textContent.trim(),
    navBadge: document.getElementById('navQueue')?.textContent }));
  check('overview counts come from the queue', /3/.test(att.pending||'') && /1/.test(att.failed||'') && att.navBadge==='3',
        JSON.stringify(att));
  const jump = await p.evaluate(async () => { goTransfers('failed'); await new Promise(r=>setTimeout(r,300));
    return { route: location.hash, filter: TFILT.status, rows: document.querySelectorAll('#tbody-t tr, .card-row').length }; });
  check('overview -> failed batches', jump.route==='#/transfers' && jump.filter==='failed' && jump.rows===1, JSON.stringify(jump));
  const fromUser = await p.evaluate(async () => { location.hash='#/users'; await new Promise(r=>setTimeout(r,300));
    const u = USERS.find(x=>x.registered); openSingleFor(u.id); await new Promise(r=>setTimeout(r,300));
    return { open: !document.getElementById('pnl').hidden,
             prefilled: document.getElementById('sgWho')?.value?.length>0 }; });
  check('user profile -> transfer with recipient set', fromUser.open && fromUser.prefilled, JSON.stringify(fromUser));
  check('no JS errors across connections', errs.length===0, errs[0]||'');
  await p.close();
  await b.close();
  console.log(fails ? `\n${fails} FAILURE(S)` : '\nall green');
})();
