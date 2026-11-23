// Downloads Google's complete Material Symbols Outlined font and generates one class per icon.
//   pnpm --filter @nova-ui/css icons:update
// Writes into this package: src/generated/ (CSS, names, font, licence) and docs/icons.html (browsable gallery).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const generated = join(root, 'src/generated');
const source = 'https://raw.githubusercontent.com/google/material-design-icons/master';
const codepointsUrl = `${source}/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.codepoints`;
const fontUrl = `${source}/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.woff2`;
const licenseUrl = `${source}/LICENSE`;

/** Parse Google's ".codepoints" catalogue: one "icon_name hexcodepoint" pair per line. */
export function parseCodepoints(text) {
  const entries = text.split(/\r?\n/).map((line) => line.trim().split(/\s+/))
    // Icon names are lowercase words; codepoints are 4 to 6 hex digits (a single 'a' is not one).
    .filter(([name, value]) => /^[a-z0-9_]+$/.test(name ?? '') && /^[0-9a-f]{4,6}$/i.test(value ?? ''));
  if (!entries.length) throw new Error('Google icon codepoints catalog was empty or had an unexpected format.');
  return entries;
}

/** One CSS rule per icon. The codepoint is written with a single backslash: content:"\e87d ". */
export function iconRules(entries) {
  return entries.map(([name, value]) => `.nova-icon-${name.replaceAll('_', '-')}::before{content:"\\${Number.parseInt(value, 16).toString(16)} "}`).join('\n');
}

export function buildCss(entries) {
  const rules = iconRules(entries);
  return `/* Generated from Google Material Symbols Outlined. Run pnpm --filter @nova-ui/css icons:update. */
@font-face{font-family:"Nova Material Symbols";font-style:normal;font-weight:100 700;font-display:swap;src:url("./material-symbols-outlined.woff2") format("woff2");}
@layer nova.reset, nova.tokens, nova.base, nova.layout, nova.components, nova.utilities;
@layer nova.utilities{
.nova-icon{display:inline-flex;inline-size:1em;block-size:1em;flex:none;align-items:center;justify-content:center;vertical-align:-.125em;white-space:nowrap;line-height:1;}
.nova-icon::before{font-family:"Nova Material Symbols";font-style:normal;font-weight:400;font-size:1em;line-height:1;letter-spacing:normal;text-transform:none;direction:ltr;font-feature-settings:"liga";font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;-webkit-font-smoothing:antialiased;}
.nova-icon-filled::before{font-variation-settings:"FILL" 1,"wght" 400,"GRAD" 0,"opsz" 24;}
.nova-icon-xs{font-size:.75em}.nova-icon-sm{font-size:.875em}.nova-icon-md{font-size:1em}.nova-icon-lg{font-size:1.5em}.nova-icon-xl{font-size:2em}
${rules}
}
`;
}

export function buildNames(entries) {
  return JSON.stringify(entries.map(([name]) => name)) + '\n';
}

export function buildGallery(entries) {
  const iconNames = JSON.stringify(entries.map(([name]) => name));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Material Symbols | Nova UI</title>
  <link rel="stylesheet" href="../dist/nova.min.css" />
  <link rel="stylesheet" href="../dist/icons.css" />
  <style>
    body { min-block-size: 100vh; background: var(--nova-color-bg); }
    .icon-page { max-inline-size: 82rem; margin-inline: auto; padding: var(--nova-space-6) var(--nova-gutter); }
    .icon-header { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: var(--nova-space-4); margin-block-end: var(--nova-space-5); }
    .icon-header h1 { margin: 0; font-size: var(--nova-text-2xl); }
    .icon-header p { margin: var(--nova-space-1) 0 0; color: var(--nova-color-fg-muted); }
    .icon-search { position: sticky; inset-block-start: 0; z-index: 1; padding-block: var(--nova-space-3); background: var(--nova-color-bg); }
    .icon-search input { box-sizing: border-box; inline-size: 100%; max-inline-size: 34rem; min-block-size: var(--nova-control-lg); padding-inline: var(--nova-space-3); border: 1px solid var(--nova-color-border-strong); border-radius: var(--nova-radius-control); background: var(--nova-color-surface); color: var(--nova-color-fg); font: inherit; }
    .icon-search input:focus-visible { outline: 2px solid var(--nova-color-accent); outline-offset: 2px; }
    .icon-count { min-block-size: 1.5em; margin: var(--nova-space-2) 0; color: var(--nova-color-fg-muted); font-size: var(--nova-text-sm); }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 8.5rem), 1fr)); gap: var(--nova-space-2); }
    .icon-tile { display: grid; min-block-size: 7rem; place-items: center; gap: var(--nova-space-2); padding: var(--nova-space-3); overflow-wrap: anywhere; border: 1px solid var(--nova-color-border); border-radius: var(--nova-radius-control); background: var(--nova-color-surface); color: var(--nova-color-fg); text-align: center; }
    .icon-tile .nova-icon { font-size: 1.75rem; color: var(--nova-color-accent); }
    .icon-tile code { font-size: .6875rem; color: var(--nova-color-fg-muted); }
    .icon-more { display: block; min-block-size: var(--nova-control-lg); margin: var(--nova-space-5) auto; padding-inline: var(--nova-space-4); border: 1px solid var(--nova-color-border-strong); border-radius: var(--nova-radius-control); background: var(--nova-color-surface); color: var(--nova-color-fg); font: inherit; cursor: pointer; }
    .icon-more:hover { background: var(--nova-color-surface-sunken); }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; } }
  </style>
