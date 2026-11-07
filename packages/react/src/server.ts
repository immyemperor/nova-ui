// Server-safe: import in layouts. Keep in sync with packages/core/src/utils/theme.ts.
export const themeInitScript =
  "(function(){try{var m=localStorage.getItem('nova-ui-theme')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=d?'dark':'light';var e=document.documentElement;e.setAttribute('data-theme',r);e.setAttribute('data-theme-mode',m);e.style.colorScheme=r}catch(_){}})();";
