import { parseISO, toISO } from './date';

/** A range of "YYYY-MM-DD" strings, inclusive. Either end may be missing while the user is choosing. */
export interface DateRange { start?: string; end?: string }

/** Pure range rules, shared by the picker and by tests. */
export function normaliseRange(r: DateRange): DateRange {
  if (!r.start || !r.end) return { ...r };
  return r.start <= r.end ? { start: r.start, end: r.end } : { start: r.end, end: r.start };
}

/**
 * Apply one click on a day, the way range pickers usually work:
 *   no range yet, or a finished range  -> start a new range at the day
 *   start only                          -> complete the range (order is fixed for you)
 */
export function pickDay(current: DateRange, iso: string): DateRange {
  if (!current.start || (current.start && current.end)) return { start: iso, end: undefined };
  return normaliseRange({ start: current.start, end: iso });
}

export function inRange(r: DateRange, iso: string): boolean {
  if (!r.start || !r.end) return false;
  return iso >= r.start && iso <= r.end;
}

/** Number of days in the range, inclusive. */
export function rangeLength(r: DateRange): number {
  const a = parseISO(r.start), b = parseISO(r.end);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
}

/** Presets used by range pickers. `today` is injectable so tests are deterministic. */
export function presetRanges(today: Date): Record<'last7' | 'last30' | 'thisMonth' | 'thisYear', DateRange> {
  const day = (d: Date) => toISO(d);
  const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return {
    last7: { start: day(addDays(today, -6)), end: day(today) },
    last30: { start: day(addDays(today, -29)), end: day(today) },
    thisMonth: { start: day(new Date(today.getFullYear(), today.getMonth(), 1)), end: day(today) },
    thisYear: { start: day(new Date(today.getFullYear(), 0, 1)), end: day(today) },
  };
}
