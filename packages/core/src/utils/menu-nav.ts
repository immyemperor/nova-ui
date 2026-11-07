/** Roving-focus keyboard behaviour shared by dropdown and context menu. */
export interface MenuItemEl extends HTMLElement {
  disabled?: boolean;
}

let buffer = '';
let timer: ReturnType<typeof setTimeout> | undefined;

export function enabledItems(items: ArrayLike<Element>): MenuItemEl[] {
  return (Array.from(items) as MenuItemEl[]).filter((i) => !i.disabled);
}

/** Returns true when the key was handled. */
export function handleMenuKeys(ev: KeyboardEvent, items: MenuItemEl[]): boolean {
  if (!items.length) return false;
  const root = items[0].getRootNode() as Document | ShadowRoot;
  const current = items.findIndex((i) => i === root.activeElement);
  const focusAt = (n: number) => items[(n + items.length) % items.length].focus();

  switch (ev.key) {
    case 'ArrowDown':
      ev.preventDefault();
      focusAt(current < 0 ? 0 : current + 1);
      return true;
    case 'ArrowUp':
      ev.preventDefault();
      focusAt(current < 0 ? -1 : current - 1);
      return true;
    case 'Home':
      ev.preventDefault();
      focusAt(0);
      return true;
    case 'End':
      ev.preventDefault();
      focusAt(-1);
      return true;
    case 'Enter':
    case ' ':
      if (current >= 0) {
        ev.preventDefault();
        items[current].click();
        return true;
      }
      return false;
  }

  // Type-ahead: jump to the next item starting with the typed characters.
  if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
    if (timer) clearTimeout(timer);
    buffer += ev.key.toLowerCase();
    timer = setTimeout(() => (buffer = ''), 600);
    const start = Math.max(0, buffer.length === 1 ? current + 1 : current);
    const ordered = [...items.slice(start), ...items.slice(0, start)];
    const match = ordered.find((i) => (i.textContent ?? '').trim().toLowerCase().startsWith(buffer));
    match?.focus();
    return !!match;
  }
  return false;
}
