# Rich text editor

`<ui-editor>` is a rich text editor built on Tiptap, with a toolbar made from Nova buttons, menus and icons. It's a separate package so it only loads where you use it.

```bash
pnpm add @omni/editor
```

```tsx
// React
import { UiEditor } from '@omni/react/editor';

<UiEditor
  label="Description"
  preset="standard"
  value={html}
  onUiChange={(e) => setHtml(e.detail)}
  uploadHandler={async (file) => (await storage.upload(file)).url}
/>
```

Angular: `import { UiEditor } from '@omni/angular/editor'`. HTML: `import '@omni/editor'`, then `<ui-editor preset="standard"></ui-editor>`.

## Toolbar

- `preset`: `minimal`, `standard` or `full`.
- `toolbar`: your own list, in order. `'|'` is a separator.

Available items: `undo redo heading bold italic underline strike code textColor highlight alignLeft alignCenter alignRight bulletList orderedList taskList blockquote codeBlock hr link image attachment table`.

Keyboard shortcuts follow the usual ones: Ctrl or Cmd with B, I, U, Z; Ctrl or Cmd with K for a link.

## Commands and mentions

- `slashCommands` (default on): typing `/` opens a menu of blocks your toolbar allows.
- `mentionProvider(query)` turns on `@` mentions. Return `{ id, label, description? }[]`, synchronously or as a promise.

## Uploads

- `uploadHandler(file)` resolves with a URL, or `{ url, alt }`. It's used for pasted, dropped and chosen files.
- `accept` (images, default `image/*`), `attachmentAccept` (other files), `maxFileSize` in bytes.
- Without `uploadHandler`, images are embedded as data URLs and attachments are refused with a message.

## Limits and state

- `maxLength` shows a live counter and enforces the limit.
- `readonly`, `disabled`, `required`, `name` (submits the HTML with a form).
- `minHeight`, `maxHeight`: the writing area scrolls past `maxHeight`.

## Methods

`getContentHTML()`, `getContentJSON()`, `getContentText()`, `setContent(html)`, `insertContent(html)`, `clear()`, `focusEditor()`, and `getEditor()` for the underlying Tiptap editor.

## Events

`ui-change` (HTML), `ui-focus`, `ui-blur`, `ui-ready`, `ui-upload-start`, `ui-upload-complete`, `ui-upload-error`.

## Security: sanitise the HTML

The editor's value is HTML. The editor blocks script-capable links and image sources, but you must still sanitise HTML before storing it server-side or rendering it elsewhere. On the client, render it with `<ui-html>`, which sanitises it for you.

## Notes

- The editor renders in light DOM so the browser's text selection, spellcheck and input methods work normally. Its CSS is prefixed `nova-ed`, so it can't leak into your page.
- Pinned to Tiptap v2.
