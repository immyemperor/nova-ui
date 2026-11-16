/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@nova-ui/core/components';

import { defineCustomElement as defineUiAccordion } from '@nova-ui/core/components/ui-accordion.js';
import { defineCustomElement as defineUiAccordionItem } from '@nova-ui/core/components/ui-accordion-item.js';
import { defineCustomElement as defineUiAlert } from '@nova-ui/core/components/ui-alert.js';
import { defineCustomElement as defineUiAvatar } from '@nova-ui/core/components/ui-avatar.js';
import { defineCustomElement as defineUiBadge } from '@nova-ui/core/components/ui-badge.js';
import { defineCustomElement as defineUiBreadcrumb } from '@nova-ui/core/components/ui-breadcrumb.js';
import { defineCustomElement as defineUiBreadcrumbItem } from '@nova-ui/core/components/ui-breadcrumb-item.js';
import { defineCustomElement as defineUiButton } from '@nova-ui/core/components/ui-button.js';
import { defineCustomElement as defineUiCalendar } from '@nova-ui/core/components/ui-calendar.js';
import { defineCustomElement as defineUiCard } from '@nova-ui/core/components/ui-card.js';
import { defineCustomElement as defineUiCarousel } from '@nova-ui/core/components/ui-carousel.js';
import { defineCustomElement as defineUiChart } from '@nova-ui/core/components/ui-chart.js';
import { defineCustomElement as defineUiCheckbox } from '@nova-ui/core/components/ui-checkbox.js';
import { defineCustomElement as defineUiCollapse } from '@nova-ui/core/components/ui-collapse.js';
import { defineCustomElement as defineUiColorPicker } from '@nova-ui/core/components/ui-color-picker.js';
import { defineCustomElement as defineUiCommandPalette } from '@nova-ui/core/components/ui-command-palette.js';
import { defineCustomElement as defineUiContextMenu } from '@nova-ui/core/components/ui-context-menu.js';
import { defineCustomElement as defineUiCounter } from '@nova-ui/core/components/ui-counter.js';
import { defineCustomElement as defineUiDatePicker } from '@nova-ui/core/components/ui-date-picker.js';
import { defineCustomElement as defineUiDateRangePicker } from '@nova-ui/core/components/ui-date-range-picker.js';
import { defineCustomElement as defineUiDialogHost } from '@nova-ui/core/components/ui-dialog-host.js';
import { defineCustomElement as defineUiDrawer } from '@nova-ui/core/components/ui-drawer.js';
import { defineCustomElement as defineUiDropdown } from '@nova-ui/core/components/ui-dropdown.js';
import { defineCustomElement as defineUiField } from '@nova-ui/core/components/ui-field.js';
import { defineCustomElement as defineUiFileUpload } from '@nova-ui/core/components/ui-file-upload.js';
import { defineCustomElement as defineUiHtml } from '@nova-ui/core/components/ui-html.js';
import { defineCustomElement as defineUiIcon } from '@nova-ui/core/components/ui-icon.js';
import { defineCustomElement as defineUiInput } from '@nova-ui/core/components/ui-input.js';
import { defineCustomElement as defineUiKanban } from '@nova-ui/core/components/ui-kanban.js';
import { defineCustomElement as defineUiMarquee } from '@nova-ui/core/components/ui-marquee.js';
import { defineCustomElement as defineUiMenuItem } from '@nova-ui/core/components/ui-menu-item.js';
import { defineCustomElement as defineUiMenubar } from '@nova-ui/core/components/ui-menubar.js';
import { defineCustomElement as defineUiMenubarMenu } from '@nova-ui/core/components/ui-menubar-menu.js';
import { defineCustomElement as defineUiModal } from '@nova-ui/core/components/ui-modal.js';
import { defineCustomElement as defineUiNavItem } from '@nova-ui/core/components/ui-nav-item.js';
import { defineCustomElement as defineUiNavMenu } from '@nova-ui/core/components/ui-nav-menu.js';
import { defineCustomElement as defineUiOtpInput } from '@nova-ui/core/components/ui-otp-input.js';
import { defineCustomElement as defineUiPagination } from '@nova-ui/core/components/ui-pagination.js';
import { defineCustomElement as defineUiPopover } from '@nova-ui/core/components/ui-popover.js';
import { defineCustomElement as defineUiProgress } from '@nova-ui/core/components/ui-progress.js';
import { defineCustomElement as defineUiRadio } from '@nova-ui/core/components/ui-radio.js';
import { defineCustomElement as defineUiRadioGroup } from '@nova-ui/core/components/ui-radio-group.js';
import { defineCustomElement as defineUiRating } from '@nova-ui/core/components/ui-rating.js';
import { defineCustomElement as defineUiReveal } from '@nova-ui/core/components/ui-reveal.js';
import { defineCustomElement as defineUiScheduler } from '@nova-ui/core/components/ui-scheduler.js';
import { defineCustomElement as defineUiScrollProgress } from '@nova-ui/core/components/ui-scroll-progress.js';
import { defineCustomElement as defineUiSelect } from '@nova-ui/core/components/ui-select.js';
import { defineCustomElement as defineUiSidebar } from '@nova-ui/core/components/ui-sidebar.js';
import { defineCustomElement as defineUiSidebarItem } from '@nova-ui/core/components/ui-sidebar-item.js';
import { defineCustomElement as defineUiSkeleton } from '@nova-ui/core/components/ui-skeleton.js';
import { defineCustomElement as defineUiSlider } from '@nova-ui/core/components/ui-slider.js';
import { defineCustomElement as defineUiSortable } from '@nova-ui/core/components/ui-sortable.js';
import { defineCustomElement as defineUiSparkline } from '@nova-ui/core/components/ui-sparkline.js';
import { defineCustomElement as defineUiSpinner } from '@nova-ui/core/components/ui-spinner.js';
import { defineCustomElement as defineUiSplit } from '@nova-ui/core/components/ui-split.js';
import { defineCustomElement as defineUiStagger } from '@nova-ui/core/components/ui-stagger.js';
import { defineCustomElement as defineUiStep } from '@nova-ui/core/components/ui-step.js';
import { defineCustomElement as defineUiStepper } from '@nova-ui/core/components/ui-stepper.js';
import { defineCustomElement as defineUiSwitch } from '@nova-ui/core/components/ui-switch.js';
import { defineCustomElement as defineUiTab } from '@nova-ui/core/components/ui-tab.js';
import { defineCustomElement as defineUiTabPanel } from '@nova-ui/core/components/ui-tab-panel.js';
import { defineCustomElement as defineUiTable } from '@nova-ui/core/components/ui-table.js';
import { defineCustomElement as defineUiTabs } from '@nova-ui/core/components/ui-tabs.js';
import { defineCustomElement as defineUiTagInput } from '@nova-ui/core/components/ui-tag-input.js';
import { defineCustomElement as defineUiTextarea } from '@nova-ui/core/components/ui-textarea.js';
import { defineCustomElement as defineUiThemeToggle } from '@nova-ui/core/components/ui-theme-toggle.js';
import { defineCustomElement as defineUiTimePicker } from '@nova-ui/core/components/ui-time-picker.js';
import { defineCustomElement as defineUiToaster } from '@nova-ui/core/components/ui-toaster.js';
import { defineCustomElement as defineUiTooltip } from '@nova-ui/core/components/ui-tooltip.js';
import { defineCustomElement as defineUiTree } from '@nova-ui/core/components/ui-tree.js';
import { defineCustomElement as defineUiVirtualList } from '@nova-ui/core/components/ui-virtual-list.js';
@ProxyCmp({
  defineCustomElementFn: defineUiAccordion,
  inputs: ['multiple', 'variant']
})
@Component({
  selector: 'ui-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['multiple', 'variant'],
})
export class UiAccordion {
  protected el: HTMLUiAccordionElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiAccordion extends Components.UiAccordion {}


@ProxyCmp({
  defineCustomElementFn: defineUiAccordionItem,
  inputs: ['disabled', 'heading', 'level', 'open', 'value'],
  methods: ['focusHeader']
})
@Component({
  selector: 'ui-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'heading', 'level', 'open', 'value'],
  outputs: ['uiToggle'],
})
export class UiAccordionItem {
  protected el: HTMLUiAccordionItemElement;
  @Output() uiToggle = new EventEmitter<UiAccordionItemCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiAccordionItemCustomEvent } from '@nova-ui/core/components';

export declare interface UiAccordionItem extends Components.UiAccordionItem {
  /**
   * Fires with the new open state. Bubbles, so you can listen on <ui-accordion>.
   */
  uiToggle: EventEmitter<UiAccordionItemCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiAlert,
  inputs: ['dismissible', 'heading', 'open', 'tone']
})
@Component({
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['dismissible', 'heading', 'open', 'tone'],
  outputs: ['uiDismiss'],
})
export class UiAlert {
  protected el: HTMLUiAlertElement;
  @Output() uiDismiss = new EventEmitter<UiAlertCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiAlertCustomEvent } from '@nova-ui/core/components';

