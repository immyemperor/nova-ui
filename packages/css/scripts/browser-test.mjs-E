// Real-browser layout tests against docs/index.html.
//   node scripts/browser-test.mjs            test dist/kvui.min.css
//   node scripts/browser-test.mjs --compat   test dist/kvui.compat.css (no cascade layers)
//   node scripts/browser-test.mjs --shots out/   also save screenshots
// Needs Playwright with a Chromium browser:  pnpm add -D playwright && npx playwright install chromium
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const compat = process.argv.includes('--compat');
const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('SKIP browser tests: Playwright is not installed (pnpm add -D playwright && npx playwright install chromium).');
  process.exit(0);
}

// For --compat, test a copy of the page that links the unlayered stylesheet.
const docsHtml = readFileSync(join(root, 'docs/index.html'), 'utf8');
const pagePath = join(root, 'docs', compat ? '.compat-test.html' : 'index.html');
if (compat) writeFileSync(pagePath, docsHtml.replace('../dist/kvui.min.css', '../dist/kvui.compat.css'));
const URL = pathToFileURL(pagePath).href;
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

let fails = 0;
const check = (cond, msg) => { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) fails++; };

const browser = await chromium.launch();
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL);
  console.log(`# ${compat ? 'compat (no layers)' : 'layered'} build, Chromium ${browser.version()}`);

  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(bg !== 'rgba(0, 0, 0, 0)', `stylesheet applied (body background ${bg})`);

  // 1. No horizontal page overflow at any width
  for (const w of [320, 360, 390, 600, 768, 1024, 1280, 1536, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    check(r.sw <= r.iw, `${String(w).padStart(4)}px: no horizontal overflow (scrollWidth ${r.sw})`);
  }

  // 2. App shell reflow
  const shell = async (w) => { await page.setViewportSize({ width: w, height: 900 }); return page.evaluate(() => { const s = document.querySelector('.kvui-shell__sidebar'), m = document.querySelector('.kvui-shell__main'); return { d: getComputedStyle(s).display, sr: s.getBoundingClientRect().right, ml: m.getBoundingClientRect().left }; }); };
  check((await shell(390)).d === 'none', 'phone: sidebar hidden, menu button used instead');
  const t = await shell(1024);
  check(t.d !== 'none' && t.sr <= t.ml + 1, 'tablet+: sidebar is a column beside main');

  // 3. Visibility utilities: exactly one breakpoint badge per width
  for (const [w, want] of [[390, 'base'], [700, 'sm'], [800, 'md'], [1100, 'lg'], [1300, 'xl'], [1600, '2xl']]) {
    await page.setViewportSize({ width: w, height: 900 });
    const shown = await page.evaluate(() => [...document.querySelectorAll('header .kvui-badge-accent')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.textContent.trim()));
    check(shown.length === 1 && shown[0] === want, `${w}px shows only the "${want}" badge`);
  }

  // 4. Intrinsic primitives and container queries respond to their own width
  await page.setViewportSize({ width: 1280, height: 900 });
  const cols = (sel, w) => page.evaluate(([sel, w]) => { document.querySelector(sel).closest('.doc-resizable').style.width = w + 'px'; return getComputedStyle(document.querySelector(sel)).gridTemplateColumns.split(' ').length; }, [sel, w]);
  const [a1, a2] = [await cols('.kvui-grid-auto-sm', 300), await cols('.kvui-grid-auto-sm', 720)];
  check(a1 === 1 && a2 >= 3, `kvui-grid-auto: ${a1} column at 300px, ${a2} at 720px`);
  const cq = (w) => page.evaluate((w) => { const g = document.querySelector('.kvui-cq .kvui-d-grid'); g.closest('.doc-resizable').style.width = w + 'px'; return getComputedStyle(g).gridTemplateColumns.split(' ').length; }, w);
  const [q1, q2, q3] = [await cq(300), await cq(560), await cq(820)];
  check(q1 === 1 && q2 === 2 && q3 === 3, `container queries: ${q1}/${q2}/${q3} columns at 300/560/820px container`);
  const stacked = (sel, w) => page.evaluate(([sel, w]) => { const r = document.querySelector(sel); r.closest('.doc-resizable').style.width = w + 'px'; const [x, y] = [...r.children].map((c) => c.getBoundingClientRect()); return y.top > x.bottom - 1; }, [sel, w]);
  check((await stacked('.kvui-sidebar', 330)) && !(await stacked('.kvui-sidebar', 760)), 'kvui-sidebar stacks when narrow, sits beside when wide');
  check((await stacked('.kvui-switcher', 360)) && !(await stacked('.kvui-switcher', 800)), 'kvui-switcher is a column when narrow, a row when wide');

  // 5. 12-column grid follows the viewport
  const span = async (w) => { await page.setViewportSize({ width: w, height: 900 }); return page.evaluate(() => { const k = document.querySelector('.kvui-grid > .kvui-col-12'); return Math.round((k.getBoundingClientRect().width / k.parentElement.getBoundingClientRect().width) * 100); }); };
  const [p1, p2] = [await span(390), await span(1024)];
  check(p1 > 95 && p2 > 60 && p2 < 70, `kvui-col-12 kvui-md-col-8: ${p1}% on a phone, ${p2}% from md`);

  // 6. Stacked table
  await page.setViewportSize({ width: 390, height: 900 });
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.kvui-table-stack td')).display === 'flex'), 'table-stack: rows become labelled cards on phones');
  await page.setViewportSize({ width: 1024, height: 900 });
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.kvui-table-stack td')).display === 'table-cell'), 'table-stack: normal table on desktop');

  // 7. Regressions: settings must not leak into nested primitives
  const leak = await page.evaluate(() => {
    const mk = (html) => { const d = document.createElement('div'); d.innerHTML = html; document.body.appendChild(d); return d; };
    const big = mk('<div class="kvui-stack kvui-stack-xl"><div class="kvui-cluster" id="a"><i>x</i><i>y</i></div></div>');
    const explicit = mk('<div style="--kvui-gap: 40px"><div class="kvui-cluster" id="b"><i>x</i><i>y</i></div></div>');
    const out = { viaModifier: getComputedStyle(big.querySelector('#a')).columnGap, viaVariable: getComputedStyle(explicit.querySelector('#b')).columnGap };
    big.remove(); explicit.remove();
    return out;
  });
  check(leak.viaModifier === '12px', `kvui-stack-xl does not change a nested cluster's gap (${leak.viaModifier})`);
  check(leak.viaVariable === '12px', `an explicit --kvui-gap on a parent does not leak to a nested cluster (${leak.viaVariable})`);

  // 8. Motion, hidden attribute, hover
  await page.emulateMedia({ reducedMotion: 'reduce' });
  check(parseFloat(await page.evaluate(() => getComputedStyle(document.querySelector('.kvui-btn')).transitionDuration)) < 0.001, 'prefers-reduced-motion shortens transitions');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  check(await page.evaluate(() => { const d = document.createElement('div'); d.className = 'kvui-d-flex'; d.hidden = true; document.body.appendChild(d); const v = getComputedStyle(d).display; d.remove(); return v === 'none'; }), '[hidden] beats a display utility');
  const ghost = page.locator('#theme-toggle');
  await page.mouse.move(0, 0);
  const rest = await ghost.evaluate((e) => getComputedStyle(e).backgroundColor);
  await ghost.hover();
  await page.waitForTimeout(300); // let the 120ms background transition finish before reading the colour
  const hover = await ghost.evaluate((e) => getComputedStyle(e).backgroundColor);
  check(rest === 'rgba(0, 0, 0, 0)' && hover !== rest, `ghost button is transparent at rest and tinted on hover (${rest} -> ${hover})`);

  // 9. Overrides: your unlayered CSS must beat the library, with no !important (layered build only)
  if (!compat) {
    const win = await page.evaluate(() => { const s = document.createElement('style'); s.textContent = '.kvui-btn{border-radius:99px}'; document.head.appendChild(s); const r = getComputedStyle(document.querySelector('.kvui-btn')).borderRadius; s.remove(); return r; });
    check(win === '99px', `unlayered author CSS overrides a component without !important (${win})`);
  }

  // 9b. Focus indicators: the reset ring covers plain elements but must not double up on web-component hosts
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => {
    if (!customElements.get('x-focus-host')) {
      customElements.define('x-focus-host', class extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:block;outline:none}:host(:focus-visible){background:#e1f3ef}</style>host'; }
      });
    }
    const box = document.createElement('div');
    box.id = 'focus-fixture';
    box.innerHTML = '<button id="fx-sentinel">s</button><button id="fx-plain">plain</button><x-focus-host id="fx-third" tabindex="0"></x-focus-host><x-focus-host id="fx-kvui" class="hydrated" tabindex="0"></x-focus-host>';
    document.body.prepend(box);
    document.getElementById('fx-sentinel').focus();
  });
  const outlineAfterTab = async (id) => { await page.keyboard.press('Tab'); return page.evaluate((id) => { const e = document.getElementById(id); return { on: document.activeElement === e, outline: getComputedStyle(e).outlineStyle }; }, id); };
  const fxPlain = await outlineAfterTab('fx-plain');
  const fxThird = await outlineAfterTab('fx-third');
  const fxKvui = await outlineAfterTab('fx-kvui');
  check(fxPlain.on && fxPlain.outline === 'solid', 'keyboard focus on a plain button shows the reset ring');
  check(fxThird.on && fxThird.outline === 'solid', 'a third-party custom element still gets the ring');
  check(fxKvui.on && fxKvui.outline === 'none', `a .hydrated Kvui host does not get a second outline on top of its own (${fxKvui.outline})`);
  await page.evaluate(() => document.getElementById('focus-fixture').remove());

  // 10. Theme toggle + live contrast table
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.click('#theme-toggle');
  const dark = await page.evaluate(() => ({ t: document.documentElement.dataset.theme, f: document.querySelectorAll('#contrast .kvui-badge-danger').length, p: document.querySelectorAll('#contrast .kvui-badge-success').length }));
  check(dark.f === 0 && dark.p >= 10, `theme "${dark.t}": contrast table ${dark.p} pass / ${dark.f} fail`);
  if (shotsDir) await page.screenshot({ path: join(shotsDir, 'dark-1280.png') });
  await page.click('#theme-toggle');
  check((await page.evaluate(() => document.querySelectorAll('#contrast .kvui-badge-danger').length)) === 0, 'light theme: contrast table has 0 failures');

  if (shotsDir) {
    for (const w of [390, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.mouse.move(0, 0);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: join(shotsDir, `top-${w}.png`) });
      for (const id of ['grids', 'primitives', 'components']) {
        await page.evaluate(() => (document.querySelector('header').style.position = 'static'));
        await page.locator('#' + id).screenshot({ path: join(shotsDir, `${id}-${w}.png`) });
      }
    }
  }
  check(errors.length === 0, `no console or page errors ${errors.length ? JSON.stringify(errors.slice(0, 2)) : ''}`);
} finally {
  await browser.close();
  if (compat) rmSync(pagePath, { force: true });
}
console.log(fails ? `\n${fails} FAILED` : '\nall browser checks passed');
process.exit(fails ? 1 : 0);
