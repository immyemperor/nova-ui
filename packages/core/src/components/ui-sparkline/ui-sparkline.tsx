import { Component, Host, Prop, h } from '@stencil/core';
import { areaPath, linePath, linePoints } from '../../utils/chart';

/** Tiny inline trend line for tables and cards. No axes, no labels; it describes itself in words. */
@Component({
  tag: 'ui-sparkline',
  styleUrl: 'ui-sparkline.css',
  shadow: true,
})
export class UiSparkline {
  /** Values, left to right. */
  @Prop() values: number[] = [];
  @Prop() width = 120;
  @Prop() height = 32;
  /** Fill the area under the line. */
  @Prop() area = false;
  /** Accessible summary, e.g. "Revenue, up 12% over 7 days". */
  @Prop() label = 'Trend';

  render() {
    const vs = this.values ?? [];
    const pad = 2;
    const pts = linePoints(vs, this.width, this.height, pad);
    const last = vs[vs.length - 1];
    const first = vs[0];
    const dir = vs.length < 2 ? 'flat' : last > first ? 'up' : last < first ? 'down' : 'flat';
    return (
      <Host>
        <svg class="svg" viewBox={`0 0 ${this.width} ${this.height}`} role="img" aria-label={`${this.label}, trending ${dir}`}>
          {this.area && vs.length > 1 && <path class="area" d={areaPath(pts, this.height - pad)} />}
          {vs.length > 1 && <path class="line" d={linePath(pts)} vector-effect="non-scaling-stroke" />}
          {pts.length > 0 && <circle class="dot" cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" />}
        </svg>
      </Host>
    );
  }
}
