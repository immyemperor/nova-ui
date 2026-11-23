/**
 * The explorer's sidebar. Every component the library ships appears in exactly one category.
 * `playgrounds:check` fails if a component is missing here or listed twice.
 */
export interface Category { id: string; label: string; tags: string[] }

export const CATEGORIES: Category[] = [
  { id: 'foundations', label: 'Foundations', tags: ['ui-icon', 'ui-theme-toggle'] },
  { id: 'layout', label: 'Layout and surfaces', tags: ['ui-card', 'ui-split', 'ui-sidebar', 'ui-sidebar-item', 'ui-collapse', 'ui-scroll-progress'] },
  { id: 'buttons', label: 'Buttons and feedback', tags: ['ui-button', 'ui-alert', 'ui-badge', 'ui-avatar', 'ui-skeleton', 'ui-spinner', 'ui-progress', 'ui-counter', 'ui-toaster'] },
  { id: 'forms', label: 'Form controls', tags: ['ui-input', 'ui-textarea', 'ui-checkbox', 'ui-switch', 'ui-radio-group', 'ui-radio', 'ui-slider', 'ui-rating', 'ui-otp-input', 'ui-tag-input', 'ui-field', 'ui-select'] },
  { id: 'dates', label: 'Dates, times and colour', tags: ['ui-date-picker', 'ui-date-range-picker', 'ui-calendar', 'ui-time-picker', 'ui-color-picker'] },
  { id: 'overlays', label: 'Overlays and menus', tags: ['ui-modal', 'ui-drawer', 'ui-popover', 'ui-tooltip', 'ui-dropdown', 'ui-menu-item', 'ui-context-menu', 'ui-command-palette', 'ui-dialog-host'] },
  { id: 'navigation', label: 'Navigation', tags: ['ui-tabs', 'ui-tab', 'ui-tab-panel', 'ui-accordion', 'ui-accordion-item', 'ui-breadcrumb', 'ui-breadcrumb-item', 'ui-pagination', 'ui-stepper', 'ui-step', 'ui-nav-menu', 'ui-nav-item', 'ui-menubar', 'ui-menubar-menu'] },
  { id: 'data', label: 'Data', tags: ['ui-table', 'ui-tree', 'ui-virtual-list', 'ui-sortable', 'ui-kanban', 'ui-scheduler'] },
  { id: 'charts', label: 'Charts', tags: ['ui-chart', 'ui-sparkline'] },
  { id: 'files', label: 'Files', tags: ['ui-file-upload'] },
  { id: 'content', label: 'Content', tags: ['ui-editor', 'ui-html', 'ui-carousel', 'ui-marquee'] },
  { id: 'motion', label: 'Motion', tags: ['ui-reveal', 'ui-stagger'] },
];

export const ALL_TAGS = CATEGORIES.flatMap((c) => c.tags);
