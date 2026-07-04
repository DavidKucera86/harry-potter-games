import { getCharacters, getSpells } from "./dataProvider.js";
function isMenuPage() {
  const normalized = window.location.pathname.replace(/\/$/, "") || "/";
  return normalized === "/" || normalized === "/index.html";
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
