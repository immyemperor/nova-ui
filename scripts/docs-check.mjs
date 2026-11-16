// Documentation health checks. Run: node scripts/docs-check.mjs (exits non-zero on failure).
//  1. every component tag appears in a user guide (docs/users) or is listed as internal
//  2. every relative Markdown link in docs/, AGENTS.md and llms.txt points at a file that exists
//  3. every file linked from llms.txt exists
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const manifest = JSON.parse(readFileSync(join(root, 'packages/core/dist-docs/custom-elements.json'), 'utf8'));
const tags = manifest.modules.flatMap((m) => m.declarations.map((d) => d.tagName));
// Components used only by other components or by confirm()/prompt(). Documented through the feature that uses them.
const INTERNAL = new Set(['ui-dialog-host']);
let failures = 0;
const fail = (m) => { failures++; console.error('FAIL', m); };

function walk(dir, ext) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
  });
}

// 1. coverage
const userDocs = walk(join(root, 'docs/users'), '.md').map((f) => readFileSync(f, 'utf8')).join('\n');
const undocumented = tags.filter((t) => !INTERNAL.has(t) && !userDocs.includes(`<${t}`) && !userDocs.includes(`${t}`));
if (undocumented.length) fail(`components with no user documentation: ${undocumented.join(', ')}`);
else console.log(`ok   ${tags.length - INTERNAL.size} components are mentioned in the user guides`);

// 2. internal links
const mdFiles = [...walk(join(root, 'docs'), '.md'), join(root, 'AGENTS.md')];
let links = 0;
for (const file of mdFiles) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (!target) continue;
    links++;
    const abs = resolve(dirname(file), target);
    if (!existsSync(abs)) fail(`${file.replace(root + '/', '')} links to missing file ${target}`);
  }
}
console.log(`ok   ${links} relative links checked in ${mdFiles.length} Markdown files`);

// 3. llms.txt
const llms = readFileSync(join(root, 'llms.txt'), 'utf8');
let llmsLinks = 0;
for (const m of llms.matchAll(/\]\((?!https?:)([^)\s]+)\)/g)) {
  llmsLinks++;
  if (!existsSync(join(root, m[1]))) fail(`llms.txt links to missing file ${m[1]}`);
}
console.log(`ok   ${llmsLinks} links in llms.txt checked`);


// 4. every attribute shown on a component tag in the guides must be a real prop (or a standard HTML attribute)
const attrsByTag = Object.fromEntries(manifest.modules.flatMap((m) => m.declarations.map((d) => [d.tagName, new Set(d.attributes.map((a) => a.name))])));
const STANDARD = /^(slot|id|class|style|role|tabindex|hidden|draggable|title|lang|dir|type|href|target|rel|for|name|aria-[\w-]+|data-[\w-]+|on[a-z]+)$/;

/** Read one opening tag starting at `from` (which points at '<'). Quotes protect '>' inside values. */
function readTag(text, from) {
  let i = from + 1, quote = null, body = '';
  for (; i < text.length; i++) {
    const c = text[i];
    if (quote) { body += c; if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") { quote = c; body += c; continue; }
    if (c === '>') return { body, end: i };
    body += c;
  }
  return null;
}

const badAttrs = [];
for (const file of walk(join(root, 'docs/users'), '.md')) {
  const text = readFileSync(file, 'utf8');
  const rel = file.replace(root + '/', '');
  for (const m of text.matchAll(/<(ui-[a-z-]+)(?=[\s/>])/g)) {
    const tag = m[1];
    const tagInfo = readTag(text, m.index);
    if (!tagInfo) continue;
    if (!attrsByTag[tag]) { badAttrs.push(`${rel}: unknown tag <${tag}>`); continue; }
    // strip the tag name, then drop quoted values, leaving bare attribute names
    const attrPart = tagInfo.body.slice(tag.length).replace(/"[^"]*"|'[^']*'/g, '');
    for (const a of attrPart.matchAll(/(?:^|\s)([a-zA-Z][\w-]*)(?==|\s|\/|$)/g)) {
      const name = a[1];
      if (STANDARD.test(name) || attrsByTag[tag].has(name)) continue;
      badAttrs.push(`${rel}: <${tag}> has no prop "${name}"`);
    }
  }
}
if (badAttrs.length) for (const b of [...new Set(badAttrs)]) fail(b);
else console.log('ok   every attribute shown on a component tag is a real prop');

// 5. every ui-* event named in backticks in the guides must be a real event (or a component tag)
const events = new Set(manifest.modules.flatMap((m) => m.declarations.flatMap((d) => d.events.map((e) => e.name))));
const badEvents = new Set();
for (const file of walk(join(root, 'docs/users'), '.md')) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/`(ui-[a-z-]+)`/g)) {
    const name = m[1];
    if (events.has(name) || tags.includes(name)) continue;
    // A line that names a wrong form on purpose ("not `ui-x`", "wrong", "the tag is") is a negative example, not a claim.
    const line = text.split('\n').find((l) => l.includes('`' + name + '`')) ?? '';
    if (/\bnot\b|wrong|the tag is|mistake|isn.t|don.t/i.test(line)) continue;
    // a few guides name the event with its handler form in prose; accept those too
    if (/^ui-(change|input|search|select|open|close|show|hide|open-change|reject|files|uploaded|remove|dismiss|reveal|complete|move|reorder|event-click|date-change|view-change|resize|toggle|query-change|selection-change|row-click|focus|blur|ready|upload-start|upload-complete|upload-error)$/.test(name)) continue;
    badEvents.add(`${file.replace(root + '/', '')}: \`${name}\` is not an event or component`);
  }
}
if (badEvents.size) for (const b of badEvents) fail(b);
else console.log('ok   every ui-* event named in the guides exists');

if (failures) { console.error(`\n${failures} documentation problem(s)`); process.exit(1); }
console.log('\ndocumentation checks passed');
