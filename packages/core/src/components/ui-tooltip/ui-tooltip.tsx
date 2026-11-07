import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { Placement, autoUpdate, computePosition, hideFloating, showFloating, supportsPopover } from '../../utils/position';

/** Short, non-interactive hint on hover or keyboard focus. Wrap the element it describes. */
@Component({
  tag: 'ui-tooltip',
  styleUrl: 'ui-tooltip.css',
  shadow: true,
})
export class UiTooltip {
  @Element() host!: HTMLElement;

  @Prop() content = '';
  @Prop() placement: Placement = 'top';
  /** ms before showing on hover. */
  @Prop() delay = 300;
  @Prop() disabled = false;

  private bubble?: HTMLElement;
  private anchorEl?: HTMLElement;
  private timer?: ReturnType<typeof setTimeout>;
  private stop?: () => void;
  private visible = false;

  @Watch('content')
  @Watch('disabled')
  syncDescription() {
    const slot = this.anchorEl?.querySelector('slot') as HTMLSlotElement | null;
    const target = slot?.assignedElements({ flatten: true })[0];
    if (!target) return;
    // The bubble lives in shadow DOM, so id references can't reach it; use aria-description instead.
    if (this.content && !this.disabled) target.setAttribute('aria-description', this.content);
    else target.removeAttribute('aria-description');
  }

  componentDidLoad() {
    this.syncDescription();
  }

  disconnectedCallback() {
    this.hide();
  }

  private show = () => {
    if (this.disabled || !this.content) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.reveal(), this.delay);
  };

  private hide = () => {
    if (this.timer) clearTimeout(this.timer);
    if (!this.visible) return;
    this.visible = false;
    this.stop?.();
    this.stop = undefined;
    document.removeEventListener('keydown', this.onKey, true);
    if (this.bubble) hideFloating(this.bubble);
  };

  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.hide();
  };

  private reveal() {
    const bubble = this.bubble;
    if (!bubble || this.visible) return;
    this.visible = true;
    showFloating(bubble);
    this.place();
    this.stop = autoUpdate(this.anchorEl ?? null, bubble, () => this.place());
    document.addEventListener('keydown', this.onKey, true);
  }

  private place() {
    const bubble = this.bubble;
    const anchor = this.anchorEl;
    if (!bubble || !anchor) return;
    const box = bubble.getBoundingClientRect();
    const { x, y, placement } = computePosition(anchor.getBoundingClientRect(), { width: box.width, height: box.height }, this.placement, 8);
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.dataset.placement = placement;
  }

  render() {
    return (
      <Host>
        <span
          class="anchor"
          ref={(el) => (this.anchorEl = el)}
          onMouseEnter={this.show}
          onMouseLeave={this.hide}
          onFocusin={this.show}
          onFocusout={this.hide}
        >
          <slot onSlotchange={() => this.syncDescription()} />
        </span>
        <div class="bubble" role="tooltip" ref={(el) => (this.bubble = el)} hidden={!supportsPopover()} {...({ popover: 'manual' } as any)}>
          {this.content}
        </div>
      </Host>
    );
  }
}
