import type { ToastOptions } from '../types';

interface ToasterEl extends HTMLElement {
  show?: (options: ToastOptions) => Promise<string>;
  dismiss?: (id: string) => Promise<void>;
}

let seq = 0;

function getToaster(): ToasterEl | null {
  if (typeof document === 'undefined') return null;
  let el = document.querySelector('ui-toaster') as ToasterEl | null;
  if (!el) {
    el = document.createElement('ui-toaster') as ToasterEl;
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Show a toast from anywhere. Render <ui-toaster> (UiToaster) once near your app root;
 * if it isn't there, one is created for you.
 */
function show(input: string | ToastOptions): { id: string; dismiss: () => void } {
  const options: ToastOptions = typeof input === 'string' ? { title: input } : input;
  const id = options.id ?? `kvui-toast-${++seq}`;
  const el = getToaster();
  if (!el) return { id, dismiss: () => undefined };

  const run = () => el.show?.({ ...options, id });
  if (typeof el.show === 'function') {
    run();
  } else {
    customElements.whenDefined('ui-toaster').then(run);
    setTimeout(() => {
      if (typeof el.show !== 'function') {
        console.warn('[kvui] <ui-toaster> is not registered. Render <UiToaster /> (or import it) once in your app.');
      }
    }, 2000);
  }
  return { id, dismiss: () => void el.dismiss?.(id) };
}

const withTone = (tone: ToastOptions['tone']) => (input: string | ToastOptions) =>
  show(typeof input === 'string' ? { title: input, tone } : { tone, ...input });

export const toast = Object.assign(show, {
  success: withTone('success'),
  error: withTone('danger'),
  warning: withTone('warning'),
  info: withTone('info'),
  dismiss: (id: string) => void getToaster()?.dismiss?.(id),
});
