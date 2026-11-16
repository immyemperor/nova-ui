/**
 * A small, dependency-free HTML sanitiser for displaying content you don't fully trust
 * (comments, CMS output, editor HTML). It works on the DOM parser, not regexes, so it can't be
 * fooled by odd attribute spacing or nesting. For untrusted input from the public internet
 * prefer a maintained library such as DOMPurify; this covers the common cases and is audited by tests.
 */
const ALLOWED_TAGS = new Set([
  'a', 'abbr', 'b', 'blockquote', 'br', 'code', 'dd', 'del', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'i', 'img', 'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 's', 'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td',
  'tfoot', 'th', 'thead', 'tr', 'u', 'ul',
]);
const DROP_WITH_CONTENT = new Set(['script', 'style', 'iframe', 'object', 'embed', 'template', 'noscript', 'svg', 'math', 'form', 'input', 'button', 'select', 'textarea', 'link', 'meta', 'base']);
const ALLOWED_ATTR = new Set(['href', 'title', 'alt', 'src', 'width', 'height', 'colspan', 'rowspan', 'scope', 'align', 'lang', 'dir', 'class', 'id', 'target', 'rel']);
const URL_ATTRS = new Set(['href', 'src']);

/** Safe URL for a link: http(s), mailto, tel, relative or in-page. */
export function isSafeLink(url: string): boolean {
  const u = url.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').trim();
  if (u === '' || u.startsWith('/') || u.startsWith('#') || u.startsWith('?') || u.startsWith('./') || u.startsWith('../')) return true;
  return /^(https?:|mailto:|tel:)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u);
}

/** Safe image source: http(s), relative, or a data:image URL. Never javascript: or data:text/html. */
export function isSafeImage(url: string): boolean {
  const u = url.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').trim();
  if (/^data:image\/(png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i.test(u)) return true;
  return isSafeLink(u) && !/^(javascript|vbscript|data):/i.test(u);
}

/** Returns sanitised HTML. Unknown tags are unwrapped (their text kept); dangerous ones are removed with contents. */
export function sanitizeHTML(html: string): string {
  if (typeof DOMParser === 'undefined') return escapeHTML(html); // no DOM (SSR): show as text, never as markup
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 8) { child.remove(); continue; } // comments
      if (child.nodeType !== 1) continue;
      const el = child as Element;
      const tag = el.tagName.toLowerCase();
      if (DROP_WITH_CONTENT.has(tag)) { el.remove(); continue; }
      if (!ALLOWED_TAGS.has(tag)) { walk(el); el.replaceWith(...Array.from(el.childNodes)); continue; }
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || !ALLOWED_ATTR.has(name)) { el.removeAttribute(attr.name); continue; }
        if (URL_ATTRS.has(name)) {
          const ok = name === 'src' ? isSafeImage(attr.value) : isSafeLink(attr.value);
          if (!ok) el.removeAttribute(attr.name);
        }
      }
      if (tag === 'a' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener noreferrer');
      walk(el);
    }
  };
  walk(doc.body);
  return doc.body.innerHTML;
}

export function escapeHTML(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
