'use client';

import { themes, useTheme } from './theme-provider';

export function ThemePicker() {
  const { theme: selectedTheme, setTheme, ready } = useTheme();

  return <fieldset className="theme-picker" aria-label="Choose a color theme">
    <legend className="hidden">Choose a color theme</legend>
    {themes.map((theme) => <button
      key={theme.id}
      className={`theme-option${selectedTheme === theme.id ? ' selected' : ''}`}
      type="button"
      aria-pressed={selectedTheme === theme.id}
      disabled={!ready}
      onClick={() => setTheme(theme.id)}
    >
      <span className="theme-swatches" aria-hidden="true">
        {theme.colors.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
      </span>
      <span className="theme-option-copy"><strong>{theme.name}</strong><small>{theme.description}</small></span>
      <span className="theme-check" aria-hidden="true">{selectedTheme === theme.id ? '✓' : ''}</span>
    </button>)}
    <p className="field-help">Your choice is saved on this device.</p>
  </fieldset>;
}
