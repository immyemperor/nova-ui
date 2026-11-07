import { Component, Element, Event, EventEmitter, Host, Listen, Prop, Watch, h } from '@stencil/core';

interface TabEl extends HTMLElement {
  value: string;
  disabled: boolean;
  selected: boolean;
}
interface PanelEl extends HTMLElement {
  value: string;
  selected: boolean;
}

/**
 * Tabs. Put <ui-tab value> and <ui-tab-panel value> as direct children; matching values pair them.
 * Arrow keys move between tabs, Home/End jump, and a sliding indicator follows the selection.
 */
@Component({
  tag: 'ui-tabs',
  styleUrl: 'ui-tabs.css',
  shadow: true,
})
export class UiTabs {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true }) value?: string;
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  /** "auto" selects a tab as it receives focus; "manual" waits for Enter or Space. */
  @Prop() activation: 'auto' | 'manual' = 'auto';
  @Prop({ reflect: true }) variant: 'underline' | 'pills' = 'underline';
  /** Accessible name for the tab list. */
  @Prop() label?: string;

  @Event() uiChange!: EventEmitter<string>;

  private listEl?: HTMLElement;
  private indicator?: HTMLElement;
  private ro?: ResizeObserver;

  private tabs(): TabEl[] {
    return Array.from(this.host.querySelectorAll(':scope > ui-tab')) as TabEl[];
  }
  private panels(): PanelEl[] {
    return Array.from(this.host.querySelectorAll(':scope > ui-tab-panel')) as PanelEl[];
  }

  @Watch('value')
  @Watch('orientation')
  @Watch('variant')
  sync() {
    const tabs = this.tabs();
    if (!tabs.length) return;
    let active = this.value;
    if (!tabs.some((t) => t.value === active && !t.disabled)) active = tabs.find((t) => !t.disabled)?.value;
    if (active !== this.value) {
      this.value = active; // re-enters sync() through the watcher
      return;
    }
    tabs.forEach((t) => {
      t.slot = 'tab';
      t.selected = t.value === active;
    });
    this.panels().forEach((p) => {
      p.selected = p.value === active;
      const owner = tabs.find((t) => t.value === p.value);
      if (owner) p.setAttribute('aria-label', (owner.textContent ?? '').trim());
    });
    requestAnimationFrame(() => this.moveIndicator());
  }

  componentDidLoad() {
    this.sync();
    if (typeof ResizeObserver !== 'undefined' && this.listEl) {
      this.ro = new ResizeObserver(() => this.moveIndicator());
      this.ro.observe(this.listEl);
    }
    (document as any).fonts?.ready?.then(() => this.moveIndicator());
  }

  disconnectedCallback() {
    this.ro?.disconnect();
  }

  private moveIndicator() {
    const list = this.listEl;
    const ind = this.indicator;
    const sel = this.tabs().find((t) => t.value === this.value);
    if (!list || !ind || !sel) return;
    const l = list.getBoundingClientRect();
    const t = sel.getBoundingClientRect();
    const vertical = this.orientation === 'vertical';
    ind.style.setProperty('--_pos', `${vertical ? t.top - l.top + list.scrollTop : t.left - l.left + list.scrollLeft}px`);
    ind.style.setProperty('--_size', `${vertical ? t.height : t.width}px`);
    // Skip the transition for the very first placement.
    requestAnimationFrame(() => ind.setAttribute('data-ready', ''));
  }

  private select(value: string) {
    if (value === this.value) return;
    this.value = value;
    this.uiChange.emit(value);
  }

  @Listen('click')
  onClick(ev: MouseEvent) {
    const tab = (ev.target as HTMLElement).closest('ui-tab') as TabEl | null;
    if (tab && tab.parentElement === this.host && !tab.disabled) this.select(tab.value);
  }

  @Listen('keydown')
  onKeyDown(ev: KeyboardEvent) {
    const tab = (ev.target as HTMLElement).closest('ui-tab') as TabEl | null;
    if (!tab || tab.parentElement !== this.host) return;
    const tabs = this.tabs().filter((t) => !t.disabled);
    const i = tabs.indexOf(tab);
    const horizontal = this.orientation === 'horizontal';
    let target: TabEl | undefined;
    if (ev.key === (horizontal ? 'ArrowRight' : 'ArrowDown')) target = tabs[(i + 1) % tabs.length];
    else if (ev.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')) target = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (ev.key === 'Home') target = tabs[0];
    else if (ev.key === 'End') target = tabs[tabs.length - 1];
    else if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.select(tab.value);
      return;
    } else return;
    ev.preventDefault();
    target.focus();
    if (this.activation === 'auto') this.select(target.value);
  }

  render() {
    return (
      <Host>
        <div class="list" role="tablist" aria-orientation={this.orientation} aria-label={this.label} ref={(el) => (this.listEl = el)}>
          <span class="indicator" aria-hidden="true" ref={(el) => (this.indicator = el)} />
          <slot name="tab" onSlotchange={() => this.sync()} />
        </div>
        <div class="panels">
          <slot onSlotchange={() => this.sync()} />
        </div>
      </Host>
    );
  }
}
