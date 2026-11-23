import type { Editor } from '@tiptap/core';
import { computePosition, hideFloating, showFloating } from '@omni/core';

export interface SlashItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  keywords?: string[];
  run: (editor: Editor) => void;
}

export interface SuggestView {
  key: string;
  label: string;
  description?: string;
  icon?: string;
}

export function filterSlashItems(items: SlashItem[], query: string): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => [i.label, ...(i.keywords ?? [])].some((t) => t.toLowerCase().includes(q))).slice(0, 10);
}

/**
 * Popup list used by both "/" commands and "@" mentions. It lives in the editor's own element
 * (not in a shadow root, so ProseMirror stays happy) and renders in the browser's top layer.
 */
export function createSuggestionRender<T>(getHost: () => HTMLElement | undefined, view: (item: T) => SuggestView, emptyText: string) {
  return () => {
    let el: HTMLElement | undefined;
    let items: T[] = [];
    let index = 0;
    let command: (item: T) => void = () => undefined;
    let rect: (() => DOMRect | null) | null | undefined;
    let dismissed = false;

    const place = () => {
      const r = rect?.();
      if (!el || !r) return;
      const box = el.getBoundingClientRect();
      const { x, y } = computePosition(r, { width: box.width, height: box.height }, 'bottom-start', 6);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };

    const draw = () => {
      if (!el) return;
      el.textContent = '';
      if (!items.length) {
        const empty = document.createElement('div');
        empty.className = 'nova-ed-suggest__empty';
        empty.textContent = emptyText;
        el.appendChild(empty);
        return;
      }
      items.forEach((item, i) => {
        const v = view(item);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nova-ed-suggest__item' + (i === index ? ' is-active' : '');
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
        if (v.icon) {
          const icon = document.createElement('ui-icon');
          icon.setAttribute('name', v.icon);
          btn.appendChild(icon);
        }
        const text = document.createElement('span');
        text.className = 'nova-ed-suggest__text';
        const label = document.createElement('span');
        label.className = 'nova-ed-suggest__label';
        label.textContent = v.label;
        text.appendChild(label);
        if (v.description) {
          const desc = document.createElement('span');
          desc.className = 'nova-ed-suggest__desc';
          desc.textContent = v.description;
          text.appendChild(desc);
        }
        btn.appendChild(text);
        // Keep the editor focused while choosing.
        btn.addEventListener('mousedown', (e) => e.preventDefault());
        btn.addEventListener('click', () => command(item));
        el!.appendChild(btn);
      });
      el.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
    };

    return {
      onStart: (props: any) => {
        el = document.createElement('div');
        el.className = 'nova-ed-suggest';
        el.setAttribute('role', 'listbox');
        el.setAttribute('popover', 'manual');
        (getHost() ?? document.body).appendChild(el);
        items = props.items;
        command = props.command;
        rect = props.clientRect;
        index = 0;
        dismissed = false;
        draw();
        showFloating(el);
        place();
      },
      onUpdate: (props: any) => {
        items = props.items;
        command = props.command;
        rect = props.clientRect;
        index = Math.min(index, Math.max(0, items.length - 1));
        draw();
        if (dismissed && el) {
          dismissed = false;
          showFloating(el);
        }
        place();
      },
      onKeyDown: (props: { event: KeyboardEvent }) => {
        const key = props.event.key;
        if (dismissed) return false;
        if (key === 'Escape') {
          dismissed = true;
          if (el) hideFloating(el);
          return true;
        }
        if (!items.length) return false;
        if (key === 'ArrowDown') {
          index = (index + 1) % items.length;
          draw();
          return true;
        }
        if (key === 'ArrowUp') {
          index = (index - 1 + items.length) % items.length;
          draw();
          return true;
        }
        if (key === 'Enter' || key === 'Tab') {
          command(items[index]);
          return true;
        }
        return false;
      },
      onExit: () => {
        el?.remove();
        el = undefined;
      },
    };
  };
}
