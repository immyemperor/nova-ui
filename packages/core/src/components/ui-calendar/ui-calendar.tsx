import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { addDays, addMonths, clampISO, monthGrid, parseISO, sameDay, toISO } from '../../utils/date';

/**
 * Month calendar. Follows the ARIA grid pattern: arrows move by day or week, Home/End jump to the
 * week's edges, PageUp/PageDown change month (with Shift: year), Enter or Space selects.
 */
@Component({
  tag: 'ui-calendar',
  styleUrl: 'ui-calendar.css',
  shadow: true,
})
export class UiCalendar {
  @Element() host!: HTMLElement;

  /** Selected date, "YYYY-MM-DD". */
  @Prop({ mutable: true }) value?: string;
  /** Earliest selectable date, "YYYY-MM-DD". */
  @Prop() min?: string;
  @Prop() max?: string;
  /** BCP 47 locale for month and weekday names. Defaults to the browser's. */
  @Prop() locale?: string;
  /** 0 = Sunday, 1 = Monday. */
  @Prop() firstDayOfWeek = 0;

  /** The day that has keyboard focus (and decides which month is shown). */
  @State() cursor: Date = new Date();

  @Event() uiChange!: EventEmitter<string>;

  @Watch('value')
  syncCursor() {
    const v = parseISO(this.value);
    if (v) this.cursor = v;
  }

  componentWillLoad() {
    const v = parseISO(this.value);
    const today = new Date();
    const start = v ?? today;
    this.cursor = parseISO(clampISO(toISO(start), this.min, this.max)) ?? start;
  }

  /** Move keyboard focus onto the active day. */
  @Method() async focusDay() {
    requestAnimationFrame(() => (this.host.shadowRoot?.querySelector('button[tabindex="0"]') as HTMLElement | null)?.focus());
  }

  private disabled(d: Date): boolean {
    const iso = toISO(d);
    return (!!this.min && iso < this.min) || (!!this.max && iso > this.max);
  }

  private moveTo(d: Date) {
    // Keep the cursor inside the allowed range.
    this.cursor = parseISO(clampISO(toISO(d), this.min, this.max)) ?? d;
    this.focusDay();
  }

  private pick(d: Date) {
    if (this.disabled(d)) return;
    this.value = toISO(d);
    this.cursor = d;
    this.uiChange.emit(this.value);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const c = this.cursor;
    const dow = (c.getDay() - this.firstDayOfWeek + 7) % 7;
    let next: Date | undefined;
    switch (e.key) {
      case 'ArrowLeft': next = addDays(c, -1); break;
      case 'ArrowRight': next = addDays(c, 1); break;
      case 'ArrowUp': next = addDays(c, -7); break;
      case 'ArrowDown': next = addDays(c, 7); break;
      case 'Home': next = addDays(c, -dow); break;
      case 'End': next = addDays(c, 6 - dow); break;
      case 'PageUp': next = addMonths(c, e.shiftKey ? -12 : -1); break;
      case 'PageDown': next = addMonths(c, e.shiftKey ? 12 : 1); break;
      default: return;
    }
    e.preventDefault();
    this.moveTo(next);
  };

  render() {
    const fmt = (opts: Intl.DateTimeFormatOptions, d: Date) => new Intl.DateTimeFormat(this.locale, opts).format(d);
    const year = this.cursor.getFullYear();
    const month = this.cursor.getMonth();
    const grid = monthGrid(year, month, this.firstDayOfWeek);
    const selected = parseISO(this.value);
    const today = new Date();

    // Weekday headers, starting on the configured day (2023-01-01 was a Sunday).
    const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + ((i + this.firstDayOfWeek) % 7)));
    const minYear = parseISO(this.min)?.getFullYear() ?? Math.min(year, today.getFullYear()) - 100;
    const maxYear = parseISO(this.max)?.getFullYear() ?? Math.max(year, today.getFullYear()) + 20;
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    return (
      <Host>
        <div class="head">
          <ui-button variant="ghost" size="sm" icon-only label="Previous month" onClick={() => (this.cursor = addMonths(this.cursor, -1))}>
            <ui-icon name="chevron-left" />
          </ui-button>
          <div class="selects">
            <select class="select" aria-label="Month" onChange={(e) => (this.cursor = new Date(year, Number((e.target as HTMLSelectElement).value), Math.min(this.cursor.getDate(), 28)))}>
              {Array.from({ length: 12 }, (_, m) => (
                <option key={m} value={m} selected={m === month}>
                  {fmt({ month: 'long' }, new Date(2023, m, 1))}
                </option>
              ))}
            </select>
            <select class="select" aria-label="Year" onChange={(e) => (this.cursor = new Date(Number((e.target as HTMLSelectElement).value), month, Math.min(this.cursor.getDate(), 28)))}>
              {years.map((y) => (
                <option key={y} value={y} selected={y === year}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <ui-button variant="ghost" size="sm" icon-only label="Next month" onClick={() => (this.cursor = addMonths(this.cursor, 1))}>
            <ui-icon name="chevron-right" />
          </ui-button>
        </div>

        <table class="grid" role="grid" aria-label={fmt({ month: 'long', year: 'numeric' }, this.cursor)} onKeyDown={this.onKeyDown}>
          <thead>
            <tr>
              {weekdays.map((d) => (
                <th key={d.getDay()} scope="col" abbr={fmt({ weekday: 'long' }, d)}>
                  {fmt({ weekday: 'short' }, d).slice(0, 2)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((week, r) => (
              <tr key={r}>
                {week.map((d) => {
                  const inMonth = d.getMonth() === month;
                  const isSel = !!selected && sameDay(d, selected);
                  const isCursor = sameDay(d, this.cursor);
                  return (
                    <td key={toISO(d)} role="gridcell" aria-selected={isSel ? 'true' : undefined}>
                      <button
                        type="button"
                        class={{ day: true, outside: !inMonth, selected: isSel, today: sameDay(d, today) }}
                        tabindex={isCursor ? 0 : -1}
                        disabled={this.disabled(d)}
                        aria-label={fmt({ dateStyle: 'full' }, d)}
                        aria-current={sameDay(d, today) ? 'date' : undefined}
                        onClick={() => this.pick(d)}
                      >
                        {d.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Host>
    );
  }
}
