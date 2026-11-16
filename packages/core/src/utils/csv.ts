/**
 * CSV export. RFC 4180 quoting, plus a guard against spreadsheet formula injection:
 * a cell starting with = + - @ (or a tab or carriage return) is prefixed with an apostrophe so Excel and
 * Sheets show it as text instead of running it as a formula.
 */
export interface CsvColumn { key: string; label: string; format?: (value: unknown, row: Record<string, unknown>) => string }

const FORMULA_START = /^[=+\-@\t\r]/;

export function escapeCell(value: unknown): string {
  let s = value == null ? '' : value instanceof Date ? value.toISOString() : String(value);
  if (FORMULA_START.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`; // numbers like -4.5 are safe
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(rows: Record<string, unknown>[], columns: CsvColumn[], delimiter = ','): string {
  const header = columns.map((c) => escapeCell(c.label)).join(delimiter);
  const body = rows.map((row) =>
    columns.map((c) => escapeCell(c.format ? c.format(row[c.key], row) : row[c.key])).join(delimiter),
  );
  return [header, ...body].join('\r\n') + '\r\n';
}

/** Filename safe across operating systems. */
export function safeFilename(name: string): string {
  const base = name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-') // path separators and reserved characters
    .replace(/\.\.+/g, '-')                       // dot segments like ".." can't survive
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');                 // no leading or trailing dashes or dots
  return (base || 'export') + (base.toLowerCase().endsWith('.csv') ? '' : '.csv');
}
