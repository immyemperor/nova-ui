/** Scheduler maths: which events fall on a day, and how overlapping timed events share a column. Pure. */
import { parseISO, toISO, addDays } from './date';

export interface CalEvent {
  id: string;
  title: string;
  /** "YYYY-MM-DD" */
  start: string;
  /** Inclusive "YYYY-MM-DD". Defaults to start. */
  end?: string;
  /** "HH:mm" for timed events. Omit for all-day events. */
  startTime?: string;
  endTime?: string;
  color?: string;
}

/** Events that cover `iso` (multi-day events appear on every day they span). */
export function eventsOnDay(events: CalEvent[], iso: string): CalEvent[] {
  return events
    .filter((e) => e.start <= iso && (e.end ?? e.start) >= iso)
    .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.title.localeCompare(b.title));
}

export function minutesOf(t?: string): number | undefined {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t ?? '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : undefined;
}

export interface LaidOutEvent { id: string; lane: number; lanes: number; top: number; height: number }

/**
 * Week/day view layout. Timed events that overlap in time share the column width: each gets a "lane",
 * and `lanes` is how many lanes its overlapping group needs. Positions are in minutes from `dayStart`.
 */
export function layoutTimed(events: CalEvent[], dayStart = 0, dayEnd = 1440, minHeight = 20): LaidOutEvent[] {
  const timed = events
    .map((e) => {
      const s = minutesOf(e.startTime), en = minutesOf(e.endTime) ?? (s !== undefined ? s + 30 : undefined);
      return s === undefined || en === undefined ? undefined : { id: e.id, s: Math.max(dayStart, s), e: Math.min(dayEnd, Math.max(en, s + 1)) };
    })
    .filter((x): x is { id: string; s: number; e: number } => !!x)
    .sort((a, b) => a.s - b.s || b.e - a.e);

  const out: LaidOutEvent[] = [];
  let group: { id: string; s: number; e: number; lane: number }[] = [];
  let groupEnd = -1;
  const flush = () => {
    const lanes = Math.max(1, ...group.map((g) => g.lane + 1));
    for (const g of group) out.push({ id: g.id, lane: g.lane, lanes, top: g.s - dayStart, height: Math.max(minHeight, g.e - g.s) });
    group = [];
  };
  for (const ev of timed) {
    if (group.length && ev.s >= groupEnd) { flush(); groupEnd = -1; }
    const laneEnds: number[] = group.length ? group.map((g) => g.e) : [];
    let lane = 0;
    while (lane < laneEnds.length && laneEnds[lane] > ev.s) lane++;
    group.push({ ...ev, lane });
    groupEnd = Math.max(groupEnd, ev.e);
  }
  if (group.length) flush();
  return out;
}

/** Monday-to-Sunday (or from `firstDay`) dates of the week containing `iso`. */
export function weekDays(iso: string, firstDay = 1): string[] {
  const d = parseISO(iso);
  if (!d) return [];
  const offset = (d.getDay() - firstDay + 7) % 7;
  const start = addDays(d, -offset);
  return Array.from({ length: 7 }, (_, i) => toISO(addDays(start, i)));
}
