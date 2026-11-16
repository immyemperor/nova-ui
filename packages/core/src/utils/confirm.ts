/**
 * Promise-based confirm and prompt dialogs. Use them like window.confirm, but styled and accessible:
 *   if (await confirm({ title: 'Delete project?', danger: true })) { ... }
 *   const name = await prompt({ title: 'Rename', defaultValue: 'Untitled' });
 * Needs one <ui-dialog-host> in the page; it is created automatically on first use.
 */
export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm button as destructive. */
  danger?: boolean;
}
export interface PromptOptions extends ConfirmOptions {
  defaultValue?: string;
  placeholder?: string;
  /** Return an error string to block submission. */
  validate?: (value: string) => string | undefined;
}

interface HostEl extends HTMLElement {
  openDialog?: (req: DialogRequest) => Promise<string | boolean | null>;
}
export type DialogRequest =
  | ({ kind: 'confirm' } & ConfirmOptions)
  | ({ kind: 'prompt' } & PromptOptions);

function host(): HostEl | null {
  if (typeof document === 'undefined') return null;
  let el = document.querySelector('ui-dialog-host') as HostEl | null;
  if (!el) {
    el = document.createElement('ui-dialog-host') as HostEl;
    document.body.appendChild(el);
  }
  return el;
}

function request(req: DialogRequest): Promise<string | boolean | null> {
  const el = host();
  if (!el) return Promise.resolve(req.kind === 'confirm' ? false : null);
  if (typeof el.openDialog === 'function') return el.openDialog(req);
  return customElements.whenDefined('ui-dialog-host').then(() => el.openDialog!(req));
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return request({ kind: 'confirm', ...options }) as Promise<boolean>;
}

export function prompt(options: PromptOptions): Promise<string | null> {
  return request({ kind: 'prompt', ...options }) as Promise<string | null>;
}