export declare interface UiAlert extends Components.UiAlert {
  /**
   * Fires when the user dismisses the alert.
   */
  uiDismiss: EventEmitter<UiAlertCustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiAvatar,
  inputs: ['name', 'shape', 'size', 'src']
})
@Component({
  selector: 'ui-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['name', 'shape', 'size', 'src'],
})
export class UiAvatar {
  protected el: HTMLUiAvatarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiAvatar extends Components.UiAvatar {}


@ProxyCmp({
  defineCustomElementFn: defineUiBadge,
  inputs: ['dot', 'tone', 'variant']
})
@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['dot', 'tone', 'variant'],
})
export class UiBadge {
  protected el: HTMLUiBadgeElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiBadge extends Components.UiBadge {}


@ProxyCmp({
  defineCustomElementFn: defineUiBreadcrumb,
  inputs: ['label', 'maxItems']
})
@Component({
  selector: 'ui-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'maxItems'],
})
export class UiBreadcrumb {
  protected el: HTMLUiBreadcrumbElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiBreadcrumb extends Components.UiBreadcrumb {}


@ProxyCmp({
  defineCustomElementFn: defineUiBreadcrumbItem,
  inputs: ['collapsed', 'current', 'ellipsis', 'href', 'last']
})
@Component({
  selector: 'ui-breadcrumb-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['collapsed', 'current', 'ellipsis', 'href', 'last'],
  outputs: ['uiExpand'],
})
export class UiBreadcrumbItem {
  protected el: HTMLUiBreadcrumbItemElement;
  @Output() uiExpand = new EventEmitter<UiBreadcrumbItemCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiBreadcrumbItemCustomEvent } from '@nova-ui/core/components';

export declare interface UiBreadcrumbItem extends Components.UiBreadcrumbItem {

  uiExpand: EventEmitter<UiBreadcrumbItemCustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiButton,
  inputs: ['disabled', 'href', 'iconOnly', 'label', 'loading', 'pressed', 'size', 'target', 'type', 'variant']
})
@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'href', 'iconOnly', 'label', 'loading', 'pressed', 'size', 'target', 'type', 'variant'],
})
export class UiButton {
  protected el: HTMLUiButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiButton extends Components.UiButton {}


@ProxyCmp({
  defineCustomElementFn: defineUiCalendar,
  inputs: ['firstDayOfWeek', 'locale', 'max', 'min', 'value'],
  methods: ['focusDay']
})
@Component({
  selector: 'ui-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['firstDayOfWeek', 'locale', 'max', 'min', 'value'],
  outputs: ['uiChange'],
})
export class UiCalendar {
  protected el: HTMLUiCalendarElement;
  @Output() uiChange = new EventEmitter<UiCalendarCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiCalendarCustomEvent } from '@nova-ui/core/components';

export declare interface UiCalendar extends Components.UiCalendar {

  uiChange: EventEmitter<UiCalendarCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiCard,
  inputs: ['interactive', 'variant']
})
@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['interactive', 'variant'],
})
export class UiCard {
  protected el: HTMLUiCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiCard extends Components.UiCard {}


@ProxyCmp({
  defineCustomElementFn: defineUiCarousel,
  inputs: ['autoplay', 'gap', 'label', 'loop', 'showArrows', 'showDots', 'slidesPerView']
})
@Component({
  selector: 'ui-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autoplay', 'gap', 'label', 'loop', 'showArrows', 'showDots', 'slidesPerView'],
  outputs: ['uiChange'],
})
export class UiCarousel {
  protected el: HTMLUiCarouselElement;
  @Output() uiChange = new EventEmitter<UiCarouselCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiCarouselCustomEvent } from '@nova-ui/core/components';

