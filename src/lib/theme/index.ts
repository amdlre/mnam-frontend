export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'mnam.theme';

/**
 * Inline `<script>` body that runs before React hydrates and sets the `.dark`
 * class on `<html>` based on the persisted preference (or system preference
 * when no preference is stored or stored value is "system").
 */
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var resolved = stored;
    if (resolved !== 'light' && resolved !== 'dark') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (resolved === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();
`;
