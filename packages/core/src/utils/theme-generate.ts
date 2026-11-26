import { contrastRatio, mix, normaliseHex, readableOn } from './color';

/**
 * Generate a full light and dark palette from one brand colour. The output is checked by construction:
 * text on accent and accent on surface meet WCAG AA (4.5:1), so a brand colour can never silently break contrast.
 * Output is a set of --kvui-color-* values you can drop into :root and [data-theme='dark'].
 */
export interface GeneratedTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
  /** Pairs that could not reach 4.5:1 (only possible for near-invalid input). Empty for normal colours. */
  warnings: string[];
}

const AA = 4.5;

/** Darken (light theme) or lighten (dark theme) until `on` reaches AA against `against`. */
function toward(hex: string, against: string, towards: string): { colour: string; ok: boolean } {
  let c = hex;
  for (let i = 0; i <= 20; i++) {
    if (contrastRatio(c, against) >= AA) return { colour: c, ok: true };
    c = mix(hex, towards, (i + 1) / 20);
  }
  return { colour: c, ok: false };
}

export function generateTheme(brand: string): GeneratedTheme {
  const seed = normaliseHex(brand);
  if (!seed) throw new Error(`generateTheme: "${brand}" is not a hex colour`);
  const warnings: string[] = [];

  const lightSurface = '#ffffff', lightBg = '#f6f8f7';
  const darkSurface = '#141d1a', darkBg = '#0d1412';

  // Light: accent must read on the page, so darken it if needed.
  const lAcc = toward(seed, lightSurface, '#000000');
  if (!lAcc.ok) warnings.push('light accent could not reach 4.5:1 on white');
  const accL = lAcc.colour;
  const lHover = mix(accL, '#000000', 0.12);
  const lActive = mix(accL, '#000000', 0.24);
  const lSoft = mix(accL, '#ffffff', 0.86);

  // Dark: accent must read on the dark surface, so lighten it if needed.
  const dAcc = toward(seed, darkSurface, '#ffffff');
  if (!dAcc.ok) warnings.push('dark accent could not reach 4.5:1 on the dark surface');
  const accD = dAcc.colour;
  const dHover = mix(accD, '#ffffff', 0.18);
  const dActive = mix(accD, '#ffffff', 0.32);
  const dSoft = mix(accD, darkSurface, 0.82);

  const onL = readableOn(accL), onD = readableOn(accD);
  if (contrastRatio(onL, accL) < AA) warnings.push('text on light accent is below 4.5:1');
  if (contrastRatio(onD, accD) < AA) warnings.push('text on dark accent is below 4.5:1');

  const light = {
    '--kvui-color-accent': accL,
    '--kvui-color-accent-hover': lHover,
    '--kvui-color-accent-active': lActive,
    '--kvui-color-accent-soft': lSoft,
    '--kvui-color-fg-on-accent': onL,
    '--kvui-color-bg': lightBg,
    '--kvui-color-surface': lightSurface,
  };
  const dark = {
    '--kvui-color-accent': accD,
    '--kvui-color-accent-hover': dHover,
    '--kvui-color-accent-active': dActive,
    '--kvui-color-accent-soft': dSoft,
    '--kvui-color-fg-on-accent': onD,
    '--kvui-color-bg': darkBg,
    '--kvui-color-surface': darkSurface,
  };
  return { light, dark, warnings };
}

/** CSS you can paste into a stylesheet. */
export function themeToCSS(t: GeneratedTheme): string {
  const block = (vars: Record<string, string>) => Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `:root,\n[data-theme='light'] {\n${block(t.light)}\n}\n\n[data-theme='dark'] {\n${block(t.dark)}\n}\n`;
}
