import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

const coreComponentTags: string[] = [
  'ui-accordion', 'ui-accordion-item', 'ui-alert', 'ui-avatar', 'ui-badge',
  'ui-breadcrumb', 'ui-breadcrumb-item', 'ui-button', 'ui-calendar', 'ui-card',
  'ui-carousel', 'ui-checkbox', 'ui-color-picker', 'ui-command-palette',
  'ui-context-menu', 'ui-counter', 'ui-date-picker', 'ui-drawer', 'ui-dropdown',
  'ui-icon', 'ui-input', 'ui-marquee', 'ui-menu-item', 'ui-menubar',
  'ui-menubar-menu', 'ui-modal', 'ui-nav-item', 'ui-nav-menu', 'ui-otp-input',
  'ui-pagination', 'ui-popover', 'ui-progress', 'ui-radio', 'ui-radio-group',
  'ui-rating', 'ui-reveal', 'ui-select', 'ui-skeleton', 'ui-slider', 'ui-spinner',
  'ui-stagger', 'ui-step', 'ui-stepper', 'ui-switch', 'ui-tab', 'ui-tab-panel',
  'ui-table', 'ui-tabs', 'ui-tag-input', 'ui-textarea', 'ui-theme-toggle',
  'ui-toaster', 'ui-tooltip', 'ui-tree',
];

export const config: Config = {
  namespace: 'nova-ui-editor',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements' , externalRuntime: false },
    // Editor wrappers go into their own entry points so the editor stays optional:
    //   import { UiEditor } from '@nova-ui/react/editor'
    //   import { UiEditor } from '@nova-ui/angular/editor'
    reactOutputTarget({
      outDir: '../react/src/editor/stencil-generated/',
      customElementsDir: 'components',
      excludeComponents: coreComponentTags,
    }),
    angularOutputTarget({
      componentCorePackage: '@nova-ui/editor',
      outputType: 'standalone',
      directivesProxyFile: '../angular/editor/src/stencil-generated/components.ts',
      directivesArrayFile: '../angular/editor/src/stencil-generated/index.ts',
      includeImportCustomElements: true,
      excludeComponents: coreComponentTags,
      valueAccessorConfigs: [{ elementSelectors: ['ui-editor'], event: 'uiChange', targetAttr: 'value', type: 'text' }],
    }),
  ],
  // @nova-ui/core is a peer dependency: never bundle a second copy of its components.
  rollupConfig: { inputOptions: { external: [/^@nova-ui\/core/] } },
  testing: { browserHeadless: 'shell' },
};