</head>
<body class="nova-base">
  <main class="icon-page">
    <header class="icon-header">
      <div>
        <a href="./index.html" class="nova-link">Nova CSS docs</a>
        <h1>Material Symbols</h1>
        <p>Search ${entries.length.toLocaleString()} Google Material Symbols. Each tile shows the CSS class name.</p>
      </div>
      <span class="nova-badge nova-badge-accent">Outlined variable font</span>
    </header>
    <div class="icon-search">
      <label class="nova-sr-only" for="icon-filter">Search icons by name</label>
      <input id="icon-filter" type="search" placeholder="Search by name, e.g. arrow or home" autocomplete="off" />
      <p class="icon-count" id="icon-count" role="status" aria-live="polite"></p>
    </div>
    <div class="icon-grid" id="icon-grid"></div>
    <button class="icon-more" id="icon-more" type="button">Show more icons</button>
  </main>
  <script>
    const names = ${iconNames};
    const grid = document.getElementById('icon-grid');
    const filter = document.getElementById('icon-filter');
    const count = document.getElementById('icon-count');
    const more = document.getElementById('icon-more');
    const pageSize = 144;
    let matches = names;
    let shown = 0;

    function render(reset = false) {
      if (reset) {
        matches = names.filter((name) => name.includes(filter.value.trim().toLowerCase().replaceAll('-', '_')));
        grid.textContent = '';
        shown = 0;
      }
      const end = Math.min(shown + pageSize, matches.length);
      const fragment = document.createDocumentFragment();
      for (; shown < end; shown++) {
        const name = matches[shown];
        const className = name.replaceAll('_', '-');
        const tile = document.createElement('div');
        tile.className = 'icon-tile';
        const icon = document.createElement('span');
        icon.className = 'nova-icon nova-icon-' + className;
        icon.setAttribute('aria-hidden', 'true');
        const label = document.createElement('code');
        label.textContent = 'nova-icon-' + className;
        tile.append(icon, label);
        fragment.append(tile);
      }
      grid.append(fragment);
      count.textContent = matches.length ? 'Showing ' + shown.toLocaleString() + ' of ' + matches.length.toLocaleString() + ' icons' : 'No icons found';
      more.hidden = shown >= matches.length;
    }

    filter.addEventListener('input', () => render(true));
    more.addEventListener('click', () => render());
    render(true);
  </script>
</body>
</html>
`;
}

async function download(url, fetchFn) {
  const response = await fetchFn(url);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  return response;
}

/** Download, build and write everything. `fetchFn` and `outDir` can be replaced in tests. */
export async function updateMaterialIcons({ fetchFn = fetch, outDir = generated, docsDir = join(root, 'docs') } = {}) {
  mkdirSync(outDir, { recursive: true });
  const [codepointsResponse, fontResponse, licenseResponse] = await Promise.all([
    download(codepointsUrl, fetchFn), download(fontUrl, fetchFn), download(licenseUrl, fetchFn),
  ]);
  const entries = parseCodepoints(await codepointsResponse.text());
  writeFileSync(join(outDir, 'material-icons.css'), buildCss(entries));
  writeFileSync(join(outDir, 'material-icon-names.json'), buildNames(entries));
  writeFileSync(join(outDir, 'material-symbols-outlined.woff2'), Buffer.from(await fontResponse.arrayBuffer()));
  writeFileSync(join(outDir, 'MATERIAL_SYMBOLS_LICENSE.txt'), await licenseResponse.text());
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(join(docsDir, 'icons.html'), buildGallery(entries));
  return entries.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const count = await updateMaterialIcons();
  console.log(`Generated ${count} Material Symbols classes and downloaded the official WOFF2 font.`);
}
