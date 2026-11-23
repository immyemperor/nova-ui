// Live examples for the Angular component explorer. Each block sits between "// @example <tag>" and "// @end".
// The explorer shows the imports at the top plus the block, so each block can be copied and used as it is.
import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { Type } from '@angular/core';

// @example ui-button
@Component({
  selector: 'app-example-button',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="nova-cluster">
      <ui-button>Save</ui-button>
      <ui-button variant="secondary">Cancel</ui-button>
      <ui-button variant="ghost">Ghost</ui-button>
      <ui-button variant="danger">Delete</ui-button>
      <ui-button [loading]="true">Saving</ui-button>
    </div>
  `,
})
export class ButtonExample {}
// @end

// @example ui-icon
@Component({
  selector: 'app-example-icon',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="nova-cluster">
      <ui-icon name="check" label="Done"></ui-icon>
      <ui-icon name="star" [filled]="true" label="Starred"></ui-icon>
      <ui-icon name="alert-triangle" size="2rem" label="Warning"></ui-icon>
    </div>
  `,
})
export class IconExample {}
// @end

// @example ui-input
@Component({
  selector: 'app-example-input',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-input label="Email" type="email" placeholder="name@example.com" hint="We never share it."
      [value]="email()" [error]="error()" (uiInput)="email.set($event.detail)"></ui-input>
  `,
})
export class InputExample {
  readonly email = signal('');
  error(): string | undefined {
    const v = this.email();
    return v && !v.includes('@') ? 'Enter a valid address.' : undefined;
  }
}
// @end

// @example ui-checkbox
@Component({
  selector: 'app-example-checkbox',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<ui-checkbox name="terms" [required]="true">I agree to the terms</ui-checkbox>`,
})
export class CheckboxExample {}
// @end

// @example ui-switch
@Component({
  selector: 'app-example-switch',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<ui-switch [checked]="true">Weekly digest</ui-switch>`,
})
export class SwitchExample {}
// @end

// @example ui-select
@Component({
  selector: 'app-example-select',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-select label="Owner" [searchable]="true" [clearable]="true"
      [options]="owners" [value]="owner()" (uiChange)="owner.set($event.detail)"></ui-select>
  `,
})
export class SelectExample {
  readonly owner = signal<string | string[]>('');
  readonly owners = [
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
    { value: 'linus', label: 'Linus Torvalds' },
  ];
}
// @end

// @example ui-badge
@Component({
  selector: 'app-example-badge',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="nova-cluster">
      <ui-badge tone="success" [dot]="true">Active</ui-badge>
      <ui-badge tone="warning" variant="outline">Pending</ui-badge>
      <ui-badge tone="danger" variant="solid">Failed</ui-badge>
    </div>
  `,
})
export class BadgeExample {}
// @end

// @example ui-alert
@Component({
  selector: 'app-example-alert',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="nova-stack nova-stack-sm">
      <ui-alert tone="success" heading="Saved">Your changes are live.</ui-alert>
      <ui-alert tone="danger" heading="Could not save" [dismissible]="true">Check your connection and try again.</ui-alert>
    </div>
  `,
})
export class AlertExample {}
// @end

// @example ui-card
@Component({
  selector: 'app-example-card',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-card variant="raised">
      <span slot="header">Profile</span>
      <p>Card body content.</p>
      <div slot="footer" class="nova-cluster nova-cluster-end"><ui-button size="sm">Save</ui-button></div>
    </ui-card>
  `,
})
export class CardExample {}
// @end

// @example ui-table
@Component({
  selector: 'app-example-table',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-table caption="Projects" [searchable]="true" [selectable]="true" [exportable]="true"
      [columns]="columns" [rows]="rows"></ui-table>
  `,
})
export class TableExample {
  readonly columns = [
    { key: 'name', label: 'Project', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'budget', label: 'Budget', align: 'end', sortable: true },
  ];
  readonly rows = [
    { id: 1, name: 'Atlas redesign', owner: 'Ada', budget: 48000 },
    { id: 2, name: 'Billing migration', owner: 'Grace', budget: 72000 },
    { id: 3, name: 'Mobile app', owner: 'Linus', budget: 120000 },
  ];
}
// @end

// @example ui-chart
@Component({
  selector: 'app-example-chart',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-chart type="area" label="Revenue in thousands" [labels]="labels" [series]="series"></ui-chart>
  `,
})
export class ChartExample {
  readonly labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly series = [{ name: 'Revenue', values: [12, 18, 15, 22, 27, 31] }];
}
// @end

// @example ui-tabs
@Component({
  selector: 'app-example-tabs',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-tabs label="Project sections" [value]="tab()" (uiChange)="tab.set($event.detail)">
      <ui-tab value="overview">Overview</ui-tab>
      <ui-tab value="activity">Activity</ui-tab>
      <ui-tab value="billing" [disabled]="true">Billing</ui-tab>
      <ui-tab-panel value="overview">Overview content.</ui-tab-panel>
      <ui-tab-panel value="activity">Recent activity.</ui-tab-panel>
    </ui-tabs>
  `,
})
export class TabsExample {
  readonly tab = signal('overview');
}
// @end

// @example ui-modal
@Component({
  selector: 'app-example-modal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-button (click)="open.set(true)">Open dialog</ui-button>
    <ui-modal [open]="open()" heading="Delete project?" size="sm" (uiClose)="open.set(false)">
      This removes every file in it.
      <div slot="footer" class="nova-cluster nova-cluster-end">
        <ui-button variant="ghost" (click)="open.set(false)">Cancel</ui-button>
        <ui-button variant="danger" (click)="open.set(false)">Delete</ui-button>
      </div>
    </ui-modal>
  `,
})
export class ModalExample {
  readonly open = signal(false);
}
// @end

// @example ui-collapse
@Component({
  selector: 'app-example-collapse',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-collapse peek="Shipping, returns and exchanges">
      <span slot="label">Delivery</span>
      Full delivery details appear here.
    </ui-collapse>
  `,
})
export class CollapseExample {}
// @end

/** Components with a live example, keyed by tag. Each class is shown in the explorer as a standalone component. */
export const ANGULAR_EXAMPLES: Record<string, Type<unknown>> = {
  'ui-button': ButtonExample,
  'ui-icon': IconExample,
  'ui-input': InputExample,
  'ui-checkbox': CheckboxExample,
  'ui-switch': SwitchExample,
  'ui-select': SelectExample,
  'ui-badge': BadgeExample,
  'ui-alert': AlertExample,
  'ui-card': CardExample,
  'ui-table': TableExample,
  'ui-chart': ChartExample,
  'ui-tabs': TabsExample,
  'ui-modal': ModalExample,
  'ui-collapse': CollapseExample,
};
