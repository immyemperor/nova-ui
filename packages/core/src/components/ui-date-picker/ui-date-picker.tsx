import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

let datePickerId = 0;

@Component({
  tag: 'ui-date-picker',
  styleUrls: ['../../global/field.css', 'ui-date-picker.css'],
  shadow: true,
  formAssociated: true,
})
export class UiDatePicker {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop({ mutable: true }) value = '';
  @Prop() label = 'Choose date';
  @Prop() name?: string;
  @Prop() min?: string;
  @Prop() max?: string;
  @Prop() required = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() placeholder = 'YYYY-MM-DD';
  @Prop() locale?: string;

  @State() open = false;
  @State() month = this.monthKey(this.value ? this.parseDate(this.value) ?? new Date() : new Date());

  @Event() uiChange!: EventEmitter<string>;

  private readonly uid = `ui-date-picker-${++datePickerId}`;
  private trigger?: HTMLButtonElement;

  @Watch('required')
  syncForm() {
    if (!this.internals) return;
    this.internals.setFormValue(this.value || null);
    if (this.required && !this.value) this.internals.setValidity({ valueMissing: true }, 'Choose a date.', this.trigger);
    else this.internals.setValidity({});
  }

  @Watch('value')
  onValueChange(value: string) {
    this.syncForm();
    const date = this.parseDate(value);
    if (date) this.month = this.monthKey(date);
  }

  componentWillLoad() {
    this.syncForm();
  }

  formResetCallback() {
    this.value = '';
    this.syncForm();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private parseDate(value: string): Date | undefined {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return;
    return date;
  }

  private monthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private monthDate(): Date {
    const [year, month] = this.month.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }

  private dateValue(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private shiftMonth(amount: number) {
    const date = this.monthDate();
    date.setMonth(date.getMonth() + amount);
    this.month = this.monthKey(date);
  }

  private choose(date: Date) {
    const next = this.dateValue(date);
    if (this.min && next < this.min || this.max && next > this.max) return;
    this.value = next;
    this.syncForm();
    this.uiChange.emit(next);
    this.open = false;
  }

  private isDisabled(date: Date): boolean {
    const value = this.dateValue(date);
    return !!(this.min && value < this.min || this.max && value > this.max);
  }

  private displayValue(): string {
    const date = this.parseDate(this.value);
    return date ? new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' }).format(date) : '';
  }

  render() {
    const monthDate = this.monthDate();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const offset = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: 42 }, (_, index) => {
      const day = index - offset + 1;
      return day > 0 && day <= days ? new Date(year, month, day) : undefined;
    });
    const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(this.locale, { weekday: 'short' }).format(new Date(2024, 0, index + 7)));
    const monthLabel = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(monthDate);

    return (
      <Host>
        <label class="label" htmlFor={`${this.uid}-trigger`}>{this.label}{this.required && <span class="req" aria-hidden="true"> *</span>}</label>
        <ui-popover open={this.open} trigger="manual" placement="bottom-start" panelRole="dialog" label={this.label} onUiOpenChange={(event) => (this.open = event.detail)}>
          <button id={`${this.uid}-trigger`} slot="trigger" class="control" type="button" disabled={this.disabled} aria-haspopup="dialog" aria-expanded={String(this.open)} ref={(el) => (this.trigger = el)} onClick={() => { this.open = !this.open; }}>
            <span class={this.value ? '' : 'placeholder'}>{this.displayValue() || this.placeholder}</span>
            <ui-icon name="calendar" aria-hidden="true" />
          </button>
          <section class="calendar" aria-label={monthLabel}>
            <header class="month-nav">
              <button type="button" aria-label="Previous month" onClick={() => this.shiftMonth(-1)}><ui-icon name="chevron-left" /></button>
              <strong aria-live="polite">{monthLabel}</strong>
              <button type="button" aria-label="Next month" onClick={() => this.shiftMonth(1)}><ui-icon name="chevron-right" /></button>
            </header>
            <div class="grid" role="grid" aria-label={monthLabel}>
              {weekdays.map((weekday) => <span class="weekday" role="columnheader" key={weekday}>{weekday}</span>)}
              {cells.map((date, index) => date ? (
                <button type="button" class={{ day: true, today: this.dateValue(date) === this.dateValue(new Date()), selected: this.value === this.dateValue(date) }} role="gridcell" aria-label={new Intl.DateTimeFormat(this.locale, { dateStyle: 'full' }).format(date)} aria-selected={String(this.value === this.dateValue(date))} disabled={this.isDisabled(date)} key={index} onClick={() => this.choose(date)}>{date.getDate()}</button>
              ) : <span class="blank" aria-hidden="true" key={index} />)}
            </div>
          </section>
        </ui-popover>
      </Host>
    );
  }
}