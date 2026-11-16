/**
 * Chart maths. Pure functions, no DOM: scales, "nice" axis ticks, and SVG path/geometry builders.
 * The chart components turn these into <svg> markup, and tests check the numbers directly.
 */
export interface Point { x: number; y: number }

/** Linear map from a data domain to a pixel range. Degenerate domains map to the middle of the range. */
export function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain, [r0, r1] = range;
  const span = d1 - d0;
  return (v: number) => (span === 0 ? (r0 + r1) / 2 : r0 + ((v - d0) / span) * (r1 - r0));
}

/**
 * "Nice" tick values covering [min, max] with about `count` ticks, using 1, 2, 2.5 or 5 times a power of ten.
 * Always includes values that fully cover the data.
 */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  if (min === max) { min -= 1; max += 1; }
  const rough = (max - min) / Math.max(1, count - 1);
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const frac = rough / pow;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10;
  const step = niceFrac * pow;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(round(v, step));
  return ticks;
}

/** Remove floating-point noise (0.30000000000000004 -> 0.3) at the precision of the step. */
function round(v: number, step: number): number {
  const digits = Math.max(0, -Math.floor(Math.log10(step)) + 2);
  return Number(v.toFixed(digits));
}

/** Min and max of numbers, ignoring NaN. Returns [0, 1] when there are none. */
export function extent(values: number[]): [number, number] {
  const v = values.filter((n) => Number.isFinite(n));
  if (!v.length) return [0, 1];
  return [Math.min(...v), Math.max(...v)];
}

/** Points for a line across an evenly spaced x-axis. */
export function linePoints(values: number[], width: number, height: number, pad = 0, domain?: [number, number]): Point[] {
  const [lo, hi] = domain ?? extent(values);
  const y = linearScale([lo, hi], [height - pad, pad]);
  const step = values.length > 1 ? (width - 2 * pad) / (values.length - 1) : 0;
  return values.map((v, i) => ({ x: pad + i * step, y: Number.isFinite(v) ? y(v) : height - pad }));
}

/** SVG path data for a straight-segment line. */
export function linePath(points: Point[]): string {
  return points.map((p, i) => `${i ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`).join(' ');
}

/** SVG path for the filled area under a line, closed at the baseline. */
export function areaPath(points: Point[], baseline: number): string {
  if (!points.length) return '';
  const first = points[0], last = points[points.length - 1];
  return `${linePath(points)} L${f(last.x)} ${f(baseline)} L${f(first.x)} ${f(baseline)} Z`;
}

/** Bars for a categorical axis: one rectangle per value, growing from the baseline. */
export interface Bar { x: number; y: number; width: number; height: number; value: number; index: number }
export function bars(values: number[], width: number, height: number, pad = 0, gapRatio = 0.25, domain?: [number, number]): Bar[] {
  const [lo, hi] = domain ?? extent([0, ...values]);
  const y = linearScale([lo, hi], [height - pad, pad]);
  const base = y(Math.max(lo, Math.min(0, hi)));
  const n = values.length || 1;
  const slot = (width - 2 * pad) / n;
  const w = slot * (1 - gapRatio);
  return values.map((v, i) => {
    const top = y(v);
    return { x: pad + i * slot + (slot - w) / 2, y: Math.min(top, base), width: w, height: Math.abs(base - top), value: v, index: i };
  });
}

/** Donut segments as arc paths. Values are proportional; zero or negative values are skipped. */
export interface Slice { path: string; start: number; end: number; value: number; index: number; fraction: number }
export function donutSlices(values: number[], cx: number, cy: number, rOuter: number, rInner: number): Slice[] {
  const clean = values.map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const total = clean.reduce((a, b) => a + b, 0);
  if (total <= 0) return [];
  let angle = -Math.PI / 2;
  const out: Slice[] = [];
  clean.forEach((v, i) => {
    if (v === 0) return;
    const sweep = (v / total) * Math.PI * 2;
    // A full circle can't be one arc in SVG, so cap the sweep just under 2π.
    const s = Math.min(sweep, Math.PI * 2 - 1e-4);
    const a0 = angle, a1 = angle + s;
    out.push({ path: arcPath(cx, cy, rOuter, rInner, a0, a1), start: a0, end: a1, value: v, index: i, fraction: v / total });
    angle += sweep;
  });
  return out;
}

function arcPath(cx: number, cy: number, ro: number, ri: number, a0: number, a1: number): string {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(ro, a0), [x1, y1] = p(ro, a1), [x2, y2] = p(ri, a1), [x3, y3] = p(ri, a0);
  return `M${f(x0)} ${f(y0)} A${ro} ${ro} 0 ${large} 1 ${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${ri} ${ri} 0 ${large} 0 ${f(x3)} ${f(y3)} Z`;
}

/** Compact number for labels: 1200 -> "1.2k", 3400000 -> "3.4M". */
export function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return `${trim(n / 1e9)}B`;
  if (a >= 1e6) return `${trim(n / 1e6)}M`;
  if (a >= 1e3) return `${trim(n / 1e3)}k`;
  return trim(n);
}
const trim = (n: number) => String(Number(n.toFixed(Math.abs(n) < 10 ? 1 : 0)));
const f = (n: number) => Number(n.toFixed(2));
