# @kvui/editor

Rich text editor for Kvui UI: configurable toolbar, "/" commands, @mentions, tables, links, image and file
uploads. Built on [Tiptap](https://tiptap.dev) (v2). Requires `@kvui/core`.

```ts
import '@kvui/core/styles.css';
import '@kvui/editor';            // registers <ui-editor>
```
```html
<ui-editor label="Notes" preset="standard"></ui-editor>
```

React: `import { UiEditor } from '@kvui/react/editor'`. Angular: `import { UiEditor } from '@kvui/angular/editor'`
(works with `ngModel` / `formControl`; the value is an HTML string).

See the root README for every option. The value is HTML: sanitise it on the server before storing or rendering it.