export declare interface UiCarousel extends Components.UiCarousel {
  /**
   * Fires with the index of the first visible slide.
   */
  uiChange: EventEmitter<UiCarouselCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiChart,
  inputs: ['axes', 'compact', 'height', 'label', 'labels', 'series', 'showTable', 'type']
})
@Component({
  selector: 'ui-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['axes', 'compact', 'height', 'label', 'labels', 'series', 'showTable', 'type'],
})
export class UiChart {
  protected el: HTMLUiChartElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiChart extends Components.UiChart {}


@ProxyCmp({
  defineCustomElementFn: defineUiCheckbox,
  inputs: ['checked', 'disabled', 'indeterminate', 'label', 'name', 'required', 'value']
})
@Component({
  selector: 'ui-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', 'indeterminate', 'label', 'name', 'required', 'value'],
  outputs: ['uiChange'],
})
export class UiCheckbox {
  protected el: HTMLUiCheckboxElement;
  @Output() uiChange = new EventEmitter<UiCheckboxCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiCheckboxCustomEvent } from '@nova-ui/core/components';

export declare interface UiCheckbox extends Components.UiCheckbox {

  uiChange: EventEmitter<UiCheckboxCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiCollapse,
  inputs: ['open', 'peek']
})
@Component({
  selector: 'ui-collapse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open', 'peek'],
  outputs: ['uiToggle'],
})
export class UiCollapse {
  protected el: HTMLUiCollapseElement;
  @Output() uiToggle = new EventEmitter<UiCollapseCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiCollapseCustomEvent } from '@nova-ui/core/components';

export declare interface UiCollapse extends Components.UiCollapse {

  uiToggle: EventEmitter<UiCollapseCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiColorPicker,
  inputs: ['disabled', 'inline', 'label', 'name', 'swatches', 'value']
})
@Component({
  selector: 'ui-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'inline', 'label', 'name', 'swatches', 'value'],
  outputs: ['uiInput', 'uiChange'],
})
export class UiColorPicker {
  protected el: HTMLUiColorPickerElement;
  @Output() uiInput = new EventEmitter<UiColorPickerCustomEvent<string>>();
  @Output() uiChange = new EventEmitter<UiColorPickerCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiColorPickerCustomEvent } from '@nova-ui/core/components';

export declare interface UiColorPicker extends Components.UiColorPicker {
  /**
   * Fires continuously while dragging or typing.
   */
  uiInput: EventEmitter<UiColorPickerCustomEvent<string>>;
  /**
   * Fires when a colour is committed: release, key press, hex entry or swatch click.
   */
  uiChange: EventEmitter<UiColorPickerCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiCommandPalette,
  inputs: ['commands', 'emptyText', 'hotkey', 'label', 'open', 'placeholder']
})
@Component({
  selector: 'ui-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['commands', 'emptyText', 'hotkey', 'label', 'open', 'placeholder'],
  outputs: ['uiSelect', 'uiOpenChange'],
})
export class UiCommandPalette {
  protected el: HTMLUiCommandPaletteElement;
  @Output() uiSelect = new EventEmitter<UiCommandPaletteCustomEvent<IUiCommandPaletteCommand>>();
  @Output() uiOpenChange = new EventEmitter<UiCommandPaletteCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiCommandPaletteCustomEvent } from '@nova-ui/core/components';
import type { Command as IUiCommandPaletteCommand } from '@nova-ui/core/components';

export declare interface UiCommandPalette extends Components.UiCommandPalette {
  /**
   * Fires with the chosen command. The palette closes itself.
   */
  uiSelect: EventEmitter<UiCommandPaletteCustomEvent<IUiCommandPaletteCommand>>;

  uiOpenChange: EventEmitter<UiCommandPaletteCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiContextMenu,
  inputs: ['disabled']
})
@Component({
  selector: 'ui-context-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled'],
  outputs: ['uiSelect'],
})
export class UiContextMenu {
  protected el: HTMLUiContextMenuElement;
  @Output() uiSelect = new EventEmitter<UiContextMenuCustomEvent<{ value: string; label: string }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiContextMenuCustomEvent } from '@nova-ui/core/components';

export declare interface UiContextMenu extends Components.UiContextMenu {

  uiSelect: EventEmitter<UiContextMenuCustomEvent<{ value: string; label: string }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiCounter,
  inputs: ['decimals', 'duration', 'locale', 'prefixText', 'suffixText', 'trigger', 'value']
})
@Component({
  selector: 'ui-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['decimals', 'duration', 'locale', 'prefixText', 'suffixText', 'trigger', 'value'],
})
export class UiCounter {
  protected el: HTMLUiCounterElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiCounter extends Components.UiCounter {}


@ProxyCmp({
  defineCustomElementFn: defineUiDatePicker,
  inputs: ['clearable', 'disabled', 'error', 'firstDayOfWeek', 'hint', 'label', 'locale', 'max', 'min', 'name', 'placeholder', 'required', 'size', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['clearable', 'disabled', 'error', 'firstDayOfWeek', 'hint', 'label', 'locale', 'max', 'min', 'name', 'placeholder', 'required', 'size', 'value'],
  outputs: ['uiChange'],
})
export class UiDatePicker {
  protected el: HTMLUiDatePickerElement;
  @Output() uiChange = new EventEmitter<UiDatePickerCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiDatePickerCustomEvent } from '@nova-ui/core/components';

export declare interface UiDatePicker extends Components.UiDatePicker {
  /**
   * Fires with "YYYY-MM-DD", or "" when cleared.
   */
  uiChange: EventEmitter<UiDatePickerCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiDateRangePicker,
  inputs: ['disabled', 'error', 'firstDayOfWeek', 'hint', 'label', 'locale', 'max', 'min', 'name', 'presets', 'required', 'today', 'value'],
  methods: ['clear']
})
@Component({
  selector: 'ui-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'error', 'firstDayOfWeek', 'hint', 'label', 'locale', 'max', 'min', 'name', 'presets', 'required', 'today', 'value'],
  outputs: ['uiChange'],
})
export class UiDateRangePicker {
  protected el: HTMLUiDateRangePickerElement;
  @Output() uiChange = new EventEmitter<UiDateRangePickerCustomEvent<IUiDateRangePickerDateRange>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiDateRangePickerCustomEvent } from '@nova-ui/core/components';
import type { DateRange as IUiDateRangePickerDateRange } from '@nova-ui/core/components';

export declare interface UiDateRangePicker extends Components.UiDateRangePicker {

