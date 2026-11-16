// Static checks for the playgrounds, for frameworks we can't compile here (Angular, Next.js on the server).
//  1. every element tag used in an Angular template is a real Nova component (or a standard HTML element)
//  2. every bound input and output on a Nova tag is a real prop or event, in Angular's naming
//  3. every nova-* / pg-* class used in any playground is defined in the stylesheets
// Run: node scripts/playground-check.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const manifest = JSON.parse(readFileSync(join(root, 'packages/core/dist-docs/custom-elements.json'), 'utf8'));
const decls = Object.fromEntries(manifest.modules.flatMap((m) => m.declarations.map((d) => [d.tagName, d])));
let failures = 0;
const fail = (m) => { failures++; console.error('FAIL', m); };
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const camelFromKebab = (s) => s.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
const DOM_EVENTS = new Set(['click', 'dblclick', 'keydown', 'keyup', 'keypress', 'input', 'change', 'focus', 'blur', 'submit', 'pointerdown', 'pointermove', 'pointerup', 'mouseenter', 'mouseleave', 'scroll', 'dragstart', 'dragover', 'drop']);
const STANDARD = new Set(['slot', 'id', 'class', 'style', 'role', 'tabindex', 'hidden', 'title', 'aria-label', 'name', 'type', 'href', 'label']);

function walk(dir, ext) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (f === 'node_modules' || f === '.next' || f === 'dist') return [];
    return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
  });
}

// 1 + 2: Angular templates (inline `template:` strings in .ts files)
const angularFiles = walk(join(root, 'apps/playground-angular/src'), '.ts');
let tags = 0, bindings = 0;
for (const file of angularFiles) {
  const src = readFileSync(file, 'utf8');
  const tpl = [...src.matchAll(/template:\s*`([\s\S]*?)`/g)].map((m) => m[1]).join('\n');
  for (const m of tpl.matchAll(/<(ui-[a-z-]+)((?:\s+[^\s>]+(?:="[^"]*")?)*)\s*\/?>/g)) {
    const tag = m[1];
    tags++;
    const d = decls[tag];
    if (!d) { fail(`${file.replace(root + '/', '')}: <${tag}> is not a Nova component`); continue; }
    const props = new Set(d.attributes.map((a) => a.name));
    const events = new Set(d.events.map((e) => e.name));
    for (const a of m[2].matchAll(/\s+(\[?\(?)([\w-]+)(\]?\)?)(?:="[^"]*")?/g)) {
      const [, open, raw] = a;
      if (open === '(') {
        bindings++;
        // Angular output (uiChange) maps to the DOM event ui-change
        const dom = kebab(raw);
        if (DOM_EVENTS.has(raw)) continue; // native DOM event, valid on any element
        if (!events.has(dom)) fail(`${file.replace(root + '/', '')}: <${tag}> has no event "${raw}" (expected ${dom})`);
      } else {
        bindings++;
        const name = raw;
        const kebabName = kebab(name);
        if (STANDARD.has(kebabName) || props.has(kebabName)) continue;
        fail(`${file.replace(root + '/', '')}: <${tag}> has no prop "${name}"`);
      }
    }
  }
}
console.log(`ok   ${tags} Angular component tags and ${bindings} bindings checked`);

// 3: classes used in playgrounds exist in a stylesheet
const sheets = [
  readFileSync(join(root, 'packages/css/dist/nova.css'), 'utf8'),
  ...walk(join(root, 'apps'), '.css').map((f) => readFileSync(f, 'utf8')),
];
const defined = new Set(sheets.flatMap((s) => [...s.matchAll(/\.((?:nova|pg)-[\w-]+)/g)].map((m) => m[1])));
const sources = walk(join(root, 'apps'), '.tsx').concat(walk(join(root, 'apps'), '.ts'), walk(join(root, 'apps'), '.html'));
const missing = new Set();
for (const f of sources) {
  for (const m of readFileSync(f, 'utf8').matchAll(/(?:className|class)=["']([^"']+)["']/g)) {
    for (const c of m[1].split(/\s+/)) if (/^(nova|pg)-/.test(c) && !defined.has(c)) missing.add(`${c} (${f.replace(root + '/', '')})`);
  }
}
if (missing.size) for (const c of missing) fail(`class not defined: ${c}`);
else console.log('ok   every nova-* and pg-* class used in the playgrounds is defined');

if (failures) { console.error(`\n${failures} playground problem(s)`); process.exit(1); }
console.log('\nplayground checks passed');
