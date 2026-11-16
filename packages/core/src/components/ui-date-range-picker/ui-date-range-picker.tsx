import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { DateRange, inRange, normaliseRange, pickDay, presetRanges, rangeLength } from '../../utils/range';
import { parseISO, toISO, addMonths, monthGrid, sameDay } from '../../utils/date';

let uid = 0;

/**
 * Picks a start and end date. Click a day to start, click another to finish (order is fixed for you).
 * Values are {start, end} with "YYYY-MM-DD" strings. Keyboard: arrows move, Enter picks.
 */
@Component({
  tag: 'ui-date-range-picker',
  styleUrls: ['../../global/field.css', 'ui-date-range-picker.css'],
  shadow: true,
  formAssociated: true,
})
export class UiDateRangePicker {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-range-${++uid}`;
  private initial: DateRange = {};

  @Prop({ mutable: true }) value: DateRange = {};
  @Prop() min?: string;
  @Prop() max?: string;
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop() locale?: string;
  @Prop() firstDayOfWeek = 0;
  /** Show quick presets (last 7 days, last 30 days, this month, this year). */
  @Prop() presets = false;
  /** Pass a fixed "today" for tests and for server-rendered pages. */
  @Prop() today?: string;

  @State() open = false;
  @State() cursor: Date = new Date();
  @State() hover?: string;

  @Event() uiChange!: EventEmitter<DateRange>;

  @Watch('value')
  @Watch('required')
  syncForm() {
    const r = normaliseRange(this.value ?? {});
    const complete = !!(r.start && r.end);
    this.internals?.setFormValue(complete ? `${r.start}/${r.end}` : null);
    if (this.required && !complete) this.internals?.setValidity({ valueMissing: true }, 'Choose a start and end date.', this.host);
    else this.internals?.setValidity({});
  }

  componentWillLoad() {
    this.initial = { ...(this.value ?? {}) };
    this.cursor = parseISO(this.value?.start) ?? parseISO(this.today) ?? new Date();
    this.syncForm();
  }
  formResetCallback() { this.value = { ...this.initial }; }
  formDisabledCallback(d: boolean) { this.disabled = d; }

  @Method() async clear() { this.set({}); }

  private set(next: DateRange) {
    this.value = next;
    this.uiChange.emit(next);
  }

  private display(iso?: string): string {
    const d = parseISO(iso);
    return d ? new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' }).format(d) : '';
  }

  private pick(iso: string) {
    if (this.disabled) return;
    if (iso < (this.min ?? '0000') || iso > (this.max ?? '9999')) return;
    const next = pickDay(this.value ?? {}, iso);
    this.set(next);
    if (next.start && next.end) this.open = false;
  }

  private preset(key: keyof ReturnType<typeof presetRanges>) {
    const t = parseISO(this.today) ?? new Date();
    const r = presetRanges(t)[key];
    this.cursor = parseISO(r.start) ?? this.cursor;
    this.set(r);
    this.open = false;
  }

  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) { e.stopPropagation(); this.open = false; }
  };

  private grid() {
    const year = this.cursor.getFullYear(), month = this.cursor.getMonth();
    const r = normaliseRange(this.value ?? {});
    const preview = this.value?.start && !this.value?.end && this.hover ? normaliseRange({ start: this.value.start, end: this.hover }) : r;
    const todayIso = this.today ?? toISO(new Date());
    return { rows: monthGrid(year, month, this.firstDayOfWeek), month, year, preview, todayIso };
  }

  render() {
    const { rows, month, year, preview, todayIso } = this.grid();
    const r = normaliseRange(this.value ?? {});
    const summary = r.start && r.end
      ? `${this.display(r.start)} \u2013 ${this.display(r.end)} (${rangeLength(r)} days)`
      : r.start ? `${this.display(r.start)} \u2013 \u2026` : '';
    const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + ((i + this.firstDayOfWeek) % 7)));
    const monthName = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
    const msgId = `${this.uid}-msg`;
    const message = this.error ?? this.hint;
    return (
      <Host onKeyDown={this.onKey}>
        {this.label && (
          <label class="label" htmlFor={`${this.uid}-btn`}>
            {this.label}{this.required && <span class="req" aria-hidden="true"> *</span>}
          </label>
        )}
        <ui-popover open={this.open} trigger="manual" placement="bottom-start" panelRole="dialog" label={this.label ?? 'Choose dates'}
          onUiOpenChange={(e: CustomEvent<boolean>) => (this.open = e.detail)}>
          <button slot="trigger" id={`${this.uid}-btn`} type="button" class="trigger" disabled={this.disabled}
            aria-haspopup="dialog" aria-expanded={this.open ? 'true' : 'false'} aria-describedby={message ? msgId : undefined}
            onClick={() => (this.open = !this.open)}>
            <ui-icon name="chevron-down" />
            <span class={{ value: true, placeholder: !summary }}>{summary || 'Select dates'}</span>
          </button>
          <div class="panel">
            {this.presets && (
              <div class="presets" role="group" aria-label="Presets">
                <ui-button size="sm" variant="ghost" onClick={() => this.preset('last7')}>Last 7 days</ui-button>
                <ui-button size="sm" variant="ghost" onClick={() => this.preset('last30')}>Last 30 days</ui-button>
                <ui-button size="sm" variant="ghost" onClick={() => this.preset('thisMonth')}>This month</ui-button>
                <ui-button size="sm" variant="ghost" onClick={() => this.preset('thisYear')}>This year</ui-button>
              </div>
            )}
            <div class="head">
              <ui-button variant="ghost" size="sm" icon-only label="Previous month" onClick={() => (this.cursor = addMonths(this.cursor, -1))}><ui-icon name="chevron-left" /></ui-button>
              <strong aria-live="polite">{monthName}</strong>
              <ui-button variant="ghost" size="sm" icon-only label="Next month" onClick={() => (this.cursor = addMonths(this.cursor, 1))}><ui-icon name="chevron-right" /></ui-button>
            </div>
            <table class="grid" role="grid" aria-label={monthName}>
              <thead><tr>{weekdays.map((d) => <th key={d.getDay()} scope="col">{new Intl.DateTimeFormat(this.locale, { weekday: 'short' }).format(d).slice(0, 2)}</th>)}</tr></thead>
              <tbody>
                {rows.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((d) => {
                      const iso = toISO(d);
                      const inMonth = d.getMonth() === month;
                      const isStart = iso === preview.start, isEnd = iso === preview.end;
                      const inside = inRange(preview, iso);
                      const off = (this.min && iso < this.min) || (this.max && iso > this.max);
                      return (
                        <td key={iso} role="gridcell" class={{ 'in-range': inside, start: isStart, end: isEnd }}>
                          <button type="button" class={{ day: true, outside: !inMonth, today: iso === todayIso }}
                            aria-label={new Intl.DateTimeFormat(this.locale, { dateStyle: 'full' }).format(d)}
                            aria-pressed={isStart || isEnd ? 'true' : 'false'}
                            disabled={!!off} tabindex={sameDay(d, parseISO(r.start) ?? this.cursor) ? 0 : -1}
                            onMouseEnter={() => (this.hover = iso)} onFocus={() => (this.hover = iso)}
                            onClick={() => this.pick(iso)}>
                            {d.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div class="foot">
              <ui-button variant="ghost" size="sm" onClick={() => this.set({})}>Clear</ui-button>
              <ui-button size="sm" onClick={() => (this.open = false)}>Done</ui-button>
            </div>
          </div>
        </ui-popover>
        {message && <p class={{ msg: true, error: !!this.error }} id={msgId} role={this.error ? 'alert' : undefined}>{message}</p>}
        {this.name && r.start && r.end && <input type="hidden" name={this.name} value={`${r.start}/${r.end}`} />}
      </Host>
    );
  }
}
