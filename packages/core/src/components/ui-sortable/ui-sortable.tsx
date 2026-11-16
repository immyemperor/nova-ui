import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { keyboardMove } from '../../utils/reorder';

export interface SortItem { id: string; label: string }

/**
 * Reorderable list. Drag with a pointer, or focus an item and press Alt+ArrowUp / Alt+ArrowDown
 * to move it (the keyboard path that screen-reader and keyboard users need).
 */
@Component({
  tag: 'ui-sortable',
  styleUrl: 'ui-sortable.css',
  shadow: true,
})
export class UiSortable {
  @Element() host!: HTMLElement;
  @Prop({ mutable: true }) items: SortItem[] = [];
  @Prop() label = 'Reorderable list';
  @State() dragId?: string;
  @State() overId?: string;

  /** Fires with the new order after every change. */
  @Event() uiReorder!: EventEmitter<SortItem[]>;

  private commit(list: SortItem[]) {
    this.items = list;
    this.uiReorder.emit(list);
  }

  private onKey = (e: KeyboardEvent, index: number) => {
    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    const { list, index: at } = keyboardMove(this.items, index, e.key === 'ArrowUp' ? -1 : 1);
    if (at === index) return;
    this.commit(list);
    requestAnimationFrame(() => (this.el(at))?.focus());
  };

  /** Items live in this component's shadow root, so look them up there (document.querySelector can't see them). */
  private el(i: number): HTMLElement | null {
    return (this.host.shadowRoot?.querySelectorAll('[data-sort-id]')[i] ?? null) as HTMLElement | null;
  }

  private onDrop = (targetId: string) => {
    if (!this.dragId || this.dragId === targetId) return;
    const from = this.items.findIndex((i) => i.id === this.dragId);
    const to = this.items.findIndex((i) => i.id === targetId);
    if (from < 0 || to < 0) return;
    const list = this.items.slice();
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    this.dragId = undefined;
    this.overId = undefined;
    this.commit(list);
  };

  render() {
    return (
      <Host>
        <ul class="list" role="list" aria-label={this.label}>
          {this.items.map((item, i) => (
            <li
              key={item.id}
              data-sort-id={item.id}
              class={{ item: true, dragging: this.dragId === item.id, over: this.overId === item.id && this.dragId !== item.id }}
              tabindex={0}
              role="listitem"
              aria-roledescription="sortable item"
              aria-describedby="sort-help"
              draggable={true}
              onDragStart={(e) => { this.dragId = item.id; e.dataTransfer?.setData('text/plain', item.id); }}
              onDragOver={(e) => { e.preventDefault(); this.overId = item.id; }}
              onDragEnd={() => { this.dragId = undefined; this.overId = undefined; }}
              onDrop={(e) => { e.preventDefault(); this.onDrop(item.id); }}
              onKeyDown={(e: KeyboardEvent) => this.onKey(e, i)}
            >
              <span class="grip" aria-hidden="true">⠿</span>
              <span class="text">{item.label}</span>
            </li>
          ))}
        </ul>
        <p id="sort-help" class="help">Drag to reorder, or focus an item and press Alt plus the up or down arrow.</p>
      </Host>
    );
  }
}
