import { getCharacters, getSpells } from './dataProvider.js';

function isMenuPage(): boolean {
  const normalized = window.location.pathname.replace(/\/$/, '') || '/';
  return normalized === '/' || normalized === '/index.html';
}

export function prefetchGameData(): void {
  if (typeof window === 'undefined' || !isMenuPage()) {
    return;
  }

  void getCharacters().catch(() => {});
  void getSpells().catch(() => {});
}