  uiChange: EventEmitter<UiDateRangePickerCustomEvent<IUiDateRangePickerDateRange>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiDialogHost,
  methods: ['openDialog']
})
@Component({
  selector: 'ui-dialog-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class UiDialogHost {
  protected el: HTMLUiDialogHostElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiDialogHost extends Components.UiDialogHost {}


@ProxyCmp({
  defineCustomElementFn: defineUiDrawer,
  inputs: ['dismissible', 'heading', 'label', 'open', 'side', 'size']
})
@Component({
  selector: 'ui-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['dismissible', 'heading', 'label', 'open', 'side', 'size'],
  outputs: ['uiOpen', 'uiClose'],
})
export class UiDrawer {
  protected el: HTMLUiDrawerElement;
  @Output() uiOpen = new EventEmitter<UiDrawerCustomEvent<void>>();
  @Output() uiClose = new EventEmitter<UiDrawerCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiDrawerCustomEvent } from '@nova-ui/core/components';

export declare interface UiDrawer extends Components.UiDrawer {

  uiOpen: EventEmitter<UiDrawerCustomEvent<void>>;

  uiClose: EventEmitter<UiDrawerCustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiDropdown,
  inputs: ['open', 'placement']
})
@Component({
  selector: 'ui-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open', 'placement'],
  outputs: ['uiSelect', 'uiOpenChange'],
})
export class UiDropdown {
  protected el: HTMLUiDropdownElement;
  @Output() uiSelect = new EventEmitter<UiDropdownCustomEvent<{ value: string; label: string }>>();
  @Output() uiOpenChange = new EventEmitter<UiDropdownCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiDropdownCustomEvent } from '@nova-ui/core/components';

export declare interface UiDropdown extends Components.UiDropdown {
  /**
   * Fires when an item is chosen.
   */
  uiSelect: EventEmitter<UiDropdownCustomEvent<{ value: string; label: string }>>;

  uiOpenChange: EventEmitter<UiDropdownCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiField,
  inputs: ['error', 'hint', 'inline', 'label', 'required']
})
@Component({
  selector: 'ui-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['error', 'hint', 'inline', 'label', 'required'],
})
export class UiField {
  protected el: HTMLUiFieldElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiField extends Components.UiField {}


@ProxyCmp({
  defineCustomElementFn: defineUiFileUpload,
  inputs: ['accept', 'disabled', 'hint', 'label', 'maxFiles', 'maxSize', 'maxTotalSize', 'multiple', 'name', 'uploadFn'],
  methods: ['clear']
})
@Component({
  selector: 'ui-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accept', 'disabled', 'hint', 'label', 'maxFiles', 'maxSize', 'maxTotalSize', 'multiple', 'name', 'uploadFn'],
  outputs: ['uiFiles', 'uiUploaded', 'uiRejected', 'uiRemove'],
})
export class UiFileUpload {
  protected el: HTMLUiFileUploadElement;
  @Output() uiFiles = new EventEmitter<UiFileUploadCustomEvent<File[]>>();
  @Output() uiUploaded = new EventEmitter<UiFileUploadCustomEvent<{ file: File; url: string }>>();
  @Output() uiRejected = new EventEmitter<UiFileUploadCustomEvent<IUiFileUploadFileProblem[]>>();
  @Output() uiRemove = new EventEmitter<UiFileUploadCustomEvent<File>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiFileUploadCustomEvent } from '@nova-ui/core/components';
import type { FileProblem as IUiFileUploadFileProblem } from '@nova-ui/core/components';

export declare interface UiFileUpload extends Components.UiFileUpload {
  /**
   * Every file the user picks or drops (after validation).
   */
  uiFiles: EventEmitter<UiFileUploadCustomEvent<File[]>>;
  /**
   * Fires when a file finishes uploading.
   */
  uiUploaded: EventEmitter<UiFileUploadCustomEvent<{ file: File; url: string }>>;
  /**
   * Fires with every rejected file and why.
   */
  uiRejected: EventEmitter<UiFileUploadCustomEvent<IUiFileUploadFileProblem[]>>;

