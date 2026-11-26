import { Component, Host, Prop, h } from '@stencil/core';
import { areaPath, bars, compact, donutSlices, extent, linePath, linePoints, linearScale, niceTicks } from '../../utils/chart';
import { t } from '../../i18n';

export interface ChartSeries { name: string; values: number[]; color?: string }

/**
 * Line, area, bar and donut charts in plain SVG. Each chart has a text summary and a data table
 * for screen readers, because SVG shapes are otherwise invisible to assistive technology.
 * Colours come from the theme tokens unless a series sets its own.
 */
@Component({
  tag: 'ui-chart',
  styleUrl: 'ui-chart.css',
  shadow: true,
})
export class UiChart {
  /** Chart type. */
  @Prop({ reflect: true }) type: 'line' | 'area' | 'bar' | 'donut' = 'line';
  /** One or more series. Donut charts use the first series only. */
  @Prop() series: ChartSeries[] = [];
  /** Category labels for the x-axis (or slice names for a donut). */
  @Prop() labels: string[] = [];
  /** Accessible title. Also read out as the summary. */
  @Prop() label = 'Chart';
  @Prop() height = 240;
  /** Show y-axis gridlines and values. */
  @Prop() axes = true;
  /** Show the data table below the chart. Always in the DOM for screen readers; this toggles it visible. */
  @Prop() showTable = false;
  /** Format axis numbers in compact form (1.2k). */
  @Prop() compact = true;

  private viewW = 640;

  private colour(i: number, s?: ChartSeries): string {
    if (s?.color) return s.color;
    const palette = ['var(--kvui-color-accent)', 'var(--kvui-color-info)', 'var(--kvui-color-warning)', 'var(--kvui-color-danger)', 'var(--kvui-color-success)', 'var(--kvui-color-fg-muted)'];
    return palette[i % palette.length];
  }

  private summary(): string {
    if (!this.series.length) return `${this.label}: no data`;
    const parts = this.series.map((s) => {
      const vs = s.values.filter(Number.isFinite);
      if (!vs.length) return `${s.name}: no values`;
      const [lo, hi] = extent(vs);
      return `${s.name} from ${compact(vs[0])} to ${compact(vs[vs.length - 1])}, range ${compact(lo)} to ${compact(hi)}`;
    });
    return `${this.label}. ${parts.join('. ')}.`;
  }

