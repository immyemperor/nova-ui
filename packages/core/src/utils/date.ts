/** Calendar-date helpers. Dates are plain "YYYY-MM-DD" strings, so time zones never shift them. */
const pad = (n: number, w = 2) => String(n).padStart(w, '0');

export function toISO(d: Date): string {
  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parse "YYYY-MM-DD" into a local Date. Returns undefined for anything invalid (including 2025-02-31). */
export function parseISO(s?: string | null): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((s ?? '').trim());
  if (!m) return undefined;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : undefined;
}

export const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Move by whole months, clamping the day (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
}

export const sameDay = (a: Date, b: Date): boolean => toISO(a) === toISO(b);

export function clampISO(iso: string, min?: string, max?: string): string {
  if (min && iso < min) return min;
  if (max && iso > max) return max;
  return iso;
}

/** 6 rows x 7 columns of dates covering the month, starting on `firstDay` (0 = Sunday). */
export function monthGrid(year: number, month: number, firstDay: number): Date[][] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - firstDay + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_c, c) => addDays(start, r * 7 + c)));
}