  uiRemove: EventEmitter<UiFileUploadCustomEvent<File>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiHtml,
  inputs: ['allowImages', 'html', 'prose']
})
@Component({
  selector: 'ui-html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['allowImages', 'html', 'prose'],
})
export class UiHtml {
  protected el: HTMLUiHtmlElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiHtml extends Components.UiHtml {}


@ProxyCmp({
  defineCustomElementFn: defineUiIcon,
  inputs: ['filled', 'label', 'name', 'size']
})
@Component({
  selector: 'ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['filled', 'label', { name: 'name', required: true }, 'size'],
})
export class UiIcon {
  protected el: HTMLUiIconElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiIcon extends Components.UiIcon {}


@ProxyCmp({
  defineCustomElementFn: defineUiInput,
  inputs: ['autocomplete', 'disabled', 'error', 'hideLabel', 'hint', 'label', 'maxlength', 'name', 'placeholder', 'readonly', 'required', 'size', 'type', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autocomplete', 'disabled', 'error', 'hideLabel', 'hint', 'label', 'maxlength', 'name', 'placeholder', 'readonly', 'required', 'size', 'type', 'value'],
  outputs: ['uiInput', 'uiChange'],
})
export class UiInput {
  protected el: HTMLUiInputElement;
  @Output() uiInput = new EventEmitter<UiInputCustomEvent<string>>();
  @Output() uiChange = new EventEmitter<UiInputCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiInputCustomEvent } from '@nova-ui/core/components';

export declare interface UiInput extends Components.UiInput {
  /**
   * Fires on every keystroke with the current value.
   */
  uiInput: EventEmitter<UiInputCustomEvent<string>>;
  /**
   * Fires when the value is committed (blur or Enter).
   */
  uiChange: EventEmitter<UiInputCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiKanban,
  inputs: ['cards', 'columns', 'label', 'layout']
})
@Component({
  selector: 'ui-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['cards', 'columns', 'label', 'layout'],
  outputs: ['uiMove'],
})
export class UiKanban {
  protected el: HTMLUiKanbanElement;
  @Output() uiMove = new EventEmitter<UiKanbanCustomEvent<{ cardId: string; to: string; index: number; layout: Record<string, string[]> }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiKanbanCustomEvent } from '@nova-ui/core/components';

export declare interface UiKanban extends Components.UiKanban {
  /**
   * Fires after any move with the new layout.
   */
  uiMove: EventEmitter<UiKanbanCustomEvent<{ cardId: string; to: string; index: number; layout: Record<string, string[]> }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiMarquee,
  inputs: ['direction', 'gap', 'pauseOnHover', 'speed']
})
@Component({
  selector: 'ui-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['direction', 'gap', 'pauseOnHover', 'speed'],
})
export class UiMarquee {
  protected el: HTMLUiMarqueeElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiMarquee extends Components.UiMarquee {}


@ProxyCmp({
  defineCustomElementFn: defineUiMenuItem,
  inputs: ['disabled', 'divider', 'shortcut', 'tone', 'value']
})
@Component({
  selector: 'ui-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'divider', 'shortcut', 'tone', 'value'],
})
export class UiMenuItem {
  protected el: HTMLUiMenuItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiMenuItem extends Components.UiMenuItem {}


@ProxyCmp({
  defineCustomElementFn: defineUiMenubar,
  inputs: ['label']
})
@Component({
  selector: 'ui-menubar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label'],
})
export class UiMenubar {
  protected el: HTMLUiMenubarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiMenubar extends Components.UiMenubar {}


@ProxyCmp({
  defineCustomElementFn: defineUiMenubarMenu,
  inputs: ['disabled', 'label', 'open', 'roving'],
  methods: ['focusTrigger', 'openMenu']
})
@Component({
  selector: 'ui-menubar-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', { name: 'label', required: true }, 'open', 'roving'],
  outputs: ['uiSelect', 'uiNavigate'],
})
export class UiMenubarMenu {
  protected el: HTMLUiMenubarMenuElement;
  @Output() uiSelect = new EventEmitter<UiMenubarMenuCustomEvent<{ value: string; label: string }>>();
  @Output() uiNavigate = new EventEmitter<UiMenubarMenuCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiMenubarMenuCustomEvent } from '@nova-ui/core/components';

export declare interface UiMenubarMenu extends Components.UiMenubarMenu {
  /**
   * Fires when a menu item is chosen.
   */
  uiSelect: EventEmitter<UiMenubarMenuCustomEvent<{ value: string; label: string }>>;
  /**
   * Asks the menubar to move to the previous (-1) or next (1) menu.
   */
  uiNavigate: EventEmitter<UiMenubarMenuCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiModal,
  inputs: ['dismissible', 'heading', 'hideHeader', 'label', 'open', 'placement', 'size']
})
@Component({
  selector: 'ui-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['dismissible', 'heading', 'hideHeader', 'label', 'open', 'placement', 'size'],
  outputs: ['uiOpen', 'uiClose'],
})
export class UiModal {
  protected el: HTMLUiModalElement;
  @Output() uiOpen = new EventEmitter<UiModalCustomEvent<void>>();
  @Output() uiClose = new EventEmitter<UiModalCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiModalCustomEvent } from '@nova-ui/core/components';

export declare interface UiModal extends Components.UiModal {
  /**
   * Fires after the dialog is shown.
   */
  uiOpen: EventEmitter<UiModalCustomEvent<void>>;
  /**
   * Fires after the dialog has closed, however it was closed.
   */
  uiClose: EventEmitter<UiModalCustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiNavItem,
  inputs: ['current', 'href', 'label', 'open'],
  methods: ['focusTrigger']
})
@Component({
  selector: 'ui-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['current', 'href', 'label', 'open'],
  outputs: ['uiToggle'],
})
export class UiNavItem {
  protected el: HTMLUiNavItemElement;
  @Output() uiToggle = new EventEmitter<UiNavItemCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiNavItemCustomEvent } from '@nova-ui/core/components';

export declare interface UiNavItem extends Components.UiNavItem {
  /**
   * Fires when the panel opens or closes. Bubbles so <ui-nav-menu> can close siblings.
   */
  uiToggle: EventEmitter<UiNavItemCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiNavMenu,
  inputs: ['label']
})
@Component({
  selector: 'ui-nav-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label'],
})
export class UiNavMenu {
  protected el: HTMLUiNavMenuElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiNavMenu extends Components.UiNavMenu {}


@ProxyCmp({
  defineCustomElementFn: defineUiOtpInput,
  inputs: ['disabled', 'error', 'hint', 'label', 'length', 'mask', 'name', 'required', 'size', 'type', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-otp-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'error', 'hint', 'label', 'length', 'mask', 'name', 'required', 'size', 'type', 'value'],
  outputs: ['uiInput', 'uiComplete'],
})
export class UiOtpInput {
  protected el: HTMLUiOtpInputElement;
  @Output() uiInput = new EventEmitter<UiOtpInputCustomEvent<string>>();
  @Output() uiComplete = new EventEmitter<UiOtpInputCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiOtpInputCustomEvent } from '@nova-ui/core/components';

export declare interface UiOtpInput extends Components.UiOtpInput {
  /**
   * Fires on every change with the characters entered so far.
   */
  uiInput: EventEmitter<UiOtpInputCustomEvent<string>>;
  /**
   * Fires once, when every box is filled.
   */
  uiComplete: EventEmitter<UiOtpInputCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiPagination,
  inputs: ['boundaries', 'label', 'page', 'pageCount', 'pageSize', 'siblings', 'size', 'total']
})
@Component({
  selector: 'ui-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['boundaries', 'label', 'page', 'pageCount', 'pageSize', 'siblings', 'size', 'total'],
  outputs: ['uiChange'],
})
export class UiPagination {
  protected el: HTMLUiPaginationElement;
  @Output() uiChange = new EventEmitter<UiPaginationCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiPaginationCustomEvent } from '@nova-ui/core/components';

export declare interface UiPagination extends Components.UiPagination {

  uiChange: EventEmitter<UiPaginationCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiPopover,
  inputs: ['closeOnOutside', 'label', 'matchWidth', 'offset', 'open', 'panelRole', 'placement', 'trigger'],
  methods: ['show', 'hide', 'toggle', 'showAt']
})
@Component({
  selector: 'ui-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['closeOnOutside', 'label', 'matchWidth', 'offset', 'open', 'panelRole', 'placement', 'trigger'],
  outputs: ['uiOpenChange', 'uiShow', 'uiHide'],
})
export class UiPopover {
  protected el: HTMLUiPopoverElement;
  @Output() uiOpenChange = new EventEmitter<UiPopoverCustomEvent<boolean>>();
  @Output() uiShow = new EventEmitter<UiPopoverCustomEvent<void>>();
  @Output() uiHide = new EventEmitter<UiPopoverCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiPopoverCustomEvent } from '@nova-ui/core/components';

export declare interface UiPopover extends Components.UiPopover {
  /**
   * Fires when the user (not your code) changes the open state.
   */
  uiOpenChange: EventEmitter<UiPopoverCustomEvent<boolean>>;
  /**
   * Fires after the panel is shown and positioned.
   */
  uiShow: EventEmitter<UiPopoverCustomEvent<void>>;

