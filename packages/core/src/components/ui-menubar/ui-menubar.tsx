import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';

interface MenuEl extends HTMLElement {
  open: boolean;
  disabled: boolean;
  roving: boolean;
  openMenu: (focusFirst?: boolean) => Promise<void>;
  focusTrigger: () => Promise<void>;
}

/**
 * Application-style menu bar (File, Edit, View...). Children are <ui-menubar-menu> holding <ui-menu-item>s.
 * Once a menu is open, hovering or arrowing to its neighbour switches menus, like a desktop app.
 */
@Component({
  tag: 'ui-menubar',
  styleUrl: 'ui-menubar.css',
  shadow: true,
})
export class UiMenubar {
  @Element() host!: HTMLElement;

  @Prop() label = 'Application menu';
  /** Index of the menu that holds the single tab stop. */
  @State() roving = 0;

  private menus(): MenuEl[] {
    return (Array.from(this.host.querySelectorAll(':scope > ui-menubar-menu')) as MenuEl[]).filter((m) => !m.disabled);
  }

  private syncRoving() {
    this.menus().forEach((m, i) => (m.roving = i === this.roving));
  }

  componentDidLoad() {
    this.syncRoving();
  }

  @Listen('uiNavigate')
  onNavigate(ev: CustomEvent<number>) {
    ev.stopPropagation();
    const menus = this.menus();
    const i = menus.indexOf(ev.target as MenuEl);
    if (i < 0) return;
    const next = menus[(i + ev.detail + menus.length) % menus.length];
    if (menus.some((m) => m.open)) {
      menus.forEach((m) => {
        if (m !== next) m.open = false;
      });
      next.openMenu(true);
    } else {
      next.focusTrigger();
    }
  }

  @Listen('mouseover')
  onHover(ev: MouseEvent) {
    const target = (ev.target as HTMLElement).closest('ui-menubar-menu') as MenuEl | null;
    if (!target || target.open || target.disabled) return;
    const menus = this.menus();
    if (!menus.some((m) => m.open)) return; // only switch while a menu is already open
    menus.forEach((m) => {
      if (m !== target) m.open = false;
    });
    target.openMenu(false);
  }

  @Listen('focusin')
  onFocusIn(ev: FocusEvent) {
    const menus = this.menus();
    const i = menus.indexOf((ev.target as HTMLElement).closest('ui-menubar-menu') as MenuEl);
    if (i >= 0 && i !== this.roving) {
      this.roving = i;
      this.syncRoving();
    }
  }

  render() {
    return (
      <Host role="menubar" aria-label={this.label}>
        <slot onSlotchange={() => this.syncRoving()} />
      </Host>
    );
  }
}
