import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ThemeService, UiButton, UiChart, UiCollapse, UiDateRangePicker, UiFileUpload, UiKanban, UiScheduler,
  UiScrollProgress, UiSidebar, UiSidebarItem, UiSortable, UiSparkline, UiSplit, UiTable, UiTimePicker, UiVirtualList,
  confirm, prompt, toast,
} from '@kvui/angular';
import type { DateRange, IconLibrary, TableColumn, TableRow } from '@kvui/angular';
import { getIconLibrary, setIconLibrary } from '@kvui/angular';
import { CodeBlockComponent } from '../code-block.component';
import { SOURCES } from '../source';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    UiButton, UiChart, UiCollapse, UiDateRangePicker, UiFileUpload, UiKanban, UiScheduler, UiScrollProgress,
    UiSidebar, UiSidebarItem, UiSortable, UiSparkline, UiSplit, UiTable, UiTimePicker, UiVirtualList, CodeBlockComponent,
  ],
  template: `
    <ui-scroll-progress label="Reading progress"></ui-scroll-progress>
    <div class="kvui-container kvui-section kvui-stack kvui-stack-lg">
      <header class="kvui-cluster kvui-cluster-between">
        <h1 class="kvui-h3">Kvui UI on Angular</h1>
        <div class="kvui-cluster">
          <button type="button" class="kvui-btn kvui-btn-ghost kvui-btn-sm" (click)="toggleIcons()">Icons: {{ iconSet() === 'kvui' ? 'Kvui' : 'Material' }}</button>
          <ui-button variant="secondary" (click)="theme.set(theme.resolved() === 'dark' ? 'light' : 'dark')">
            Theme: {{ theme.resolved() }}
          </ui-button>
        </div>
      </header>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Sidebar and split panes</h2>
        <div class="kvui-cluster kvui-gap-4">
          <ui-sidebar label="Demo navigation" storageKey="ng-sidebar">
            <ui-sidebar-item label="Overview" icon="home" [current]="true" href="#"></ui-sidebar-item>
            <ui-sidebar-item label="Reports" icon="bar-chart" [group]="true" [open]="true">
              <ui-sidebar-item label="Weekly" href="#"></ui-sidebar-item>
            </ui-sidebar-item>
          </ui-sidebar>
          <ui-split [ratio]="0.35" [minA]="140" [minB]="220" storageKey="ng-split" style="flex:1;height:180px">
            <div slot="a" class="kvui-p-3 kvui-small">List pane</div>
            <div slot="b" class="kvui-p-3 kvui-small">Detail pane</div>
          </ui-split>
        </div>
      </section>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Dates and times</h2>
        <div class="kvui-grid-auto kvui-grid-auto-md kvui-gap-4">
          <ui-date-range-picker label="Report period" [presets]="true" [value]="range()" (uiChange)="range.set($event.detail)"></ui-date-range-picker>
          <ui-time-picker label="Meeting time" [value]="time()" min="08:00" max="18:00" [step]="15" (uiChange)="time.set($event.detail)"></ui-time-picker>
        </div>
      </section>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Charts and sparklines</h2>
        <ui-chart type="area" label="Revenue in thousands" [labels]="months" [series]="revenue"></ui-chart>
        <div class="kvui-cluster">
          <ui-sparkline label="Revenue trend" [values]="trend" [area]="true"></ui-sparkline>
          <span class="kvui-small kvui-text-muted">Last eight weeks</span>
        </div>
      </section>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Tables</h2>
        <ui-table caption="Team" [columns]="columns" [rows]="rows" [exportable]="true" [paginate]="false"></ui-table>
        <ui-table caption="Accounts" [virtual]="true" maxHeight="320px" [rowHeight]="44" [paginate]="false" [columns]="columns" [rows]="manyRows"></ui-table>
      </section>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Lists, boards and schedule</h2>
        <ui-sortable label="Launch steps" [items]="steps" (uiReorder)="steps = $event.detail"></ui-sortable>
        <ui-kanban label="Board" [columns]="columnsKanban" [cards]="cards" [layout]="layout()" (uiMove)="layout.set($event.detail.layout)"></ui-kanban>
        <ui-scheduler label="Week" view="week" date="2026-11-16" [dayStart]="8" [dayEnd]="18" [events]="events"></ui-scheduler>
        <ui-virtual-list [count]="10000" [rowHeight]="36" [height]="200" label="Ten thousand items"></ui-virtual-list>
      </section>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Upload and disclosure</h2>
        <ui-file-upload label="Attachments" accept=".pdf,.png" [maxFiles]="3"></ui-file-upload>
        <ui-collapse peek="Shipping details">
          <span slot="label">Delivery</span>
          Full details here.
        </ui-collapse>
      </section>

      <section class="kvui-stack kvui-stack-sm" id="source">
        <h2 class="kvui-h4">Source code</h2>
        <p class="kvui-caption">Copy any file. The app's own source is bundled at build time (scripts/snapshot.mjs).</p>
        <app-code-block title="src/app/catalogue/catalogue.component.ts" [code]="appSource"></app-code-block>
        <app-code-block title="src/app/code-block.component.ts" [code]="codeBlockSource"></app-code-block>
      </section>

      <section class="kvui-stack kvui-stack-sm">
        <h2 class="kvui-h4">Dialogs and notifications</h2>
        <div class="kvui-cluster">
          <ui-button variant="danger" (click)="remove()">Delete account</ui-button>
          <ui-button variant="secondary" (click)="rename()">Rename</ui-button>
          <ui-button (click)="save()">Save</ui-button>
        </div>
      </section>
    </div>
  `,
})
export class CatalogueComponent {
  readonly theme = inject(ThemeService);
  readonly range = signal<DateRange>({});
  readonly time = signal('09:30');
  readonly layout = signal<Record<string, string[]>>({ todo: ['1'], doing: ['2'], done: ['3'] });
  name = 'Ada Lovelace';
  readonly iconSet = signal<IconLibrary>(getIconLibrary());
  readonly appSource = SOURCES['src/app/catalogue/catalogue.component.ts'];
  readonly codeBlockSource = SOURCES['src/app/code-block.component.ts'];

