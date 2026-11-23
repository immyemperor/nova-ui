# Colour

## Colour picker

```html
<ui-color-picker name="brand" label="Brand colour" value="#0b7a6c"></ui-color-picker>
<ui-color-picker inline value="#3b82f6"></ui-color-picker>
```

Custom swatches are a property: `picker.swatches = ['#ef4444', '#22c55e', '#3b82f6'];`

```html
```

- Value is a hex string: `#rrggbb`.
- Saturation and brightness are chosen on an area; hue on a slider. Keyboard arrows adjust the area, Shift makes bigger steps.
- Type a hex value, pick a swatch, or use the eyedropper where the browser supports it.
- Events: `ui-input` while dragging, `ui-change` when committed.

## Contrast

Check a colour before you use it for text:

```ts
import { contrastRatio } from '@omni/core';
contrastRatio('#ffffff', '#0b7a6c'); // ≥ 4.5 passes WCAG AA for body text
```

For a whole brand palette, use the theme generator in [Theming](theming.md). It guarantees AA contrast for text on accent colours.
