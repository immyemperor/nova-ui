/**
 * Tailwind CSS preset for Kvui UI. Colours, radius, shadows and fonts resolve to the same CSS variables the
 * components use, so Tailwind classes follow light, dark and brand themes automatically.
 *   // tailwind.config.js
 *   module.exports = { presets: [require('@kvui/tailwind')], content: [...] }
 *   <button class="bg-kvui-accent text-kvui-on-accent rounded-kvui">Save</button>
 */
const v = (name) => `var(--kvui-${name})`;

module.exports = {
  theme: {
    extend: {
      colors: {
        kvui: {
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
        'kvui-control': v('radius-control'),
        'kvui-surface': v('radius-surface'),
        'kvui-pill': v('radius-pill'),
      },
      boxShadow: {
        'kvui-sm': v('shadow-sm'),
        'kvui-md': v('shadow-md'),
        'kvui-lg': v('shadow-lg'),
      },
      fontFamily: {
        'kvui-sans': v('font-sans'),
        'kvui-mono': v('font-mono'),
      },
      transitionDuration: {
        'kvui-fast': v('duration-fast'),
        'kvui-base': v('duration-base'),
      },
      zIndex: {
        'kvui-dropdown': v('z-dropdown'),
        'kvui-modal': v('z-modal'),
        'kvui-toast': v('z-toast'),
      },
    },
  },
};
