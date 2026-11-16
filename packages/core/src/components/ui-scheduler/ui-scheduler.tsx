import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { CalEvent, eventsOnDay, layoutTimed, weekDays } from '../../utils/calendar-events';
import { parseISO, toISO, addDays, addMonths, monthGrid, sameDay } from '../../utils/date';

/**
 * Month and week scheduler. Timed events in week view sit side by side when they overlap.
 * Every event is also a button, so keyboard and screen-reader users get the same information.
 */
@Component({
  tag: 'ui-scheduler',
  styleUrl: 'ui-scheduler.css',
  shadow: true,
})
export class UiScheduler {
  @Prop() events: CalEvent[] = [];
  @Prop({ mutable: true, reflect: true }) view: 'month' | 'week' = 'month';
  /** Date shown, "YYYY-MM-DD". Defaults to today. */
  @Prop({ mutable: true }) date = '';
  @Prop() firstDayOfWeek = 1;
  @Prop() locale?: string;
  /** First and last hour shown in week view. */
  @Prop() dayStart = 7;
  @Prop() dayEnd = 20;
  @Prop() label = 'Schedule';

  @State() focusDate = '';

  @Event() uiEventClick!: EventEmitter<CalEvent>;
  @Event() uiDateChange!: EventEmitter<string>;
  @Event() uiViewChange!: EventEmitter<'month' | 'week'>;

  private anchor(): Date {
    return parseISO(this.date) ?? new Date();
  }

  private go(delta: number) {
    const d = this.anchor();
    const next = this.view === 'month' ? addMonths(d, delta) : addDays(d, delta * 7);
    this.date = toISO(next);
    this.uiDateChange.emit(this.date);
  }

  private setView(v: 'month' | 'week') {
    this.view = v;
    this.uiViewChange.emit(v);
  }

  private title(): string {
    const d = this.anchor();
    if (this.view === 'month') return new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(d);
    const days = weekDays(toISO(d), this.firstDayOfWeek);
    const a = parseISO(days[0])!, b = parseISO(days[6])!;
    const f = new Intl.DateTimeFormat(this.locale, { month: 'short', day: 'numeric' });
    return `${f.format(a)} \u2013 ${f.format(b)}, ${b.getFullYear()}`;
  }

  private eventButton(ev: CalEvent, timed = false) {
    const time = timed && ev.startTime ? `${ev.startTime} ` : '';
    return (
      <button key={`${ev.id}-${ev.start}`} type="button" class="event" style={ev.color ? { '--_ev': ev.color } : undefined}
        onClick={() => this.uiEventClick.emit(ev)} aria-label={`${time}${ev.title}`}>
        <span class="ev-title">{time}{ev.title}</span>
      </button>
    );
  }

  private renderMonth() {
    const d = this.anchor();
    const rows = monthGrid(d.getFullYear(), d.getMonth(), this.firstDayOfWeek);
    const today = new Date();
    const names = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(this.locale, { weekday: 'short' }).format(new Date(2023, 0, 1 + ((i + this.firstDayOfWeek) % 7))));
    return (
      <table class="grid" role="grid" aria-label={this.title()}>
        <thead><tr>{names.map((n) => <th key={n} scope="col">{n}</th>)}</tr></thead>
        <tbody>
          {rows.map((week, wi) => (
            <tr key={wi}>
              {week.map((day) => {
                const iso = toISO(day);
                const evs = eventsOnDay(this.events, iso);
                const other = day.getMonth() !== d.getMonth();
                return (
                  <td key={iso} role="gridcell" class={{ cell: true, other, today: sameDay(day, today) }}>
                    <span class="num">{day.getDate()}</span>
                    <div class="evs">
                      {evs.slice(0, 3).map((e) => this.eventButton(e))}
                      {evs.length > 3 && <span class="more">+{evs.length - 3}</span>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  private renderWeek() {
    const days = weekDays(toISO(this.anchor()), this.firstDayOfWeek);
    const startMin = this.dayStart * 60, endMin = this.dayEnd * 60;
    const hours = Array.from({ length: this.dayEnd - this.dayStart }, (_, i) => this.dayStart + i);
    const height = 48; // px per hour
    const minutesToPx = (m: number) => ((m - startMin) / 60) * height;
    return (
      <div class="week" role="grid" aria-label={this.title()}>
        <div class="corner" />
        {days.map((iso) => {
          const d = parseISO(iso)!;
          return <div key={iso} class="dayhead" role="columnheader">{new Intl.DateTimeFormat(this.locale, { weekday: 'short', day: 'numeric' }).format(d)}</div>;
        })}
        <div class="hours" style={{ height: `${hours.length * height}px` }}>
          {hours.map((hr) => <span key={hr} class="hour" style={{ top: `${(hr - this.dayStart) * height}px` }}>{String(hr).padStart(2, '0')}:00</span>)}
        </div>
        {days.map((iso) => {
          const timed = layoutTimed(eventsOnDay(this.events, iso), startMin, endMin);
          const byId = Object.fromEntries(eventsOnDay(this.events, iso).map((e) => [e.id, e]));
          const allDay = eventsOnDay(this.events, iso).filter((e) => !e.startTime);
          return (
            <div key={iso} class="col" role="gridcell" style={{ height: `${hours.length * height}px` }}>
              {allDay.map((e) => this.eventButton(e))}
              {timed.map((p) => {
                const ev = byId[p.id];
                const w = 100 / p.lanes;
                return (
                  <div key={p.id} class="timed" style={{ top: `${minutesToPx(startMin + p.top)}px`, height: `${p.height / 60 * height}px`, left: `${p.lane * w}%`, width: `calc(${w}% - 4px)` }}>
                    {this.eventButton(ev, true)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="bar">
          <div class="nav">
            <button type="button" class="btn" aria-label={this.view === 'month' ? 'Previous month' : 'Previous week'} onClick={() => this.go(-1)}>‹</button>
            <button type="button" class="btn" onClick={() => { this.date = toISO(new Date()); this.uiDateChange.emit(this.date); }}>Today</button>
            <button type="button" class="btn" aria-label={this.view === 'month' ? 'Next month' : 'Next week'} onClick={() => this.go(1)}>›</button>
            <h3 class="title" aria-live="polite">{this.title()}</h3>
          </div>
          <div class="views" role="group" aria-label="View">
            <button type="button" class={{ btn: true, on: this.view === 'month' }} aria-pressed={this.view === 'month' ? 'true' : 'false'} onClick={() => this.setView('month')}>Month</button>
            <button type="button" class={{ btn: true, on: this.view === 'week' }} aria-pressed={this.view === 'week' ? 'true' : 'false'} onClick={() => this.setView('week')}>Week</button>
          </div>
        </div>
        <div class="body" role="region" aria-label={this.label}>
          {this.view === 'month' ? this.renderMonth() : this.renderWeek()}
        </div>
      </Host>
    );
  }
}
