// Fails if any component @Prop or @Method shares a name with a built-in DOM member.
// Such names are rejected by Stencil, or silently shadow native behaviour (Element.prefix, Element.getHTML() ...).
// Needs Playwright with Chromium; skips with a notice when it isn't installed.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.log('SKIP check-prop-names: Playwright is not installed.'); process.exit(0); }

const found = [];
for (const pkg of ['core', 'editor']) {
  const dir = join(root, 'packages', pkg, 'src/components');
  for (const d of readdirSync(dir)) {
    for (const f of readdirSync(join(dir, d)).filter((x) => x.endsWith('.tsx'))) {
      const src = readFileSync(join(dir, d, f), 'utf8');
      for (const m of src.matchAll(/@(Prop|Method)\((?:\{[^}]*\})?\)\s+(?:async\s+)?(\w+)/g)) found.push([d, m[2], m[1]]);
    }
  }
}
const browser = await chromium.launch();
const page = await browser.newPage();
const hits = await page.evaluate((found) => found.filter(([, name]) => name in HTMLElement.prototype), found);
await browser.close();
console.log(`checked ${found.length} @Prop/@Method names against HTMLElement.prototype`);
if (hits.length) { console.error('CONFLICTS:\n' + hits.map(([c, n, k]) => `  ${c}: @${k} ${n}`).join('\n')); process.exit(1); }
console.log('no conflicts');
