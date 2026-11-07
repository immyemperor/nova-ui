import { Component, Element, Event, EventEmitter, Host, Listen, Prop, Watch, h } from '@stencil/core';

interface StepEl extends HTMLElement {
  index: number;
  last: boolean;
  status: 'complete' | 'current' | 'upcoming' | 'error';
  clickable: boolean;
  orientation: 'horizontal' | 'vertical';
  error: boolean;
}

/** Progress through a multi-step flow. Children are <ui-step>. */
@Component({
  tag: 'ui-stepper',
  styleUrl: 'ui-stepper.css',
  shadow: true,
})
export class UiStepper {
  @Element() host!: HTMLElement;

  /** Index of the active step, 0-based. */
  @Prop({ mutable: true }) current = 0;
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  /** Let people jump back to completed steps. */
  @Prop() clickable = false;
  @Prop() label?: string;

  /** Fires when a completed step is clicked. */
  @Event() uiChange!: EventEmitter<number>;

  private steps(): StepEl[] {
    return Array.from(this.host.querySelectorAll(':scope > ui-step')) as StepEl[];
  }

  @Watch('current')
  @Watch('orientation')
  @Watch('clickable')
  sync() {
    const steps = this.steps();
    steps.forEach((s, i) => {
      s.index = i;
      s.last = i === steps.length - 1;
      s.orientation = this.orientation;
      s.status = s.error ? 'error' : i < this.current ? 'complete' : i === this.current ? 'current' : 'upcoming';
      s.clickable = this.clickable && i < this.current;
    });
  }

  componentDidLoad() {
    this.sync();
  }

  @Listen('click')
  onClick(ev: MouseEvent) {
    const step = (ev.target as HTMLElement).closest('ui-step') as StepEl | null;
    if (!step || !step.clickable) return;
    this.current = step.index;
    this.uiChange.emit(step.index);
  }

  render() {
    return (
      <Host role="list" aria-label={this.label}>
        <slot onSlotchange={() => this.sync()} />
      </Host>
    );
  }
}
