import '@stencil/core';

declare module '@stencil/core' {
  export namespace JSX {
    interface IntrinsicElements {
      [tag: `ui-${string}`]: any;
    }
  }
}
