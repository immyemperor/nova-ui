import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'nova-ui',
  // Emitted as dist/nova-ui/nova-ui.css and exposed as "@nova-ui/core/styles.css".
  globalStyle: 'src/global/global.css',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    // Tree-shakeable per-component bundles, used by the React and Angular wrappers.
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements', externalRuntime: false },
    reactOutputTarget({
      outDir: '../react/src/components/stencil-generated/',
      customElementsDir: 'components',
    }),
    angularOutputTarget({
      componentCorePackage: '@nova-ui/core',
      outputType: 'standalone',
      directivesProxyFile: '../angular/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular/src/lib/stencil-generated/index.ts',
      includeImportCustomElements: true,
      // Lets Angular forms (ngModel, formControl) work with the form components.
      valueAccessorConfigs: [
        { elementSelectors: ['ui-input', 'ui-textarea'], event: 'uiInput', targetAttr: 'value', type: 'text' },
        { elementSelectors: ['ui-slider', 'ui-rating'], event: 'uiChange', targetAttr: 'value', type: 'number' },
        { elementSelectors: ['ui-checkbox', 'ui-switch'], event: 'uiChange', targetAttr: 'checked', type: 'boolean' },
        { elementSelectors: ['ui-radio-group', 'ui-select'], event: 'uiChange', targetAttr: 'value', type: 'select' },
      ],
    }),
  ],
  testing: { browserHeadless: 'shell' },
};
