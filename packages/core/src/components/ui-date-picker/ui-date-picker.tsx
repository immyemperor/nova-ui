import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { parseISO } from '../../utils/date';

let uid = 0;

/**
 * Date field with a calendar popup. Type a date as YYYY-MM-DD, or pick one.
 * The value is always a plain "YYYY-MM-DD" string.
 */
@Component({
  tag: 'ui-date-picker',
  styleUrls: ['../../global/field.css', 'ui-date-picker.css'],
  shadow: true,
  formAssociated: true,
})
export class UiDatePicker {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-date-${++uid}`;
  private inputEl?: HTMLInputElement;
  private calendar?: HTMLElement & { focusDay: () => Promise<void> };
  private initialValue = '';

  @Prop({ mutable: true }) value = '';
  @Prop() min?: string;
  @Prop() max?: string;
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() placeholder = 'YYYY-MM-DD';
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop() clearable = false;
  @Prop() locale?: string;
  @Prop() firstDayOfWeek = 0;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @State() open = false;
  @State() editing = false;
  @State() text = '';

  /** Fires with "YYYY-MM-DD", or "" when cleared. */
  @Event() uiChange!: EventEmitter<string>;

  @Method() async focusInput() {
    this.inputEl?.focus();
  }

  @Watch('value')
  @Watch('required')
  syncForm() {
    this.internals?.setFormValue(this.value || null);
    if (this.required && !this.value) this.internals?.setValidity({ valueMissing: true }, 'Choose a date.', this.inputEl);
    else this.internals?.setValidity({});
  }

  componentWillLoad() {
    this.initialValue = this.value;
    this.syncForm();
  }

  formResetCallback() {
    this.value = this.initialValue;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private display(): string {
    const d = parseISO(this.value);
    return d ? new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' }).format(d) : '';
  }

  private inRange(iso: string): boolean {
    return (!this.min || iso >= this.min) && (!this.max || iso <= this.max);
  }

  private set(iso: string) {
    if (iso === this.value) return;
    this.value = iso;
    this.uiChange.emit(iso);
  }

  /** Typed text becomes the value only if it's a real, in-range date. */
  private commitText() {
    const t = this.text.trim();
    if (!t) this.set('');
    else if (parseISO(t) && this.inRange(t)) this.set(t);
    this.editing = false;
  }

  private openCalendar() {
    if (this.disabled) return;
    this.open = true;
  }

  private onPick = (e: CustomEvent<string>) => {
    e.stopPropagation();
    this.set(e.detail);
    this.open = false;
    this.inputEl?.focus();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.editing) this.commitText();
      else this.openCalendar();
    } else if (e.key === 'ArrowDown' && !this.open) {
      e.preventDefault();
      this.openCalendar();
    }
  };

  render() {
    const message = this.error ?? this.hint;
    const msgId = `${this.uid}-msg`;
    const shown = this.editing ? this.text : this.display();
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
          panelRole="dialog"
          label="Choose date"
          onUiOpenChange={(e) => (this.open = e.detail)}
          onUiShow={() => this.calendar?.focusDay()}
        >
          <div slot="trigger" class="control" data-invalid={this.error ? 'true' : 'false'}>
            <input
              id={this.uid}
              class="native"
              ref={(el) => (this.inputEl = el)}
              value={shown}
              placeholder={this.placeholder}
              disabled={this.disabled}
              autocomplete="off"
              aria-invalid={this.error ? 'true' : undefined}
              aria-describedby={message ? msgId : undefined}
              onFocus={() => {
                this.editing = true;
                this.text = this.value;
              }}
              onInput={(e) => (this.text = (e.target as HTMLInputElement).value)}
              onBlur={() => this.commitText()}
              onKeyDown={this.onKeyDown}
            />
            {this.clearable && this.value && !this.disabled && (
              <button type="button" class="icon-btn" aria-label="Clear date" tabindex={-1} onClick={() => this.set('')}>
                <ui-icon name="x" />
              </button>
            )}
            <button type="button" class="icon-btn" aria-label={this.open ? 'Close calendar' : 'Open calendar'} disabled={this.disabled} onClick={() => (this.open ? (this.open = false) : this.openCalendar())}>
              <ui-icon name="chevron-down" />
            </button>
          </div>
          <ui-calendar
            ref={(el) => (this.calendar = el as any)}
            value={this.value}
            min={this.min}
            max={this.max}
            locale={this.locale}
            firstDayOfWeek={this.firstDayOfWeek}
            onUiChange={this.onPick}
          />
        </ui-popover>
        {message && (
          <p class={{ msg: true, error: !!this.error }} id={msgId} role={this.error ? 'alert' : undefined}>
            {message}
          </p>
        )}
      </Host>
    );
  }
}