  private renderCartesian() {
    const W = this.viewW, H = this.height, pad = 36;
    const all = this.series.flatMap((s) => s.values);
    const [lo0, hi0] = extent([0, ...all]);
    const ticks = niceTicks(this.type === 'bar' ? lo0 : extent(all)[0], hi0, 5);
    const lo = ticks.length ? ticks[0] : lo0, hi = ticks.length ? ticks[ticks.length - 1] : hi0;
    const y = linearScale([lo, hi], [H - 24, 12]);
    const n = Math.max(...this.series.map((s) => s.values.length), this.labels.length, 1);
    const xstep = (W - pad * 2) / Math.max(1, n - 1);

    return (
      <svg class="svg" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false">
        {this.axes && ticks.map((tv) => (
          <g key={tv}>
            <line class="grid" x1={pad} x2={W - 8} y1={y(tv)} y2={y(tv)} />
            <text class="tick" x={pad - 6} y={y(tv) + 4} text-anchor="end">{this.compact ? compact(tv) : String(tv)}</text>
          </g>
        ))}
        {this.type === 'bar' ? this.series.map((s, si) => {
          const group = (W - pad - 8) / Math.max(1, n);
          const bw = (group * 0.7) / Math.max(1, this.series.length);
          return bars(s.values, W - pad - 8, H - 24 - 12, 0, 0.3, [lo, hi]).map((b) => (
            <rect key={`${si}-${b.index}`} class="bar" fill={this.colour(si, s)}
              x={pad + b.index * group + si * bw + (group - bw * this.series.length) / 2}
              y={Math.min(y(0), y(b.value))}
              width={bw} height={Math.abs(y(0) - y(b.value))}>
              <title>{`${s.name}, ${this.labels[b.index] ?? b.index + 1}: ${b.value}`}</title>
            </rect>
          ));
        }) : this.series.map((s, si) => {
          const pts = linePoints(s.values, W - pad * 2, H - 36, 0, [lo, hi]).map((p) => ({ x: pad + p.x, y: p.y + 12 }));
          const color = this.colour(si, s);
          return (
            <g key={si}>
              {this.type === 'area' && <path class="area" fill={color} d={areaPath(pts, H - 24)} />}
              <path class="line" stroke={color} d={linePath(pts)} />
              {pts.map((p, i) => (
                <circle key={i} class="point" fill={color} cx={p.x} cy={p.y} r="3">
                  <title>{`${s.name}, ${this.labels[i] ?? i + 1}: ${s.values[i]}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
        {this.labels.map((lab, i) => (
          <text key={i} class="tick" x={pad + i * xstep} y={H - 6} text-anchor="middle">{lab}</text>
        ))}
      </svg>
    );
  }

  private renderDonut() {
    const s = this.series[0];
    const size = 220, r = 90, inner = 58;
    const slices = donutSlices(s?.values ?? [], size / 2, size / 2, r, inner);
    const total = (s?.values ?? []).reduce((a, b) => a + (Number.isFinite(b) && b > 0 ? b : 0), 0);
    return (
      <div class="donut">
        <svg class="svg donut-svg" viewBox={`0 0 ${size} ${size}`} role="presentation" focusable="false">
          {slices.map((sl) => (
            <path key={sl.index} class="slice" fill={this.colour(sl.index)} d={sl.path}>
              <title>{`${this.labels[sl.index] ?? sl.index + 1}: ${sl.value} (${Math.round(sl.fraction * 100)}%)`}</title>
            </path>
          ))}
          <text class="centre" x={size / 2} y={size / 2 + 6} text-anchor="middle">{compact(total)}</text>
        </svg>
        <ul class="legend" role="list">
          {slices.map((sl) => (
            <li key={sl.index}>
              <span class="swatch" style={{ background: this.colour(sl.index) }} aria-hidden="true" />
              {this.labels[sl.index] ?? `${t('item')} ${sl.index + 1}`} <span class="pct">{Math.round(sl.fraction * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  private renderTable() {
    const cols = this.type === 'donut' ? [this.series[0]].filter(Boolean) : this.series;
    const rows = this.type === 'donut'
      ? (this.series[0]?.values ?? []).map((v, i) => [this.labels[i] ?? `${i + 1}`, v])
      : Array.from({ length: Math.max(0, ...cols.map((c) => c.values.length)) }, (_, i) => [this.labels[i] ?? `${i + 1}`, ...cols.map((c) => c.values[i])]);
    return (
      <details class="table" open={this.showTable}>
        <summary>{t('dataTable')}</summary>
        <table class="data">
          <caption class="sr">{this.label}</caption>
          <thead><tr><th scope="col">{this.type === 'donut' ? t('category') : t('period')}</th>{cols.map((c) => <th scope="col">{c.name}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => <tr key={i}>{r.map((cell, j) => j === 0 ? <th scope="row">{cell}</th> : <td>{cell ?? ''}</td>)}</tr>)}
          </tbody>
        </table>
      </details>
    );
  }

  render() {
    const isDonut = this.type === 'donut';
    return (
      <Host>
        <div class="frame" role="group" aria-label={this.label}>
          <p class="sr" aria-live="off">{this.summary()}</p>
          {this.series.length === 0 ? (
            <p class="empty">{t('noRows')}</p>
          ) : isDonut ? this.renderDonut() : this.renderCartesian()}
          {this.series.length > 0 && !isDonut && this.series.length > 1 && (
            <ul class="legend" role="list">
              {this.series.map((s, i) => (
                <li key={s.name}><span class="swatch" style={{ background: this.colour(i, s) }} aria-hidden="true" />{s.name}</li>
              ))}
            </ul>
          )}
          {this.series.length > 0 && this.renderTable()}
        </div>
      </Host>
    );
  }
}
