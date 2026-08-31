const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  let fails = 0;
  const check = (name, ok, detail) => { console.log(`${ok?'✓':'❌'} ${name}${detail?'  '+detail:''}`); if(!ok) fails++; };

  for (const lang of ['ar','en']) {
    console.log(`\n=== ${lang} ===`);
    for (const route of ['overview','users','followers','transfers','transfers/individual','transactions','charges','exports','settings','releases','release/3','user/2423501','follower/2423601']) {
      const p = await b.newPage({ viewport:{ width:1440, height:1000 } });
      await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
      const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(`file:///home/user/UX-lab/preview/app.html#/${route}`, { waitUntil:'domcontentloaded' });
      await p.evaluate(l => setLang(l), lang);
      await p.waitForTimeout(220);
      const r = await p.evaluate(() => {
        const on = [...document.querySelectorAll('.view')].filter(v=>v.classList.contains('on')).map(v=>v.id);
        const body = document.getElementById('main').textContent;
        // Match the SHAPE of an unresolved key rather than a list of prefixes.
        // Deriving prefixes from the dictionary cannot catch a new screen whose
        // keys are missing from it - which is exactly when they render raw.
        // Every segment of a real key begins lowercase or with a digit. Prose
        // does not: textContent joins blocks with no space, so "…the app." and
        // "Turn on…" arrive as "app.Turn", which a looser pattern reads as a key.
        const KEYISH = /\b[a-z][a-zA-Z0-9]*(?:\.[a-z0-9][a-zA-Z0-9]*){1,4}\b/g;
        const NOT_A_KEY = /\.(csv|png|json|html|js|css|pdf|xlsx|com|net|org|sa)$/i;
        // an email is two key-shaped halves either side of an @, so remove them
        // from the text before looking rather than trying to exclude the halves
        const prose = body.replace(/\S+@\S+/g, ' ');
        const rawKeys = (prose.match(KEYISH)||[]).filter(k => !NOT_A_KEY.test(k));
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
  // The dashboard reduced to eight figures, but the rule it was testing holds:
  // nothing on the home screen may state a number the data cannot account for.
  // Points pending is now the figure derived from the approval queue.
  const att = await p.evaluate(() => ({
    pending:  document.getElementById('stPend')?.textContent.trim(),
    fromData: fmt(BATCHES.filter(b => b.status === 'uploaded').reduce((n,b) => n + b.points, 0)),
    navBadge: document.getElementById('navQueue')?.textContent }));
  check('overview pending figure comes from the queue',
        !!att.pending && att.pending === att.fromData && att.navBadge === '3', JSON.stringify(att));
  const jump = await p.evaluate(async () => { goTransfers('uploaded'); await new Promise(r=>setTimeout(r,300));
    return { route: location.hash, filter: TFILT.status, rows: document.querySelectorAll('#tbody-t tr, .card-row').length }; });
  check('overview -> the review queue', jump.route==='#/transfers' && jump.filter==='uploaded' && jump.rows===3, JSON.stringify(jump));
  // no failed state exists any more; nothing should be able to filter to one
  const noFailed = await p.evaluate(() => ({ inData: BATCHES.some(b => b.status === 'failed'),
                                             inMap: 'failed' in TSTAT }));
  check('no failed state anywhere', !noFailed.inData && !noFailed.inMap, JSON.stringify(noFailed));
  const fromUser = await p.evaluate(async () => { location.hash='#/users'; await new Promise(r=>setTimeout(r,300));
    const u = USERS.find(x=>x.registered); openSingleFor(u.id); await new Promise(r=>setTimeout(r,300));
    return { open: !document.getElementById('pnl').hidden,
             prefilled: document.getElementById('sgWho')?.value?.length>0 }; });
  check('user profile -> transfer with recipient set', fromUser.open && fromUser.prefilled, JSON.stringify(fromUser));
  check('no JS errors across connections', errs.length===0, errs[0]||'');

  // Switching language AFTER arriving on a route, not before. Views built in
  // JS carry no data-i18n attributes, so applyI18n cannot reach them and each
  // has to be redrawn by name - a view missing from that list keeps the old
  // language and nothing else notices.
  const AR = /[\u0600-\u06FF]/;
  for (const [route, sel] of [['user', '#view-detail .card h1'],
                              ['follower', '#view-detail .card h1'],
                              ['transfers', '#view-transfers h1'],
                              ['transactions', '#view-transactions h1'],
                              ['charges', '#view-charges h1'],
                              ['exports', '#view-exports h1'],
                              ['login', '#view-login .auth-h'],
                              ['settings', '#view-settings h1'],
                              ['releases', '#view-releases h1'],
                              ['users', '#view-list h1'],
                              ['overview', '#view-overview .card-t']]) {
    const r = await p.evaluate(async ([route, sel]) => {
      const id = route === 'user' ? USERS.find(u => u.registered).id
               : route === 'follower' ? FOLLOWERS.find(u => u.registered).id : null;
      location.hash = id ? `#/${route}/${id}` : `#/${route}`;
      await new Promise(r => setTimeout(r, 260));
      setLang('ar'); await new Promise(r => setTimeout(r, 220));
      const before = document.querySelector(sel)?.textContent.trim() || '';
      setLang('en'); await new Promise(r => setTimeout(r, 220));
      const after = document.querySelector(sel)?.textContent.trim() || '';
      // sweep the whole view, not just the heading
      const stray = [...document.querySelectorAll('.view.on *')]
        .filter(e => e.children.length === 0 && /[\u0600-\u06FF]/.test(e.textContent))
        .map(e => e.textContent.trim().slice(0, 24));
      return { before, after, stray: [...new Set(stray)].slice(0, 3) };
    }, [route, sel]);
    check(`${route.padEnd(10)} redraws on language switch`,
          !AR.test(r.after) && r.stray.length === 0,
          r.stray.length ? 'still Arabic: ' + r.stray.join(' | ') : r.after.slice(0, 30));
  }
  await p.close();
  await b.close();
  console.log(fails ? `\n${fails} FAILURE(S)` : '\nall green');
})();
