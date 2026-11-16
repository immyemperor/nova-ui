import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import type { SelectOption } from '../../types';
import { fuzzyScore } from '../../utils/search';
import { t } from '../../i18n';

let uid = 0;

/**
 * Searchable dropdown (combobox). Single or multiple selection, type to filter, full keyboard support.
 * Set `filter={false}` and listen to uiSearch to load options from a server instead.
 */
@Component({
  tag: 'ui-select',
  styleUrls: ['../../global/field.css', 'ui-select.css'],
  shadow: true,
  formAssociated: true,
})
export class UiSelect {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-select-${++uid}`;
  private inputEl?: HTMLInputElement;
  private initialValue: string | string[] = '';

  /** A string, or an array of strings when `multiple`. */
  @Prop({ mutable: true }) value: string | string[] = '';
  @Prop() options: SelectOption[] = [];
  @Prop() multiple = false;
  /** Let people type to filter. When false it behaves like a plain select. */
  @Prop() searchable = true;
  @Prop() clearable = false;
  /** Filter options in the browser. Turn off when you filter on the server. */
  @Prop() filter = true;
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() placeholder?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop() emptyText = 'No matches';
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @State() query = '';
  @State() open = false;
  @State() active = -1;

  /** Fires when the selection changes. */
  @Event() uiChange!: EventEmitter<string | string[]>;
  /** Fires as the user types. Use it to fetch options when `filter` is off. */
  @Event() uiSearch!: EventEmitter<string>;

  @Method() async focusInput() {
    this.inputEl?.focus();
  }

  @Watch('value')
  @Watch('required')
  syncForm() {
    if (!this.internals) return;
    const sel = this.selected();
    if (this.multiple) {
      const fd = new FormData();
      if (this.name) sel.forEach((v) => fd.append(this.name as string, v));
      this.internals.setFormValue(fd);
    } else {
      this.internals.setFormValue(sel[0] ?? null);
    }
    if (this.required && sel.length === 0) this.internals.setValidity({ valueMissing: true }, t('selectOption'), this.inputEl);
    else this.internals.setValidity({});
  }

  componentWillLoad() {
    this.initialValue = this.value;
    this.syncForm();
  }

  componentDidRender() {
    if (this.open && this.active >= 0) {
      this.host.shadowRoot?.getElementById(`${this.uid}-opt-${this.active}`)?.scrollIntoView({ block: 'nearest' });
    }
  }

  formResetCallback() {
    this.value = this.initialValue;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private selected(): string[] {
    const v = this.value;
    if (Array.isArray(v)) return this.multiple ? v : v.slice(0, 1);
    return v ? [v] : [];
  }

  private labelOf(value: string): string {
    return this.options.find((o) => o.value === value)?.label ?? value;
  }

  private visible(): SelectOption[] {
    const q = this.query.trim();
    if (!this.filter || !q) return this.options;
    return this.options
      .map((o) => ({ o, s: fuzzyScore(q, o.label) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.o);
  }

  private firstEnabled(list: SelectOption[]): number {
    return list.findIndex((o) => !o.disabled);
  }

  private setOpen(next: boolean) {
    if (next === this.open || this.disabled) return;
    this.open = next;
    if (next) {
      const vis = this.visible();
      const current = this.selected()[0];
      const at = current ? vis.findIndex((o) => o.value === current && !o.disabled) : -1;
      this.active = at >= 0 ? at : this.firstEnabled(vis);
    } else {
      this.query = '';
      this.active = -1;
    }
  }

  private choose(option: SelectOption) {
    if (option.disabled) return;
    if (this.multiple) {
      const cur = this.selected();
      const next = cur.includes(option.value) ? cur.filter((v) => v !== option.value) : [...cur, option.value];
      this.value = next;
      this.uiChange.emit(next);
      this.query = '';
      this.inputEl?.focus();
    } else {
      this.value = option.value;
      this.uiChange.emit(option.value);
      this.setOpen(false);
    }
  }

  private remove(value: string) {
    const next = this.selected().filter((v) => v !== value);
    this.value = next;
    this.uiChange.emit(next);
  }

  private clear = (e: Event) => {
    e.stopPropagation();
    this.value = this.multiple ? [] : '';
    this.uiChange.emit(this.value);
    this.inputEl?.focus();
  };

  private onInput = (e: Event) => {
    this.query = (e.target as HTMLInputElement).value;
    if (!this.open) this.setOpen(true);
    this.active = this.firstEnabled(this.visible());
    this.uiSearch.emit(this.query);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    const vis = this.visible();
    const move = (dir: 1 | -1) => {
      if (!vis.length) return;
      let i = this.active;
      for (let n = 0; n < vis.length; n++) {
        i = (i + dir + vis.length) % vis.length;
        if (!vis[i].disabled) {
          this.active = i;
          return;
        }
      }
    };
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this.open) this.setOpen(true);
        else move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this.open) this.setOpen(true);
        else move(-1);
        break;
      case 'Enter':
        if (this.open) {
          e.preventDefault(); // don't submit the surrounding form
          const o = vis[this.active];
          if (o) this.choose(o);
        }
        break;
      case 'Escape':
        if (this.open) {
          e.preventDefault();
          this.setOpen(false);
        }
        break;
      case 'Tab':
        this.setOpen(false);
        break;
      case ' ':
        if (!this.searchable) {
          e.preventDefault();
          this.setOpen(!this.open);
        }
        break;
      case 'Backspace': {
        const sel = this.selected();
        if (this.multiple && !this.query && sel.length) this.remove(sel[sel.length - 1]);
        break;
      }
    }
  };

  private onControlClick = () => {
    if (this.disabled) return;
    this.inputEl?.focus();
    if (!this.open) this.setOpen(true);
    else if (!this.searchable) this.setOpen(false);
  };

  render() {
    const vis = this.visible();
    const sel = this.selected();
    const singleLabel = !this.multiple && sel[0] ? this.labelOf(sel[0]) : '';
    const message = this.error ?? this.hint;
    const listId = `${this.uid}-list`;
    const inputValue = !this.searchable ? (this.multiple ? '' : singleLabel) : this.multiple || this.open ? this.query : singleLabel;
    const placeholder = this.multiple && sel.length ? '' : this.open && singleLabel ? singleLabel : this.placeholder;

    return (
      <Host>
        {this.label && (
          <label class="label" htmlFor={this.uid}>
            {this.label}
            {this.required && <span class="req" aria-hidden="true"> *</span>}
          </label>
        )}
        <ui-popover
          open={this.open}
          trigger="manual"
          placement="bottom-start"
          matchWidth
          panelRole="none"
          onUiOpenChange={(e) => this.setOpen(e.detail)}
        >
          <div slot="trigger" class="control" data-invalid={this.error ? 'true' : 'false'} onClick={this.onControlClick}>
            {this.multiple &&
              sel.map((v) => (
                <span class="chip" key={v}>
                  {this.labelOf(v)}
                  <button
                    type="button"
                    class="chip-x"
                    tabindex={-1}
                    aria-label={`Remove ${this.labelOf(v)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.remove(v);
                    }}
                  >
                    <ui-icon name="x" />
                  </button>
                </span>
              ))}
            <input
              id={this.uid}
              class="native"
              ref={(el) => (this.inputEl = el)}
              role="combobox"
              aria-expanded={this.open ? 'true' : 'false'}
              aria-controls={listId}
              aria-autocomplete={this.searchable ? 'list' : 'none'}
              aria-activedescendant={this.open && this.active >= 0 ? `${this.uid}-opt-${this.active}` : undefined}
              aria-invalid={this.error ? 'true' : undefined}
              autocomplete="off"
              value={inputValue}
              placeholder={placeholder}
              disabled={this.disabled}
              readOnly={!this.searchable}
              onInput={this.onInput}
              onKeyDown={this.onKeyDown}
            />
            {this.clearable && sel.length > 0 && !this.disabled && (
              <button type="button" class="icon-btn" aria-label={t('clearSelection')} tabindex={-1} onClick={this.clear}>
                <ui-icon name="x" />
              </button>
            )}
            <ui-icon class="chevron" name="chevron-down" />
          </div>
          <ul class="list" id={listId} role="listbox" aria-multiselectable={this.multiple ? 'true' : undefined} aria-label={this.label}>
            {vis.map((o, i) => {
              const isSelected = sel.includes(o.value);
              return (
                <li
                  key={o.value}
                  id={`${this.uid}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected ? 'true' : 'false'}
                  aria-disabled={o.disabled ? 'true' : undefined}
                  class={{ option: true, active: i === this.active, selected: isSelected, disabled: !!o.disabled }}
                  // Keep focus in the input while clicking an option.
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => !o.disabled && (this.active = i)}
                  onClick={() => this.choose(o)}
                >
                  <span class="opt-text">
                    <span class="opt-label">{o.label}</span>
                    {o.description && <span class="opt-desc">{o.description}</span>}
                  </span>
                  {isSelected && <ui-icon name="check" />}
                </li>
              );
            })}
            {vis.length === 0 && (
              <li class="empty" role="presentation">
                {this.emptyText}
              </li>
            )}
          </ul>
        </ui-popover>
        {message && (
          <p class={{ msg: true, error: !!this.error }} role={this.error ? 'alert' : undefined}>
            {message}
          </p>
        )}
      </Host>
    );
  }
}
