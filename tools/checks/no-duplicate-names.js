/* Every top-level function and const in the page must be declared once.
   The file is assembled from many spliced modules, so a name reused across
   two of them silently replaces the earlier one - which is how the Users
   profile lost its tab switcher to a settings preview toggle of the same
   name, with nothing failing and nothing to see until someone clicked. */
const fs = require('fs');
const html = fs.readFileSync('preview/app.html', 'utf8');
const a = html.indexOf('const I18N = {');
const b = html.indexOf('\n\nlet LANG = ', a);
const code = html.slice(0, a) + html.slice(b);      // skip the dictionary

const seen = new Map();
const re = /^(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/gm;
let m;
while ((m = re.exec(code))) {
  const name = m[1] || m[2];
  const line = code.slice(0, m.index).split('\n').length;
  if (!seen.has(name)) seen.set(name, []);
  seen.get(name).push(line);
}
const dupes = [...seen].filter(([, lines]) => lines.length > 1);
if (!dupes.length) { console.log(`✓ ${seen.size} top-level names, all declared once`); process.exit(0); }
console.log(`❌ ${dupes.length} name(s) declared more than once — the later one wins and the earlier is gone:`);
for (const [name, lines] of dupes) console.log(`   ${name}  at lines ${lines.join(', ')}`);
process.exit(1);
