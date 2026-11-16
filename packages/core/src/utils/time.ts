/** Time-of-day helpers. Values are "HH:mm" (24-hour), matching <input type="time"> and ISO-style APIs. */
export const parseTime = (s?: string | null): { h: number; m: number } | undefined => {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec((s ?? '').trim());
  return m ? { h: Number(m[1]), m: Number(m[2]) } : undefined;
};

export const formatTime = (h: number, m: number): string => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

/** Minutes since midnight, for comparisons and arithmetic. */
export const toMinutes = (s?: string | null): number | undefined => {
  const t = parseTime(s);
  return t ? t.h * 60 + t.m : undefined;
};

export const fromMinutes = (total: number): string => {
  const wrapped = ((total % 1440) + 1440) % 1440;
  return formatTime(Math.floor(wrapped / 60), wrapped % 60);
};

/** 12-hour display, e.g. "2:05 PM". Locale-aware when you pass one. */
export function displayTime(s: string, locale?: string): string {
  const t = parseTime(s);
  if (!t) return '';
  const d = new Date(2000, 0, 1, t.h, t.m);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(d);
}

/** Every slot between min and max, in `stepMinutes` steps (for a dropdown of times). */
export function timeSlots(min = '00:00', max = '23:59', stepMinutes = 30): string[] {
  const a = toMinutes(min) ?? 0, b = toMinutes(max) ?? 1439;
  const out: string[] = [];
  for (let t = a; t <= b; t += stepMinutes) out.push(fromMinutes(t));
  return out;
}

/** Is `value` inside [min, max]? Missing bounds are open. */
export function inTimeRange(value: string, min?: string, max?: string): boolean {
  const v = toMinutes(value);
  if (v === undefined) return false;
  if (min && v < (toMinutes(min) ?? 0)) return false;
  if (max && v > (toMinutes(max) ?? 1439)) return false;
  return true;
}

/** Duration between two times in minutes. Crosses midnight when end is earlier than start. */
export function durationMinutes(start: string, end: string): number | undefined {
  const a = toMinutes(start), b = toMinutes(end);
  if (a === undefined || b === undefined) return undefined;
  return b >= a ? b - a : b + 1440 - a;
}
