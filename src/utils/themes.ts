import { Themes } from 'constants/theme';
const html = window.document.getElementsByTagName('html')[0];
export function getThemes() {
  return html.getAttribute('data-theme');
}
export function setThemes(theme: keyof typeof Themes) {
  const cTheme = getThemes();
  if (cTheme !== theme) html.setAttribute('data-theme', theme);
}