  uiHide: EventEmitter<UiPopoverCustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiProgress,
  inputs: ['label', 'max', 'showValue', 'tone', 'value']
})
@Component({
  selector: 'ui-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'max', 'showValue', 'tone', 'value'],
})
export class UiProgress {
  protected el: HTMLUiProgressElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiProgress extends Components.UiProgress {}


@ProxyCmp({
  defineCustomElementFn: defineUiRadio,
  inputs: ['checked', 'disabled', 'value']
})
@Component({
  selector: 'ui-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', { name: 'value', required: true }],
})
export class UiRadio {
  protected el: HTMLUiRadioElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiRadio extends Components.UiRadio {}


@ProxyCmp({
  defineCustomElementFn: defineUiRadioGroup,
  inputs: ['disabled', 'label', 'name', 'orientation', 'required', 'value']
})
@Component({
  selector: 'ui-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'label', 'name', 'orientation', 'required', 'value'],
  outputs: ['uiChange'],
})
export class UiRadioGroup {
  protected el: HTMLUiRadioGroupElement;
  @Output() uiChange = new EventEmitter<UiRadioGroupCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiRadioGroupCustomEvent } from '@nova-ui/core/components';

export declare interface UiRadioGroup extends Components.UiRadioGroup {

  uiChange: EventEmitter<UiRadioGroupCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiRating,
  inputs: ['label', 'max', 'readonly', 'size', 'value']
})
@Component({
  selector: 'ui-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'max', 'readonly', 'size', 'value'],
  outputs: ['uiChange'],
})
export class UiRating {
  protected el: HTMLUiRatingElement;
  @Output() uiChange = new EventEmitter<UiRatingCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiRatingCustomEvent } from '@nova-ui/core/components';

export declare interface UiRating extends Components.UiRating {

  uiChange: EventEmitter<UiRatingCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiReveal,
  inputs: ['animation', 'delay', 'duration', 'repeat', 'threshold']
})
@Component({
  selector: 'ui-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animation', 'delay', 'duration', 'repeat', 'threshold'],
  outputs: ['uiReveal'],
})
export class UiReveal {
  protected el: HTMLUiRevealElement;
  @Output() uiReveal = new EventEmitter<UiRevealCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiRevealCustomEvent } from '@nova-ui/core/components';

export declare interface UiReveal extends Components.UiReveal {
  /**
   * Fires after the reveal animation completes.
   */
  uiReveal: EventEmitter<UiRevealCustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiScheduler,
  inputs: ['date', 'dayEnd', 'dayStart', 'events', 'firstDayOfWeek', 'label', 'locale', 'view']
})
@Component({
  selector: 'ui-scheduler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['date', 'dayEnd', 'dayStart', 'events', 'firstDayOfWeek', 'label', 'locale', 'view'],
  outputs: ['uiEventClick', 'uiDateChange', 'uiViewChange'],
})
export class UiScheduler {
  protected el: HTMLUiSchedulerElement;
  @Output() uiEventClick = new EventEmitter<UiSchedulerCustomEvent<IUiSchedulerCalEvent>>();
  @Output() uiDateChange = new EventEmitter<UiSchedulerCustomEvent<string>>();
  @Output() uiViewChange = new EventEmitter<UiSchedulerCustomEvent<'month' | 'week'>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSchedulerCustomEvent } from '@nova-ui/core/components';
import type { CalEvent as IUiSchedulerCalEvent } from '@nova-ui/core/components';

export declare interface UiScheduler extends Components.UiScheduler {

  uiEventClick: EventEmitter<UiSchedulerCustomEvent<IUiSchedulerCalEvent>>;

  uiDateChange: EventEmitter<UiSchedulerCustomEvent<string>>;

  uiViewChange: EventEmitter<UiSchedulerCustomEvent<'month' | 'week'>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiScrollProgress,
  inputs: ['label', 'position', 'target']
})
@Component({
  selector: 'ui-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'position', 'target'],
})
export class UiScrollProgress {
  protected el: HTMLUiScrollProgressElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiScrollProgress extends Components.UiScrollProgress {}


@ProxyCmp({
  defineCustomElementFn: defineUiSelect,
  inputs: ['clearable', 'disabled', 'emptyText', 'error', 'filter', 'hint', 'label', 'multiple', 'name', 'options', 'placeholder', 'required', 'searchable', 'size', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['clearable', 'disabled', 'emptyText', 'error', 'filter', 'hint', 'label', 'multiple', 'name', 'options', 'placeholder', 'required', 'searchable', 'size', 'value'],
  outputs: ['uiChange', 'uiSearch'],
})
export class UiSelect {
  protected el: HTMLUiSelectElement;
  @Output() uiChange = new EventEmitter<UiSelectCustomEvent<string | string[]>>();
  @Output() uiSearch = new EventEmitter<UiSelectCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSelectCustomEvent } from '@nova-ui/core/components';

export declare interface UiSelect extends Components.UiSelect {
  /**
   * Fires when the selection changes.
   */
  uiChange: EventEmitter<UiSelectCustomEvent<string | string[]>>;
  /**
   * Fires as the user types. Use it to fetch options when `filter` is off.
   */
  uiSearch: EventEmitter<UiSelectCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiSidebar,
  inputs: ['collapsed', 'label', 'storageKey']
})
@Component({
  selector: 'ui-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['collapsed', 'label', 'storageKey'],
  outputs: ['uiCollapse'],
})
export class UiSidebar {
  protected el: HTMLUiSidebarElement;
  @Output() uiCollapse = new EventEmitter<UiSidebarCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSidebarCustomEvent } from '@nova-ui/core/components';

export declare interface UiSidebar extends Components.UiSidebar {

  uiCollapse: EventEmitter<UiSidebarCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiSidebarItem,
  inputs: ['badge', 'current', 'group', 'href', 'icon', 'label', 'open', 'tooltip']
})
@Component({
  selector: 'ui-sidebar-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['badge', 'current', 'group', 'href', 'icon', { name: 'label', required: true }, 'open', 'tooltip'],
  outputs: ['uiSelect'],
})
export class UiSidebarItem {
  protected el: HTMLUiSidebarItemElement;
  @Output() uiSelect = new EventEmitter<UiSidebarItemCustomEvent<{ label: string; href?: string }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSidebarItemCustomEvent } from '@nova-ui/core/components';

export declare interface UiSidebarItem extends Components.UiSidebarItem {

