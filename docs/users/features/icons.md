# Icons

`<ui-icon>` draws from a registry of about 70 line icons: `check`, `x`, `plus`, `search`, `chevron-down`, `settings`, `calendar`, `download`, `upload`, `user`, `bell`, `star` and more. Run `listIcons()` for the full list.

```html
<ui-icon name="check"></ui-icon>
<ui-icon name="alert-circle" label="Warning"></ui-icon>
<ui-button icon-only label="Delete"><ui-icon name="trash"></ui-icon></ui-button>
```

- Icons scale with text by default. Set `size="24px"` to fix them.
- With no `label` the icon is decorative and hidden from screen readers. Give a `label` when the icon carries meaning alone.
- `filled` fills the shape, for example a solid star.

## Add your own

```ts
import { registerIcons } from '@nova-ui/core';

registerIcons({
  logo: '<path d="M4 4h16v16H4z"/>', // inner SVG markup, 24 x 24 viewBox, stroked
});
```

Icons are drawn with `currentColor`, so they take the colour of their surrounding text.
