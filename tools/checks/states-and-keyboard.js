const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless:false,
    executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--headless=new','--no-sandbox'] });
  const p = await b.newPage({ viewport:{ width:1440, height:1000 } });
  await p.route('**://**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/UX-lab/preview/app.html#/transfers', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(200);

  console.log('--- four states ---');
  for (const st of ['normal','loading','empty','error']) {
    const r = await p.evaluate(s => { setState(s); return {
      load:  !!document.querySelector('#view-transfers .s-load')?.offsetParent,
      err:   !!document.querySelector('#view-transfers .s-err')?.offsetParent,
      empty: !!document.querySelector('#view-transfers .s-empty')?.offsetParent,
      real:  !!document.querySelector('#view-transfers .s-real')?.offsetParent,
    }; }, st);
    const on = Object.entries(r).filter(([,v])=>v).map(([k])=>k);
    console.log(`  ${st.padEnd(8)} showing: ${on.join(',') || 'NOTHING'} ${on.length===1?'✓':'❌ expected exactly one'}`);
  }
  await p.evaluate(() => setState('normal'));

  console.log('--- keyboard in the drawer ---');
  const kb = await p.evaluate(async () => {
    const out = {};
    const before = document.querySelector('#tbody-t tr button.act');
    before.focus();
    out.openerWas = document.activeElement.className.slice(0,20);
    openReject('BCH-1041');
    await new Promise(r=>setTimeout(r,200));
    out.focusAfterOpen = document.activeElement.id || document.activeElement.tagName;
    out.focusIsInPanel = document.getElementById('pnl').contains(document.activeElement);
    // escape steps back / closes
    document.dispatchEvent(new KeyboardEvent('keydown', { key:'Escape', bubbles:true }));
    await new Promise(r=>setTimeout(r,300));
    out.panelHiddenAfterEsc = document.getElementById('pnl').hidden;
    out.focusReturned = document.activeElement.className.slice(0,20);
    return out;
  });
  console.log(' ', JSON.stringify(kb, null, 1).replace(/\n/g,'\n  '));

  console.log('--- stacked panels + back ---');
  const stack = await p.evaluate(async () => {
    closePanel(); await new Promise(r=>setTimeout(r,250));
    openViewer('BCH-1041','invalid'); await new Promise(r=>setTimeout(r,200));
    const a = { title: document.getElementById('pnlTitle').textContent, back: !document.getElementById('pnlBackBtn').hidden };
    openReject('BCH-1041'); await new Promise(r=>setTimeout(r,200));
    const b = { title: document.getElementById('pnlTitle').textContent, back: !document.getElementById('pnlBackBtn').hidden };
    panelBack(); await new Promise(r=>setTimeout(r,200));
    const c = { title: document.getElementById('pnlTitle').textContent, back: !document.getElementById('pnlBackBtn').hidden,
                rows: document.querySelectorAll('.vw-tbl tbody tr').length };
    return { first:a, second:b, afterBack:c };
  });
  console.log(' ', JSON.stringify(stack));

  console.log('--- reject requires a reason ---');
  const rj = await p.evaluate(async () => {
    closePanel(); await new Promise(r=>setTimeout(r,250));
    const wasStatus = batchById('BCH-1040').status;
    openReject('BCH-1040'); await new Promise(r=>setTimeout(r,150));
    doReject('BCH-1040');                       // empty reason
    const blocked = batchById('BCH-1040').status === wasStatus;
    const errShown = !document.getElementById('rjErr').hidden;
    document.getElementById('rjReason').value = 'Duplicates need clearing first.';
    doReject('BCH-1040'); await new Promise(r=>setTimeout(r,200));
    return { blockedWhenEmpty: blocked, errorShown: errShown,
             statusAfter: batchById('BCH-1040').status,
             reasonKept: batchById('BCH-1040').reason?.en };
  });
  console.log(' ', JSON.stringify(rj));

  console.log('--- errors ---', errs.length ? errs.join('\n') : '(none)');
  await b.close();
})();
