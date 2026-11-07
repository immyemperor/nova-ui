import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import type { Command } from '../../types';
import { fuzzyScore, matchHotkey } from '../../utils/search';

let uid = 0;

/** Ctrl/Cmd+K style launcher. Pass a list of commands; listen for uiSelect. */
@Component({
  tag: 'ui-command-palette',
  styleUrl: 'ui-command-palette.css',
  shadow: true,
})
export class UiCommandPalette {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() commands: Command[] = [];
  @Prop() placeholder = 'Type a command or search';
  /** Global shortcut, e.g. "mod+k" (Cmd on Mac, Ctrl elsewhere). Set to "" to disable. */
  @Prop() hotkey = 'mod+k';
  @Prop() emptyText = 'No results found';
  @Prop() label = 'Command palette';

  @State() query = '';
  @State() active = 0;

  /** Fires with the chosen command. The palette closes itself. */
  @Event() uiSelect!: EventEmitter<Command>;
  @Event() uiOpenChange!: EventEmitter<boolean>;

  private uid = `ui-palette-${++uid}`;
  private inputEl?: HTMLInputElement;

  @Listen('keydown', { target: 'document' })
  onGlobalKey(ev: KeyboardEvent) {
    if (this.hotkey && matchHotkey(ev, this.hotkey)) {
      ev.preventDefault();
      this.setOpen(!this.open);
    }
  }

  componentDidRender() {
    if (this.open) this.host.shadowRoot?.getElementById(`${this.uid}-opt-${this.active}`)?.scrollIntoView({ block: 'nearest' });
  }

  private setOpen(next: boolean) {
    if (next === this.open) return;
    this.open = next;
    if (next) {
      this.query = '';
      this.active = this.firstEnabled(this.results());
    }
    this.uiOpenChange.emit(next);
  }

  private results(): Command[] {
    const q = this.query.trim();
    if (!q) return this.commands;
    return this.commands
      .map((c) => ({
        c,
        s: Math.max(fuzzyScore(q, c.label), fuzzyScore(q, (c.keywords ?? []).join(' ')) * 0.8, fuzzyScore(q, c.group ?? '') * 0.5),
      }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.c);
  }

  private firstEnabled(list: Command[]): number {
    const i = list.findIndex((c) => !c.disabled);
    return i < 0 ? 0 : i;
  }

  private run(cmd: Command) {
    if (cmd.disabled) return;
    this.uiSelect.emit(cmd);
    this.setOpen(false);
  }

  private onInput = (e: Event) => {
    this.query = (e.target as HTMLInputElement).value;
    this.active = this.firstEnabled(this.results());
  };

  private onKeyDown = (e: KeyboardEvent) => {
    const list = this.results();
    const move = (dir: 1 | -1) => {
      if (!list.length) return;
      let i = this.active;
      for (let n = 0; n < list.length; n++) {
        i = (i + dir + list.length) % list.length;
        if (!list[i].disabled) {
          this.active = i;
          return;
        }
      }
    };
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = list[this.active];
      if (cmd) this.run(cmd);
    }
  };

  render() {
    const list = this.results();
    const grouped = !this.query.trim();
    const listId = `${this.uid}-list`;
    return (
      <Host>
        <ui-modal
          open={this.open}
          placement="palette"
          hideHeader
          label={this.label}
          onUiOpen={() => requestAnimationFrame(() => this.inputEl?.focus())}
          onUiClose={() => this.setOpen(false)}
        >
          <div class="search">
            <ui-icon name="search" />
            <input
              ref={(el) => (this.inputEl = el)}
              class="input"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={list.length ? `${this.uid}-opt-${this.active}` : undefined}
              aria-label={this.label}
              autocomplete="off"
              placeholder={this.placeholder}
              value={this.query}
              onInput={this.onInput}
              onKeyDown={this.onKeyDown}
            />
          </div>
          <ul class="list" id={listId} role="listbox">
            {list.map((c, i) => {
              const showGroup = grouped && c.group && (i === 0 || list[i - 1].group !== c.group);
              return [
                showGroup && (
                  <li class="group" role="presentation" key={`g-${c.group}`}>
                    {c.group}
                  </li>
                ),
                <li
                  key={c.id}
                  id={`${this.uid}-opt-${i}`}
                  role="option"
                  aria-selected={i === this.active ? 'true' : 'false'}
                  aria-disabled={c.disabled ? 'true' : undefined}
                  class={{ option: true, active: i === this.active, disabled: !!c.disabled }}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => !c.disabled && (this.active = i)}
                  onClick={() => this.run(c)}
                >
                  {c.icon && <ui-icon name={c.icon} />}
                  <span class="opt-label">{c.label}</span>
                  {!grouped && c.group && <span class="opt-group">{c.group}</span>}
                  {c.shortcut && <kbd class="shortcut">{c.shortcut}</kbd>}
                </li>,
              ];
            })}
            {list.length === 0 && (
              <li class="empty" role="presentation">
                {this.emptyText}
              </li>
            )}
          </ul>
        </ui-modal>
      </Host>
    );
  }
}
