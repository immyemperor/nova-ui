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
// source.ts is a generated snapshot of the app's own code (as a string); it is not a template to check.
const GENERATED = (f) => /\/(source|library-data)\.ts$/.test(f); // snapshots of other files, stored as strings
const angularFiles = walk(join(root, 'apps/playground-angular/src'), '.ts').filter((f) => !GENERATED(f));
let tags = 0, bindings = 0;
for (const file of angularFiles) {
  const src = readFileSync(file, 'utf8');
  const tpl = [...src.matchAll(/template:\s*`([\s\S]*?)`/g)].map((m) => m[1]).join('\n');
  for (const m of tpl.matchAll(/<(ui-[a-z-]+)((?:\s+[^\s>]+(?:="[^"]*")?)*)\s*\/?>/g)) {
    const tag = m[1];
    tags++;
    const d = decls[tag];
    if (!d && tag.startsWith('app-')) continue; // local components in the playground itself
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
  // the Material icon classes are generated from this template (nova-icon, nova-icon-<name>)
  readFileSync(join(root, 'packages/css/scripts/download-material-icons.mjs'), 'utf8'),
];
const defined = new Set(sheets.flatMap((s) => [...s.matchAll(/\.((?:nova|pg)-[\w-]+)/g)].map((m) => m[1])));
const sources = walk(join(root, 'apps'), '.tsx').concat(walk(join(root, 'apps'), '.ts'), walk(join(root, 'apps'), '.html')).filter((f) => !GENERATED(f));
const missing = new Set();
for (const f of sources) {
  for (const m of readFileSync(f, 'utf8').matchAll(/(?:className|class)=["']([^"']+)["']/g)) {
    for (const c of m[1].split(/\s+/)) {
      if (c.includes('$') || c.includes('{')) continue; // assembled at runtime; checked where it is generated
      if (/^(nova|pg)-/.test(c) && !defined.has(c)) missing.add(`${c} (${f.replace(root + '/', '')})`);
    }
  }
}
if (missing.size) for (const c of missing) fail(`class not defined: ${c}`);
else console.log('ok   every nova-* and pg-* class used in the playgrounds is defined');


// 4: the explorer lists every component exactly once, and every live example matches a component
const catalogSrc = readFileSync(join(root, 'apps/shared/react/explorer/catalog.ts'), 'utf8');
const catalogTags = [...catalogSrc.matchAll(/'(ui-[\w-]+)'/g)].map((m) => m[1]);
const manifestTags = Object.keys(decls);
const notListed = manifestTags.filter((t) => !catalogTags.includes(t));
const unknownInCatalog = [...new Set(catalogTags.filter((t) => !manifestTags.includes(t)))];
const duplicated = [...new Set(catalogTags.filter((t, i) => catalogTags.indexOf(t) !== i))];
if (notListed.length) fail(`explorer does not list: ${notListed.join(', ')}`);
if (unknownInCatalog.length) fail(`explorer lists unknown components: ${unknownInCatalog.join(', ')}`);
if (duplicated.length) fail(`explorer lists more than once: ${duplicated.join(', ')}`);
if (!notListed.length && !unknownInCatalog.length && !duplicated.length) console.log(`ok   explorer lists all ${manifestTags.length} components, each once`);

const examplesSrc = readFileSync(join(root, 'apps/shared/react/explorer/examples.tsx'), 'utf8');
const markers = [...examplesSrc.matchAll(/\/\/ @example (ui-[\w-]+)/g)].map((m) => m[1]);
const mapKeys = [...examplesSrc.slice(examplesSrc.indexOf('export const EXAMPLES')).matchAll(/'(ui-[\w-]+)':/g)].map((m) => m[1]);
const noMarker = mapKeys.filter((k) => !markers.includes(k));
const noMapEntry = markers.filter((k) => !mapKeys.includes(k));
const badExample = markers.filter((k) => !manifestTags.includes(k));
if (noMarker.length) fail(`live examples without a source marker: ${noMarker.join(', ')}`);
if (noMapEntry.length) fail(`source blocks not registered in EXAMPLES: ${noMapEntry.join(', ')}`);
if (badExample.length) fail(`examples for unknown components: ${badExample.join(', ')}`);
if (!noMarker.length && !noMapEntry.length && !badExample.length) console.log(`ok   ${markers.length} live examples match their source blocks and components`);


// 5: Angular examples: each class in ANGULAR_EXAMPLES has a source marker, and each marker is registered
const angularExamplesSrc = readFileSync(join(root, 'apps/playground-angular/src/app/explorer/examples.ts'), 'utf8');
const angularMarkers = [...angularExamplesSrc.matchAll(/\/\/ @example (ui-[\w-]+)/g)].map((m) => m[1]);
const angularKeys = [...angularExamplesSrc.slice(angularExamplesSrc.indexOf('export const ANGULAR_EXAMPLES')).matchAll(/'(ui-[\w-]+)':/g)].map((m) => m[1]);
const angularNoMarker = angularKeys.filter((k) => !angularMarkers.includes(k));
const angularNoEntry = angularMarkers.filter((k) => !angularKeys.includes(k));
const angularBad = angularMarkers.filter((k) => !manifestTags.includes(k));
if (angularNoMarker.length) fail(`Angular examples without a source marker: ${angularNoMarker.join(', ')}`);
if (angularNoEntry.length) fail(`Angular source blocks not registered in ANGULAR_EXAMPLES: ${angularNoEntry.join(', ')}`);
if (angularBad.length) fail(`Angular examples for unknown components: ${angularBad.join(', ')}`);
if (!angularNoMarker.length && !angularNoEntry.length && !angularBad.length) console.log(`ok   ${angularMarkers.length} Angular live examples match their source blocks and components`);

if (failures) { console.error(`\n${failures} playground problem(s)`); process.exit(1); }
console.log('\nplayground checks passed');
