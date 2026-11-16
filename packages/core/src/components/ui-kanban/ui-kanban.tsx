import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { moveCard } from '../../utils/reorder';

export interface KanbanCard { id: string; title: string; detail?: string }
export interface KanbanColumn { id: string; title: string }

/**
 * Kanban board. Drag cards between columns, or focus a card and use Alt+Arrow keys:
 * Alt+Up/Down reorders within a column; Alt+Left/Right moves the card to the neighbouring column.
 */
@Component({
  tag: 'ui-kanban',
  styleUrl: 'ui-kanban.css',
  shadow: true,
})
export class UiKanban {
  @Prop() columns: KanbanColumn[] = [];
  /** Cards, keyed by id. */
  @Prop() cards: KanbanCard[] = [];
  /** Which column each card is in: column id to ordered card ids. */
  @Prop({ mutable: true }) layout: Record<string, string[]> = {};
  @Prop() label = 'Board';

  @State() dragId?: string;
  @State() overCol?: string;

  /** Fires after any move with the new layout. */
  @Event() uiMove!: EventEmitter<{ cardId: string; to: string; index: number; layout: Record<string, string[]> }>;

  private byId() {
    return Object.fromEntries(this.cards.map((c) => [c.id, c]));
  }

  private place(cardId: string, col: string, index: number) {
    const next = moveCard(this.layout, cardId, col, index);
    this.layout = next;
    this.uiMove.emit({ cardId, to: col, index, layout: next });
  }

  private onKey(e: KeyboardEvent, cardId: string) {
    if (!e.altKey) return;
    const colOf = (id: string) => this.columns.findIndex((c) => (this.layout[c.id] ?? []).includes(id));
    const ci = colOf(cardId);
    if (ci < 0) return;
    const col = this.columns[ci].id;
    const idx = this.layout[col].indexOf(cardId);
    let handled = true;
    if (e.key === 'ArrowUp') this.place(cardId, col, idx - 1);
    else if (e.key === "ArrowDown") this.place(cardId, col, idx + 1); // index counts after the card is removed
    else if (e.key === 'ArrowLeft' && ci > 0) this.place(cardId, this.columns[ci - 1].id, this.layout[this.columns[ci - 1].id]?.length ?? 0);
    else if (e.key === 'ArrowRight' && ci < this.columns.length - 1) this.place(cardId, this.columns[ci + 1].id, this.layout[this.columns[ci + 1].id]?.length ?? 0);
    else handled = false;
    if (handled) e.preventDefault();
  }

  render() {
    const cards = this.byId();
    return (
      <Host>
        <div class="board" role="region" aria-label={this.label}>
          {this.columns.map((col) => {
            const ids = this.layout[col.id] ?? [];
            return (
              <section
                key={col.id}
                class={{ col: true, over: this.overCol === col.id }}
                aria-label={`${col.title}, ${ids.length} cards`}
                onDragOver={(e) => { e.preventDefault(); this.overCol = col.id; }}
                onDragLeave={() => (this.overCol = undefined)}
                onDrop={(e) => {
                  e.preventDefault();
                  this.overCol = undefined;
                  if (this.dragId) this.place(this.dragId, col.id, ids.length);
                  this.dragId = undefined;
                }}
              >
                <header class="head">
                  <h3 class="title">{col.title}</h3>
                  <span class="count">{ids.length}</span>
                </header>
                <ul class="cards" role="list">
                  {ids.map((id) => cards[id] && (
                    <li
                      key={id}
                      class={{ card: true, dragging: this.dragId === id }}
                      tabindex={0}
                      draggable={true}
                      aria-describedby="kanban-help"
                      onDragStart={(e) => { this.dragId = id; e.dataTransfer?.setData('text/plain', id); }}
                      onDragEnd={() => (this.dragId = undefined)}
                      onKeyDown={(e: KeyboardEvent) => this.onKey(e, id)}
                    >
                      <span class="card-title">{cards[id].title}</span>
                      {cards[id].detail && <span class="detail">{cards[id].detail}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <p id="kanban-help" class="help">Drag cards between columns, or focus a card and press Alt with an arrow key to move it.</p>
      </Host>
    );
  }
}
