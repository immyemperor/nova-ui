import { Component, Host, State, h } from '@stencil/core';
import { ThemeMode, getThemeMode, initTheme, onThemeChange, setThemeMode } from '../../utils/theme';

const ORDER: ThemeMode[] = ['light', 'dark', 'system'];
const ICON: Record<ThemeMode, string> = { light: 'sun', dark: 'moon', system: 'monitor' };
const NAME: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', system: 'System' };

/** One-button theme switcher: cycles light, dark, system. */
@Component({
  tag: 'ui-theme-toggle',
  shadow: true,
})
export class UiThemeToggle {
  @State() mode: ThemeMode = 'system';
  private off?: () => void;

  componentWillLoad() {
    initTheme();
    this.mode = getThemeMode();
    this.off = onThemeChange((mode) => (this.mode = mode));
  }

  disconnectedCallback() {
    this.off?.();
  }

  private next = () => {
    const i = ORDER.indexOf(this.mode);
    setThemeMode(ORDER[(i + 1) % ORDER.length]);
  };

  render() {
    const upcoming = ORDER[(ORDER.indexOf(this.mode) + 1) % ORDER.length];
    return (
      <Host>
        <ui-button
          variant="ghost"
          icon-only
          label={`Theme: ${NAME[this.mode]}. Switch to ${NAME[upcoming]}.`}
          onClick={this.next}
        >
          <ui-icon name={ICON[this.mode]} size="1.25em" />
        </ui-button>
      </Host>
    );
  }
}
