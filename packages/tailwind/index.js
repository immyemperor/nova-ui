/**
 * Tailwind CSS preset for Nova UI. Colours, radius, shadows and fonts resolve to the same CSS variables the
 * components use, so Tailwind classes follow light, dark and brand themes automatically.
 *   // tailwind.config.js
 *   module.exports = { presets: [require('@omni/tailwind')], content: [...] }
 *   <button class="bg-nova-accent text-nova-on-accent rounded-nova">Save</button>
 */
const v = (name) => `var(--nova-${name})`;

module.exports = {
  theme: {
    extend: {
      colors: {
        nova: {
          bg: v('color-bg'),
          surface: v('color-surface'),
          raised: v('color-surface-raised'),
          sunken: v('color-surface-sunken'),
          border: v('color-border'),
          'border-strong': v('color-border-strong'),
          fg: v('color-fg'),
          muted: v('color-fg-muted'),
          subtle: v('color-fg-subtle'),
          accent: v('color-accent'),
          'accent-hover': v('color-accent-hover'),
          'accent-soft': v('color-accent-soft'),
          'on-accent': v('color-fg-on-accent'),
          success: v('color-success'),
          warning: v('color-warning'),
          danger: v('color-danger'),
          info: v('color-info'),
        },
      },
      borderRadius: {
        'nova-control': v('radius-control'),
        'nova-surface': v('radius-surface'),
        'nova-pill': v('radius-pill'),
      },
      boxShadow: {
        'nova-sm': v('shadow-sm'),
        'nova-md': v('shadow-md'),
        'nova-lg': v('shadow-lg'),
      },
      fontFamily: {
        'nova-sans': v('font-sans'),
        'nova-mono': v('font-mono'),
      },
      transitionDuration: {
        'nova-fast': v('duration-fast'),
        'nova-base': v('duration-base'),
      },
      zIndex: {
        'nova-dropdown': v('z-dropdown'),
        'nova-modal': v('z-modal'),
        'nova-toast': v('z-toast'),
      },
    },
  },
};
