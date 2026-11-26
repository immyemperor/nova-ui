# Icons

`<ui-icon>` draws icons from one of two sets:

- **Kvui** (default): about 70 built-in line icons drawn as SVG. No font needed.
- **Material**: Google's [Material Symbols](https://fonts.google.com/icons), drawn with the Material font. Kvui names are mapped to Material names automatically, so every component works in either set.

## Load the Material font (once)

Add this to your page's `<head>`. It's the same font your app loads from Google Fonts:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
```

Skip this if you use only the Kvui set.

## Offline: bundled Material icons

Instead of the Google link, `@kvui/css` can ship the Material Symbols font itself. A maintainer runs this once, and rebuilds:

```bash
pnpm --filter @kvui/css icons:update
pnpm --filter @kvui/css build
```

Then load the generated stylesheet and use the `kvui-icon` classes (no network needed):

```html
<link rel="stylesheet" href="/node_modules/@kvui/css/icons.css" />
<span class="kvui-icon kvui-icon-home" aria-hidden="true"></span>
<span class="kvui-icon kvui-icon-star kvui-icon-filled kvui-icon-lg"></span>
```

Sizes: `kvui-icon-xs`, `-sm`, `-md`, `-lg`, `-xl`. The icon names are listed in `@kvui/css/material-icon-names.json`. The official licence is copied alongside the font.

## Choose the set

```js
import { setIconLibrary } from '@kvui/core';

setIconLibrary('material'); // every <ui-icon> on the page switches; icons redraw automatically
setIconLibrary('kvui');
```

A single icon can override the page setting:

```html
<ui-icon name="check" library="material"></ui-icon>
<ui-icon name="check" library="kvui"></ui-icon>
```

Read the current setting with `getIconLibrary()`. Listen for changes with `onIconLibraryChange(fn)`.

## Use icons

```html
<ui-icon name="check"></ui-icon>
<ui-icon name="chevron-down" size="1.25rem"></ui-icon>
<ui-icon name="alert-circle" label="Warning"></ui-icon>
<ui-button icon-only label="Delete"><ui-icon name="trash"></ui-icon></ui-button>
```

- Icons scale with the text around them unless you set `size`.
- With no `label` the icon is decorative and hidden from screen readers. Set a `label` when the icon carries meaning on its own.
- `filled` fills the shape, for example a solid star or a filled Material icon.

## Names

In the Material set, Kvui names map to Material names. Some common ones:

| Kvui name | Material name | Kvui name | Material name |
| --- | --- | --- | --- |
| `check` | `check` | `trash` | `delete` |
| `x` | `close` | `user` | `person` |
| `search` | `search` | `bell` | `notifications` |
| `chevron-down` | `expand_more` | `settings` | `settings` |
| `plus` | `add` | `calendar` | `calendar_month` |
| `upload` | `upload` | `download` | `download` |

Use a Material name directly if it isn't in the table. It's looked up as a Material ligature. Run `MATERIAL_NAMES` from `@kvui/core` for the complete mapping.

## Add your own

```js
import { registerIcons } from '@kvui/core';

registerIcons({
  logo: '<path d="M4 4h16v16H4z"/>', // inner SVG, 24 x 24 viewBox, stroked
});
```

A registered icon keeps its own drawing in either set, unless its name is also in the Material mapping.

## Notes

- Icons take the colour of the text around them (`currentColor`).
- In the Material set, text in the Material font is shown as plain text if the font hasn't loaded. Load the font, or use `display=block` as shown above.
- In plain CSS you can use the Material font directly: `<span class="material-symbols-outlined">home</span>`, once the font is loaded.
