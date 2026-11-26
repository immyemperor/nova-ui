# Plain HTML and web components

Use this when you're not using a framework, or when you want to use Kvui in any framework that can render HTML.

## Install and load

```bash
pnpm add @kvui/core @kvui/css
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <link rel="stylesheet" href="/node_modules/@kvui/css/dist/kvui.min.css" />
    <script type="module">
      import { defineCustomElements } from '/node_modules/@kvui/core/loader/index.js';
      defineCustomElements();
    </script>
  </head>
  <body class="kvui-base">
    <ui-button variant="primary">Save</ui-button>
    <ui-input label="Email" type="email" name="email" required></ui-input>
  </body>
</html>
```

Bundlers resolve these paths for you. In a bundled app, write `import '@kvui/css/kvui.css'` and `import { defineCustomElements } from '@kvui/core/loader'`.

## Setting objects and arrays

Attributes are strings. Set complex values as properties:

```html
<ui-select id="owner" label="Owner" searchable></ui-select>
<script type="module">
  const el = document.getElementById('owner');
  el.options = [{ value: 'ada', label: 'Ada Lovelace' }, { value: 'grace', label: 'Grace Hopper' }];
  el.addEventListener('ui-change', (e) => console.log('chosen', e.detail));
</script>
```

## Methods

Call methods directly on the element: `await el.focusInput()`, `await editor.getContentHTML()`, `await table.exportCSV()`.

## Slots

```html
<ui-button>
  <ui-icon slot="start" name="check"></ui-icon>
  Save
</ui-button>
```

## Next steps

[Concepts](../concepts.md) · [Feature guides](../features/README.md) · [Component reference](../../../packages/core/dist-docs/API.md)
