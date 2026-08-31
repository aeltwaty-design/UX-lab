/* Sync the page's inlined dictionary from the copy files.
   content.json is nested and flattens to dotted keys; the side files are
   already flat. Replaces rather than merges for transfers.*, so a string
   deleted from the copy file does not live on in the page forever, and
   reports any page key no source covers. */
const fs = require('fs');
const flat = (o, pre = '', out = {}) => {
  for (const [k, v] of Object.entries(o))
    v && typeof v === 'object' ? flat(v, pre + k + '.', out) : (out[pre + k] = v);
  return out;
};
const SOURCES = ['content.json', 'users-extra.json', 'users-filters.json', 'followers.json',
                 'transfers.json', 'transactions.json', 'chargehistory.json',
                 'exports.json', 'login.json', 'settings.json', 'releases.json', 'a11y.json', 'quickaccess.json', 'edits-batch.json', 'riyal.json'];
// prefixes whose page keys are replaced wholesale, so a deleted string really goes
const OWNED = ['transfers.', 'transactions.', 'charge.', 'exports.', 'login.', 'otp.', 'settings.', 'releases.', 'quick.', 'home.'];
const src = { en: {}, ar: {} };
for (const f of SOURCES) {
  const raw = JSON.parse(fs.readFileSync('src/i18n/' + f, 'utf8'));
  for (const lang of ['en', 'ar']) Object.assign(src[lang], flat(raw[lang] || {}));
}
const p = 'preview/app.html';
let h = fs.readFileSync(p, 'utf8');
const start = h.indexOf('const I18N = {');
const end = h.indexOf('\n\nlet LANG = ', start);
if (start < 0 || end < 0) { console.error('I18N block not found'); process.exit(1); }
const I18N = eval('(' + h.slice(start + 'const I18N = '.length, end).replace(/;\s*$/, '') + ')');

let written = 0, removed = 0;
for (const lang of ['en', 'ar']) {
  for (const k of Object.keys(I18N[lang]))
    if (OWNED.some(o => k.startsWith(o)) && !(k in src[lang])) { delete I18N[lang][k]; removed++; }
  for (const [k, v] of Object.entries(src[lang])) { if (I18N[lang][k] !== v) written++; I18N[lang][k] = v; }
}
// Page keys with no source, split into two kinds. An alias - the same string
// living in the copy file under a different name - is the dangerous one: a
// writer edits the copy file, the page reads its own copy, and the change
// silently never appears. That is how a rename lands on a dead key.
const orphans = Object.keys(I18N.en).filter(k => !(k in src.en));
const byValue = new Map();
for (const [k, v] of Object.entries(src.en)) if (!byValue.has(v)) byValue.set(v, k);
const aliases = orphans.filter(k => byValue.has(I18N.en[k]))
                       .map(k => `${k} <- ${byValue.get(I18N.en[k])}`);
const unsourced = orphans.filter(k => !byValue.has(I18N.en[k]));
// a dead key nothing reads is safe to drop; anything the code still names stays
const codeOnly = h.slice(0, start) + h.slice(end);
const dead = unsourced.filter(k => !codeOnly.includes(k));
for (const k of dead) { delete I18N.en[k]; delete I18N.ar[k]; }
h = h.slice(0, start) + 'const I18N = ' + JSON.stringify(I18N, null, 2) + ';' + h.slice(end);
fs.writeFileSync(p, h);
console.log(`merged: ${written} written, ${removed} stale removed; en=${Object.keys(I18N.en).length}`);
if (dead.length) console.log(`dropped ${dead.length} dead page keys nothing reads`);
if (aliases.length) {
  console.log(`\nALIASES - ${aliases.length} page keys hold a string the copy file has under another name.`);
  console.log('An edit to the copy file will NOT reach the page for any of these:');
  aliases.slice(0, 20).forEach(a => console.log('  ' + a));
  if (aliases.length > 20) console.log(`  …and ${aliases.length - 20} more`);
}
