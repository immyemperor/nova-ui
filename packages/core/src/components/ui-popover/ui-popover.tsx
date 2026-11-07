import { Component, Element, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';
import { Placement, autoUpdate, computePosition, hideFloating, showFloating, supportsPopover } from '../../utils/position';

/**
 * Floating panel anchored to a trigger. This is the primitive that dropdown, select and
 * context menu are built on. Renders in the top layer, so it is never clipped.
 */
@Component({
  tag: 'ui-popover',
  styleUrl: 'ui-popover.css',
  shadow: true,
})
export class UiPopover {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() placement: Placement = 'bottom-start';
  /** Gap between trigger and panel, px. */
  @Prop() offset = 8;
  /** "click" toggles on trigger click. "manual" leaves control to you. */
  @Prop() trigger: 'click' | 'manual' = 'click';
  /** Make the panel at least as wide as the trigger. */
  @Prop() matchWidth = false;
  /** Semantics of the panel; also sets aria-haspopup on the trigger. */
  @Prop() panelRole: 'dialog' | 'menu' | 'listbox' | 'none' = 'dialog';
  /** Close on outside press and Escape. */
  @Prop() closeOnOutside = true;
  /** Accessible name when panelRole is "dialog". */
  @Prop() label?: string;

  /** Fires when the user (not your code) changes the open state. */
  @Event({ bubbles: false }) uiOpenChange!: EventEmitter<boolean>;
  /** Fires after the panel is shown and positioned. */
  @Event({ bubbles: false }) uiShow!: EventEmitter<void>;
  @Event({ bubbles: false }) uiHide!: EventEmitter<void>;

  private panel?: HTMLElement;
  private anchorEl?: HTMLElement;
  private virtual?: { x: number; y: number };
  private stop?: () => void;

  @Method() async show() {
    this.setOpen(true);
  }
  @Method() async hide() {
    this.setOpen(false);
  }
  @Method() async toggle() {
    this.setOpen(!this.open);
  }
  /** Open at viewport coordinates, e.g. for a context menu. */
  @Method() async showAt(x: number, y: number) {
    this.virtual = { x, y };
    if (this.open) this.reposition();
    else this.setOpen(true);
  }

  @Watch('open')
  onOpenChange(next: boolean) {
    if (next) this.mount();
    else this.unmount();
    this.syncAria();
  }

  @Watch('placement')
  @Watch('offset')
  onLayoutChange() {
    if (this.open) this.reposition();
  }

  componentDidLoad() {
    this.syncAria();
    if (this.open) this.mount();
  }

  disconnectedCallback() {
    this.stop?.();
    document.removeEventListener('pointerdown', this.onPointerDown, true);
    document.removeEventListener('keydown', this.onKeyDown, true);
  }

  private setOpen(next: boolean) {
    if (next === this.open) return;
    this.open = next;
    this.uiOpenChange.emit(next);
  }

  private mount() {
    const panel = this.panel;
    if (!panel) return;
    showFloating(panel);
    this.reposition();
    this.stop = autoUpdate(this.anchorEl ?? null, panel, () => this.reposition());
    document.addEventListener('pointerdown', this.onPointerDown, true);
    document.addEventListener('keydown', this.onKeyDown, true);
    this.uiShow.emit();
  }

  private unmount() {
    const panel = this.panel;
    if (!panel) return;
    // Check before hiding: hiding drops focus to <body>.
    const hadFocus = panel.matches(':focus-within');
    this.stop?.();
    this.stop = undefined;
    document.removeEventListener('pointerdown', this.onPointerDown, true);
    document.removeEventListener('keydown', this.onKeyDown, true);
    hideFloating(panel);
    this.virtual = undefined;
    if (hadFocus) this.triggerEl()?.focus?.();
    this.uiHide.emit();
  }

  private reposition() {
    const panel = this.panel;
    if (!panel) return;
    const rect = this.virtual
      ? new DOMRect(this.virtual.x, this.virtual.y, 0, 0)
      : (this.anchorEl ?? this.host).getBoundingClientRect();
    if (this.matchWidth && !this.virtual) panel.style.minWidth = `${rect.width}px`;
    const box = panel.getBoundingClientRect();
    const { x, y, placement } = computePosition(rect, { width: box.width, height: box.height }, this.placement, this.virtual ? 2 : this.offset);
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.dataset.placement = placement;
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!this.closeOnOutside) return;
    const path = e.composedPath();
    if ((this.panel && path.includes(this.panel)) || (this.anchorEl && path.includes(this.anchorEl))) return;
    this.setOpen(false);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closeOnOutside) {
      e.preventDefault();
      e.stopPropagation();
      this.setOpen(false);
    }
  };

  /** The element the user slotted as the trigger, even through nested slots. */
  private triggerEl(): HTMLElement | null {
    const slot = this.anchorEl?.querySelector('slot[name="trigger"]') as HTMLSlotElement | null;
    return (slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? null;
  }

  private syncAria() {
    const el = this.triggerEl();
    if (!el || this.panelRole === 'none') return;
    const attrs: Record<string, string> = { 'aria-haspopup': this.panelRole, 'aria-expanded': String(this.open) };
    // A <ui-button> keeps its real <button> in shadow DOM, so mirror the state onto it.
    const targets = [el, el.shadowRoot?.querySelector('button, a') as HTMLElement | null].filter(Boolean) as HTMLElement[];
    for (const t of targets) for (const [k, v] of Object.entries(attrs)) t.setAttribute(k, v);
  }

  private onAnchorClick = () => {
    if (this.trigger === 'click') this.setOpen(!this.open);
  };

  render() {
    return (
      <Host>
        <span class="anchor" ref={(el) => (this.anchorEl = el)} onClick={this.onAnchorClick}>
          <slot name="trigger" onSlotchange={() => this.syncAria()} />
        </span>
        <div
          class="panel"
          ref={(el) => (this.panel = el)}
          role={this.panelRole === 'dialog' ? 'dialog' : undefined}
          aria-label={this.panelRole === 'dialog' ? this.label : undefined}
          hidden={!supportsPopover() && !this.open}
          {...({ popover: 'manual' } as any)}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
