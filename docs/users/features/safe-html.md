# Safe HTML

Use `<ui-html>` whenever you display HTML you don't fully control: comments, CMS content, rich text from users, or the editor's output.

```html
<ui-html prose html="<h3>Notes</h3><p>Fixed <strong>export</strong>.</p>"></ui-html>
```

```js
html.html = untrustedHtml;
html.allowImages = false; // strips <img> elements
```

## What is removed

- `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`, forms and form controls, and embedded SVG or MathML, along with their contents.
- Every `on*` event attribute.
- `javascript:`, `vbscript:` and `data:text/html` links and image sources. Only `http`, `https`, `mailto`, `tel` and relative links are kept; images also allow base64 PNG, JPEG, GIF, WebP and AVIF.
- HTML comments, which can hide conditional markup.
- Unknown tags are unwrapped: their text stays, the tag goes.
- `target="_blank"` links receive `rel="noopener noreferrer"`.

## Functions

```ts
import { sanitizeHTML, isSafeLink, isSafeImage } from '@kvui/core';
const clean = sanitizeHTML(untrusted);
```

## Limits

This sanitiser covers common cases and is tested against the attacks listed above. For content from the public internet on a high-risk surface, also use a maintained sanitiser such as DOMPurify at your server boundary. Defence in depth is cheap here.
