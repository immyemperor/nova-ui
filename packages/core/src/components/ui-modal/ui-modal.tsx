import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { prefersReducedMotion } from '../../utils/animation';
import { lockScroll, unlockScroll } from '../../utils/scroll-lock';
import { t } from '../../i18n';

let uid = 0;

/**
 * Modal dialog on the native <dialog> element: focus is trapped, the page behind is inert,
 * Escape works, and focus returns to the opener on close.
 */
@Component({
  tag: 'ui-modal',
  styleUrl: 'ui-modal.css',
  shadow: true,
})
export class UiModal {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) open = false;
  /** Title shown in the header and used as the dialog's accessible name. */
  @Prop() heading?: string;
  /** Accessible name when there is no visible heading. */
  @Prop() label?: string;
  /** Allow closing with Escape, the backdrop and the close button. */
  @Prop() dismissible = true;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' | 'full' = 'md';
  /** "center" is a dialog. The edge values make it a drawer; "palette" is top-aligned for search. */
  @Prop({ reflect: true }) placement: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'palette' = 'center';
  @Prop() hideHeader = false;

  @State() closing = false;
  @State() hasHeaderSlot = false;
  @State() hasFooter = false;

  /** Fires after the dialog is shown. */
  @Event({ bubbles: false }) uiOpen!: EventEmitter<void>;
  /** Fires after the dialog has closed, however it was closed. */
  @Event({ bubbles: false }) uiClose!: EventEmitter<void>;

  private dialog?: HTMLDialogElement;
  private titleId = `ui-modal-title-${++uid}`;
  private locked = false;
  private closeTimer?: ReturnType<typeof setTimeout>;

  @Watch('open')
  onOpenChange(next: boolean) {
    if (next) this.doOpen();
    else this.doClose();
  }

  componentDidLoad() {
    if (this.open) this.doOpen();
  }

  disconnectedCallback() {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.release();
  }

  private doOpen() {
    const d = this.dialog;
    if (!d || d.open) return;
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closing = false;
    d.showModal();
    if (!this.locked) {
      lockScroll();
      this.locked = true;
    }
    this.uiOpen.emit();
  }

  private doClose() {
    const d = this.dialog;
    if (!d || !d.open) return;
    if (prefersReducedMotion()) {
      d.close();
      return;
    }
    this.closing = true;
    this.closeTimer = setTimeout(() => {
      this.closing = false;
      d.close();
    }, 180);
  }

  /** Runs on the native "close" event, so it covers Escape, form[method=dialog] and our own close(). */
  private release() {
    if (!this.locked) return;
    this.locked = false;
    unlockScroll();
    this.uiClose.emit();
  }

  private onNativeClose = () => {
    this.release();
    if (this.open) this.open = false;
  };

  private onCancel = (e: Event) => {
    // Escape pressed.
    e.preventDefault();
    if (this.dismissible) this.open = false;
  };

  private onDialogClick = (e: MouseEvent) => {
    // Clicks on the ::backdrop are dispatched on the <dialog> itself.
    if (e.target === this.dialog && this.dismissible) this.open = false;
  };

  render() {
    const showHeader = !this.hideHeader && (!!this.heading || this.hasHeaderSlot || this.dismissible);
    return (
      <Host>
        <dialog
          ref={(el) => (this.dialog = el)}
          class={{ closing: this.closing }}
          aria-labelledby={this.heading && !this.hideHeader ? this.titleId : undefined}
          aria-label={this.heading && !this.hideHeader ? undefined : this.label ?? this.heading}
          onCancel={this.onCancel}
          onClose={this.onNativeClose}
          onClick={this.onDialogClick}
        >
          <div class="surface" part="surface">
            {showHeader && (
              <header class="header">
                <h2 class="title" id={this.titleId}>
                  {this.heading}
                  <slot name="header" onSlotchange={(e) => (this.hasHeaderSlot = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0)} />
                </h2>
                {this.dismissible && (
                  <ui-button variant="ghost" size="sm" icon-only label={t('close')} onClick={() => (this.open = false)}>
                    <ui-icon name="x" />
                  </ui-button>
                )}
              </header>
            )}
            <div class="body">
              <slot />
            </div>
            <footer class="footer" hidden={!this.hasFooter}>
              <slot name="footer" onSlotchange={(e) => (this.hasFooter = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0)} />
            </footer>
          </div>
        </dialog>
      </Host>
    );
  }
}