  uiSelect: EventEmitter<UiSidebarItemCustomEvent<{ label: string; href?: string }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiSkeleton,
  inputs: ['animated', 'height', 'lines', 'shape', 'width']
})
@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animated', 'height', 'lines', 'shape', 'width'],
})
export class UiSkeleton {
  protected el: HTMLUiSkeletonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiSkeleton extends Components.UiSkeleton {}


@ProxyCmp({
  defineCustomElementFn: defineUiSlider,
  inputs: ['disabled', 'label', 'max', 'min', 'name', 'showValue', 'step', 'value']
})
@Component({
  selector: 'ui-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'label', 'max', 'min', 'name', 'showValue', 'step', 'value'],
  outputs: ['uiInput', 'uiChange'],
})
export class UiSlider {
  protected el: HTMLUiSliderElement;
  @Output() uiInput = new EventEmitter<UiSliderCustomEvent<number>>();
  @Output() uiChange = new EventEmitter<UiSliderCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSliderCustomEvent } from '@nova-ui/core/components';

export declare interface UiSlider extends Components.UiSlider {
  /**
   * Fires continuously while dragging.
   */
  uiInput: EventEmitter<UiSliderCustomEvent<number>>;
  /**
   * Fires when the user releases the thumb or uses the keyboard.
   */
  uiChange: EventEmitter<UiSliderCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiSortable,
  inputs: ['items', 'label']
})
@Component({
  selector: 'ui-sortable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['items', 'label'],
  outputs: ['uiReorder'],
})
export class UiSortable {
  protected el: HTMLUiSortableElement;
  @Output() uiReorder = new EventEmitter<UiSortableCustomEvent<IUiSortableSortItem[]>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSortableCustomEvent } from '@nova-ui/core/components';
import type { SortItem as IUiSortableSortItem } from '@nova-ui/core/components';

export declare interface UiSortable extends Components.UiSortable {
  /**
   * Fires with the new order after every change.
   */
  uiReorder: EventEmitter<UiSortableCustomEvent<IUiSortableSortItem[]>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiSparkline,
  inputs: ['area', 'height', 'label', 'values', 'width']
})
@Component({
  selector: 'ui-sparkline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['area', 'height', 'label', 'values', 'width'],
})
export class UiSparkline {
  protected el: HTMLUiSparklineElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiSparkline extends Components.UiSparkline {}


@ProxyCmp({
  defineCustomElementFn: defineUiSpinner,
  inputs: ['label', 'size']
})
@Component({
  selector: 'ui-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'size'],
})
export class UiSpinner {
  protected el: HTMLUiSpinnerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiSpinner extends Components.UiSpinner {}


@ProxyCmp({
  defineCustomElementFn: defineUiSplit,
  inputs: ['label', 'minA', 'minB', 'orientation', 'ratio', 'storageKey']
})
@Component({
  selector: 'ui-split',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'minA', 'minB', 'orientation', 'ratio', 'storageKey'],
  outputs: ['uiResize'],
})
export class UiSplit {
  protected el: HTMLUiSplitElement;
  @Output() uiResize = new EventEmitter<UiSplitCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSplitCustomEvent } from '@nova-ui/core/components';

export declare interface UiSplit extends Components.UiSplit {

  uiResize: EventEmitter<UiSplitCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiStagger,
  inputs: ['animation', 'duration', 'step', 'trigger']
})
@Component({
  selector: 'ui-stagger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animation', 'duration', 'step', 'trigger'],
})
export class UiStagger {
  protected el: HTMLUiStaggerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiStagger extends Components.UiStagger {}


@ProxyCmp({
  defineCustomElementFn: defineUiStep,
  inputs: ['clickable', 'description', 'error', 'heading', 'index', 'last', 'orientation', 'status']
})
@Component({
  selector: 'ui-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['clickable', 'description', 'error', 'heading', 'index', 'last', 'orientation', 'status'],
})
export class UiStep {
  protected el: HTMLUiStepElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiStep extends Components.UiStep {}


@ProxyCmp({
  defineCustomElementFn: defineUiStepper,
  inputs: ['clickable', 'current', 'label', 'orientation']
})
@Component({
  selector: 'ui-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['clickable', 'current', 'label', 'orientation'],
  outputs: ['uiChange'],
})
export class UiStepper {
  protected el: HTMLUiStepperElement;
  @Output() uiChange = new EventEmitter<UiStepperCustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiStepperCustomEvent } from '@nova-ui/core/components';

export declare interface UiStepper extends Components.UiStepper {
  /**
   * Fires when a completed step is clicked.
   */
  uiChange: EventEmitter<UiStepperCustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiSwitch,
  inputs: ['checked', 'disabled', 'name', 'reverse', 'value']
})
@Component({
  selector: 'ui-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', 'name', 'reverse', 'value'],
  outputs: ['uiChange'],
})
export class UiSwitch {
  protected el: HTMLUiSwitchElement;
  @Output() uiChange = new EventEmitter<UiSwitchCustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiSwitchCustomEvent } from '@nova-ui/core/components';

export declare interface UiSwitch extends Components.UiSwitch {

  uiChange: EventEmitter<UiSwitchCustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiTab,
  inputs: ['disabled', 'selected', 'value']
})
@Component({
  selector: 'ui-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'selected', { name: 'value', required: true }],
})
export class UiTab {
  protected el: HTMLUiTabElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiTab extends Components.UiTab {}


@ProxyCmp({
  defineCustomElementFn: defineUiTabPanel,
  inputs: ['selected', 'value']
})
@Component({
  selector: 'ui-tab-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['selected', { name: 'value', required: true }],
})
export class UiTabPanel {
  protected el: HTMLUiTabPanelElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiTabPanel extends Components.UiTabPanel {}


@ProxyCmp({
  defineCustomElementFn: defineUiTable,
  inputs: ['caption', 'columns', 'density', 'emptyText', 'expandable', 'exportFilename', 'exportable', 'loading', 'manual', 'maxHeight', 'page', 'pageSize', 'pageSizeOptions', 'paginate', 'resizable', 'rowClickable', 'rowHeight', 'rowKey', 'rows', 'searchPlaceholder', 'searchable', 'selectable', 'selected', 'sort', 'striped', 'total', 'virtual'],
  methods: ['exportCSV']
})
@Component({
  selector: 'ui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['caption', 'columns', 'density', 'emptyText', 'expandable', 'exportFilename', 'exportable', 'loading', 'manual', 'maxHeight', 'page', 'pageSize', 'pageSizeOptions', 'paginate', 'resizable', 'rowClickable', 'rowHeight', 'rowKey', 'rows', 'searchPlaceholder', 'searchable', 'selectable', 'selected', 'sort', 'striped', 'total', 'virtual'],
  outputs: ['uiQueryChange', 'uiSelectionChange', 'uiRowClick'],
})
export class UiTable {
  protected el: HTMLUiTableElement;
  @Output() uiQueryChange = new EventEmitter<UiTableCustomEvent<IUiTableTableQuery>>();
  @Output() uiSelectionChange = new EventEmitter<UiTableCustomEvent<string[]>>();
  @Output() uiRowClick = new EventEmitter<UiTableCustomEvent<IUiTableTableRow>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiTableCustomEvent } from '@nova-ui/core/components';
import type { TableQuery as IUiTableTableQuery } from '@nova-ui/core/components';
import type { TableRow as IUiTableTableRow } from '@nova-ui/core/components';

export declare interface UiTable extends Components.UiTable {
  /**
   * Fires whenever page, page size, sort or search changes. In manual mode, fetch from this.
   */
  uiQueryChange: EventEmitter<UiTableCustomEvent<IUiTableTableQuery>>;

