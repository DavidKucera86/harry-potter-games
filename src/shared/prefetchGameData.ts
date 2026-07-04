import { getCharacters, getSpells } from './dataProvider.js';

function isMenuPage(): boolean {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('/index.html') || path.endsWith('/');
}

export function prefetchGameData(): void {
  if (typeof window === 'undefined' || !isMenuPage()) {
    return;
  }

  void getCharacters().catch(() => {});
  void getSpells().catch(() => {});
}
