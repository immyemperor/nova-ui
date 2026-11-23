# @omni/editor

Rich text editor for Nova UI: configurable toolbar, "/" commands, @mentions, tables, links, image and file
uploads. Built on [Tiptap](https://tiptap.dev) (v2). Requires `@omni/core`.

```ts
import '@omni/core/styles.css';
import '@omni/editor';            // registers <ui-editor>
```
```html
<ui-editor label="Notes" preset="standard"></ui-editor>
```

React: `import { UiEditor } from '@omni/react/editor'`. Angular: `import { UiEditor } from '@omni/angular/editor'`
(works with `ngModel` / `formControl`; the value is an HTML string).

See the root README for every option. The value is HTML: sanitise it on the server before storing or rendering it.
