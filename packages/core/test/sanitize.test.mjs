// Security tests for the HTML sanitiser. Run: node --test test/sanitize.test.mjs
// The sanitiser uses DOMParser, so it runs inside a real browser (Playwright + Chromium).
// The tests are registered synchronously and share one browser, closed after the last one.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// const here = dirname(fileURLToPath(import.meta.url));
// const require = createRequire(import.meta.url);

// let chromium;
// try { ({ chromium } = require('playwright')); }
// catch {
//   try { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }
//   catch { console.log('SKIP sanitize tests: Playwright is not installed.'); process.exit(0); }
// }
// const ts = (() => { try { return require('typescript'); } catch { return require('/opt/npm-tools/node_modules/typescript'); } })();

// const code = ts.transpileModule(readFileSync(join(here, '..', 'src', 'utils', 'sanitize.ts'), 'utf8'), {
//   compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
// }).outputText;

// let browser, page;
// before(async () => {
//   browser = await chromium.launch();
//   page = await browser.newPage();
//   await page.setContent('<!doctype html><html><body></body></html>');
//   // Load the same code the component ships, into the page's real DOM.
//   await page.evaluate((src) => {
//     const module = { exports: {} };
//     new Function('module', 'exports', 'require', src)(module, module.exports, () => ({}));
//     window.__sanitize = module.exports;
//   }, code);
// });
// after(async () => { await browser?.close(); });

// const clean = (html) => page.evaluate((html) => window.__sanitize.sanitizeHTML(html), html);
// const pureRules = (() => {
//   const m = { exports: {} };
//   new Function('module', 'exports', 'require', code)(m, m.exports, require);
//   return m.exports;
// })();

// test('removes script tags together with their contents', async () => {
//   assert.equal(await clean('<p>hi</p><script>alert(1)</script>'), '<p>hi</p>');
// });

// test('removes event-handler attributes from allowed elements', async () => {
//   const out = await clean('<img src="https://x.test/a.png" onerror="alert(1)"><a href="https://x.test" onclick="steal()">go</a>');
//   assert.ok(!/onerror|onclick/i.test(out), out);
//   assert.ok(out.includes('https://x.test/a.png'), out);
// });

// test('blocks javascript: and data:text/html in links and images', async () => {
//   const out = await clean('<a href="javascript:alert(1)">a</a><a href="JaVaScRiPt:alert(2)">b</a><img src="data:text/html,<script>x</script>">');
//   assert.ok(!/javascript:/i.test(out), out);
//   assert.ok(!/data:text\/html/i.test(out), out);
// });

// test('blocks whitespace and control-character tricks in URLs', async () => {
//   const out = await clean('<a href="java\tscript:alert(1)">x</a><a href=" \u0001javascript:alert(1)">y</a>');
//   assert.ok(!/javascript/i.test(out), out);
// });

// test('allows base64 PNG data URLs but not SVG', async () => {
//   assert.ok((await clean('<img src="data:image/png;base64,iVBORw0KGgo=">')).includes('data:image/png'));
//   const svg = await clean('<img src="data:image/svg+xml;base64,PHN2Zz4=">');
//   assert.ok(!svg.includes('svg+xml'), svg);
// });

// test('drops forms, iframes, objects and embedded SVG with their contents', async () => {
//   const out = await clean('<form action="/x"><input name="a"></form><iframe src="https://evil.test"></iframe><object data="x"></object><svg><script>alert(1)</script></svg><p>ok</p>');
//   assert.equal(out, '<p>ok</p>');
// });

// test('unwraps unknown tags but keeps their text', async () => {
//   assert.equal(await clean('<marquee>moving <blink>text</blink></marquee>'), 'moving text');
// });

// test('strips HTML comments', async () => {
//   assert.equal(await clean('<p>a<!-- <script>x</script> -->b</p>'), '<p>ab</p>');
// });

// test('keeps safe formatting intact', async () => {
//   const safe = '<h2>Title</h2><p><strong>bold</strong> and <a href="https://x.test">link</a></p><ul><li>one</li></ul>';
//   assert.equal(await clean(safe), safe);
// });

// test('forces noopener on target=_blank links', async () => {
//   const out = await clean('<a href="https://x.test" target="_blank">x</a>');
//   assert.ok(out.includes('rel="noopener noreferrer"'), out);
// });

// test('pure URL rules agree with the sanitiser', () => {
//   assert.equal(pureRules.isSafeLink('https://a.test'), true);
//   assert.equal(pureRules.isSafeLink('/relative'), true);
//   assert.equal(pureRules.isSafeLink('javascript:x'), false);
//   assert.equal(pureRules.isSafeImage('data:image/gif;base64,R0lGOD=='), true);
//   assert.equal(pureRules.isSafeImage('javascript:x'), false);
// });
