import { Component, Host, State, Method, h } from '@stencil/core';
import type { DialogRequest, PromptOptions } from '../../utils/confirm';
import { t } from '../../i18n';

interface Pending {
  req: DialogRequest;
  resolve: (v: string | boolean | null) => void;
}

/** Renders the dialogs requested by confirm() and prompt(). Created automatically; you rarely place it yourself. */
@Component({
  tag: 'ui-dialog-host',
  styleUrl: 'ui-dialog-host.css',
  shadow: true,
})
export class UiDialogHost {
  @State() current?: Pending;
  @State() value = '';
  @State() error?: string;
  private queue: Pending[] = [];

  /** Called by confirm()/prompt(). Queues requests so two dialogs never overlap. */
  @Method()
  async openDialog(req: DialogRequest): Promise<string | boolean | null> {
    return new Promise((resolve) => {
      this.queue.push({ req, resolve });
      if (!this.current) this.next();
    });
  }

  private next() {
    const item = this.queue.shift();
    if (!item) { this.current = undefined; return; }
    this.value = item.req.kind === 'prompt' ? (item.req as PromptOptions).defaultValue ?? '' : '';
    this.error = undefined;
    this.current = item;
  }

  private finish(result: string | boolean | null) {
    const item = this.current;
    if (!item) return;
    item.resolve(result);
    this.current = undefined;
    this.next();
  }

  private submit = (ev?: Event) => {
    ev?.preventDefault();
    const req = this.current?.req;
    if (!req) return;
    if (req.kind === 'confirm') return this.finish(true);
    const v = this.value.trim();
    const problem = (req as PromptOptions).validate?.(v);
    if (problem) { this.error = problem; return; }
    this.finish(v);
  };

  private cancel = () => {
    const req = this.current?.req;
    if (!req) return;
    this.finish(req.kind === 'confirm' ? false : null);
  };

  render() {
    const req = this.current?.req;
    return (
      <Host>
        <ui-modal
          open={!!req}
          size="sm"
          heading={req?.title}
          onUiClose={this.cancel}
        >
          {req && (
            <form class="body" onSubmit={this.submit}>
              {req.message && <p class="msg">{req.message}</p>}
              {req.kind === 'prompt' && (
                <ui-input
                  label={req.title}
                  hideLabel
                  value={this.value}
                  placeholder={(req as PromptOptions).placeholder}
                  error={this.error}
                  onUiInput={(e: CustomEvent<string>) => { this.value = e.detail; this.error = undefined; }}
                />
              )}
              <div class="actions">
                <ui-button variant="ghost" onClick={this.cancel}>
                  {req.cancelLabel ?? t('cancel')}
                </ui-button>
                <ui-button type="submit" variant={req.danger ? 'danger' : 'primary'}>
                  {req.confirmLabel ?? (req.kind === 'prompt' ? t('ok') : t('confirm'))}
                </ui-button>
              </div>
            </form>
          )}
        </ui-modal>
      </Host>
    );
  }
}
