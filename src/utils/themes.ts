import { Themes } from 'constants/theme';
const html = window.document.getElementsByTagName('html')[0];
export function setThemes(theme: keyof typeof Themes) {
  const current = html.getAttribute('data-theme');
  if (current !== theme) html.setAttribute('data-theme', theme);
}