  toggleIcons(): void {
    const next: IconLibrary = this.iconSet() === 'kvui' ? 'material' : 'kvui';
    setIconLibrary(next);
    this.iconSet.set(next);
  }

  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly revenue = [{ name: 'Revenue', values: [12, 18, 15, 22, 27, 31] }];
  readonly trend = [3, 5, 4, 7, 6, 8, 9, 11];

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role' },
  ];
  readonly rows: TableRow[] = [
    { id: 1, name: 'Ada', role: 'Engineer' },
    { id: 2, name: 'Grace', role: 'Designer' },
  ];
  readonly manyRows: TableRow[] = Array.from({ length: 1500 }, (_, i) => ({ id: i + 1, name: `Account ${i + 1}`, role: i % 2 ? 'Gold' : 'Silver' }));

  steps = [{ id: 'a', label: 'Write spec' }, { id: 'b', label: 'Design review' }, { id: 'c', label: 'Ship' }];
  readonly columnsKanban = [{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'In progress' }, { id: 'done', title: 'Done' }];
  readonly cards = [{ id: '1', title: 'Pricing copy' }, { id: '2', title: 'Webhooks' }, { id: '3', title: 'Emails' }];
  readonly events = [{ id: 'e1', title: 'Design review', start: '2026-11-16', startTime: '10:00', endTime: '11:00' }];

  save(): void {
    toast.success('Saved');
  }

  async remove(): Promise<void> {
    const ok = await confirm({ title: 'Delete account?', message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true });
    toast(ok ? 'Account deleted' : 'Kept your account');
  }

  async rename(): Promise<void> {
    const value = await prompt({ title: 'Rename', defaultValue: this.name, validate: (v: string) => (v.trim().length < 2 ? 'Use at least 2 characters.' : undefined) });
    if (value) this.name = value;
  }
}