  uiSelectionChange: EventEmitter<UiTableCustomEvent<string[]>>;

  uiRowClick: EventEmitter<UiTableCustomEvent<IUiTableTableRow>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiTabs,
  inputs: ['activation', 'label', 'orientation', 'value', 'variant']
})
@Component({
  selector: 'ui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activation', 'label', 'orientation', 'value', 'variant'],
  outputs: ['uiChange'],
})
export class UiTabs {
  protected el: HTMLUiTabsElement;
  @Output() uiChange = new EventEmitter<UiTabsCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiTabsCustomEvent } from '@nova-ui/core/components';

export declare interface UiTabs extends Components.UiTabs {

  uiChange: EventEmitter<UiTabsCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiTagInput,
  inputs: ['allowDuplicates', 'disabled', 'error', 'hint', 'label', 'max', 'name', 'placeholder', 'required', 'separators', 'size', 'validate', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-tag-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['allowDuplicates', 'disabled', 'error', 'hint', 'label', 'max', 'name', 'placeholder', 'required', 'separators', 'size', 'validate', 'value'],
  outputs: ['uiChange', 'uiReject'],
})
export class UiTagInput {
  protected el: HTMLUiTagInputElement;
  @Output() uiChange = new EventEmitter<UiTagInputCustomEvent<string[]>>();
  @Output() uiReject = new EventEmitter<UiTagInputCustomEvent<{ tag: string; reason: string }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiTagInputCustomEvent } from '@nova-ui/core/components';

export declare interface UiTagInput extends Components.UiTagInput {

  uiChange: EventEmitter<UiTagInputCustomEvent<string[]>>;
  /**
   * Fires when a tag is refused, with the reason.
   */
  uiReject: EventEmitter<UiTagInputCustomEvent<{ tag: string; reason: string }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiTextarea,
  inputs: ['autoresize', 'disabled', 'error', 'hint', 'label', 'maxlength', 'name', 'placeholder', 'readonly', 'required', 'rows', 'size', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autoresize', 'disabled', 'error', 'hint', 'label', 'maxlength', 'name', 'placeholder', 'readonly', 'required', 'rows', 'size', 'value'],
  outputs: ['uiInput', 'uiChange'],
})
export class UiTextarea {
  protected el: HTMLUiTextareaElement;
  @Output() uiInput = new EventEmitter<UiTextareaCustomEvent<string>>();
  @Output() uiChange = new EventEmitter<UiTextareaCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiTextareaCustomEvent } from '@nova-ui/core/components';

export declare interface UiTextarea extends Components.UiTextarea {

  uiInput: EventEmitter<UiTextareaCustomEvent<string>>;

  uiChange: EventEmitter<UiTextareaCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiThemeToggle
})
@Component({
  selector: 'ui-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class UiThemeToggle {
  protected el: HTMLUiThemeToggleElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiThemeToggle extends Components.UiThemeToggle {}


@ProxyCmp({
  defineCustomElementFn: defineUiTimePicker,
  inputs: ['disabled', 'error', 'hint', 'label', 'locale', 'max', 'min', 'name', 'required', 'size', 'step', 'value'],
  methods: ['focusInput']
})
@Component({
  selector: 'ui-time-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'error', 'hint', 'label', 'locale', 'max', 'min', 'name', 'required', 'size', 'step', 'value'],
  outputs: ['uiChange'],
})
export class UiTimePicker {
  protected el: HTMLUiTimePickerElement;
  @Output() uiChange = new EventEmitter<UiTimePickerCustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiTimePickerCustomEvent } from '@nova-ui/core/components';

export declare interface UiTimePicker extends Components.UiTimePicker {

  uiChange: EventEmitter<UiTimePickerCustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiToaster,
  inputs: ['duration', 'max', 'placement'],
  methods: ['show', 'dismiss', 'clear']
})
@Component({
  selector: 'ui-toaster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['duration', 'max', 'placement'],
})
export class UiToaster {
  protected el: HTMLUiToasterElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiToaster extends Components.UiToaster {}


@ProxyCmp({
  defineCustomElementFn: defineUiTooltip,
  inputs: ['content', 'delay', 'disabled', 'placement']
})
@Component({
  selector: 'ui-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['content', 'delay', 'disabled', 'placement'],
})
export class UiTooltip {
  protected el: HTMLUiTooltipElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiTooltip extends Components.UiTooltip {}


@ProxyCmp({
  defineCustomElementFn: defineUiTree,
  inputs: ['expanded', 'label', 'nodes', 'selected']
})
@Component({
  selector: 'ui-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['expanded', 'label', 'nodes', 'selected'],
  outputs: ['uiSelect', 'uiToggle'],
})
export class UiTree {
  protected el: HTMLUiTreeElement;
  @Output() uiSelect = new EventEmitter<UiTreeCustomEvent<{ id: string; node: IUiTreeTreeNode }>>();
  @Output() uiToggle = new EventEmitter<UiTreeCustomEvent<{ id: string; expanded: boolean }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiTreeCustomEvent } from '@nova-ui/core/components';
import type { TreeNode as IUiTreeTreeNode } from '@nova-ui/core/components';

export declare interface UiTree extends Components.UiTree {

  uiSelect: EventEmitter<UiTreeCustomEvent<{ id: string; node: IUiTreeTreeNode }>>;

  uiToggle: EventEmitter<UiTreeCustomEvent<{ id: string; expanded: boolean }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineUiVirtualList,
  inputs: ['count', 'height', 'label', 'overscan', 'renderRow', 'rowHeight']
})
@Component({
  selector: 'ui-virtual-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['count', 'height', 'label', 'overscan', 'renderRow', 'rowHeight'],
})
export class UiVirtualList {
  protected el: HTMLUiVirtualListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface UiVirtualList extends Components.UiVirtualList {}


