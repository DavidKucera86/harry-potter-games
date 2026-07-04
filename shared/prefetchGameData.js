import { getCharacters, getSpells } from "./dataProvider.js";
function isMenuPage() {
  const path = window.location.pathname;
  return path === "/" || path.endsWith("/index.html") || path.endsWith("/");
}
function prefetchGameData() {
  if (typeof window === "undefined" || !isMenuPage()) {
    return;
  }
  void getCharacters().catch(() => {
  });
  void getSpells().catch(() => {
  });
}
export {
  prefetchGameData
};
