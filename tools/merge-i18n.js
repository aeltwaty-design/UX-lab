/* Replace the transfers.* block of the inlined dictionary with the copy file,
   rather than merging into it. A merge only ever adds, so a string deleted
   from the copy file lived on in the page forever. */
const fs = require('fs');
const p = 'preview/app.html';
let h = fs.readFileSync(p, 'utf8');
const start = h.indexOf('const I18N = {');
const end = h.indexOf('\n\nlet LANG = ', start);
if (start < 0 || end < 0) { console.error('I18N block not found'); process.exit(1); }
const I18N = eval('(' + h.slice(start + 'const I18N = '.length, end).replace(/;\s*$/, '') + ')');
const tr = JSON.parse(fs.readFileSync('src/i18n/transfers.json', 'utf8'));
let removed = 0, added = 0;
for (const lang of ['en', 'ar']) {
  for (const k of Object.keys(I18N[lang])) if (k.startsWith('transfers.') && !(k in tr[lang])) {
    delete I18N[lang][k]; removed++;
  }
  for (const [k, v] of Object.entries(tr[lang])) { if (I18N[lang][k] !== v) added++; I18N[lang][k] = v; }
}
h = h.slice(0, start) + 'const I18N = ' + JSON.stringify(I18N, null, 2) + ';' + h.slice(end);
fs.writeFileSync(p, h);
console.log(`merged: ${added} written, ${removed} stale removed; en=${Object.keys(I18N.en).length} ar=${Object.keys(I18N.ar).length}`);
