import { GAME_CONFIG } from "./config.js";
const CACHE_NAME = GAME_CONFIG.SW_CACHE_NAME;
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/shared/common.css",
  "/shared/styles/variables.css",
  "/shared/styles/base.css",
  "/shared/styles/components.css",
  "/shared/styles/games.css",
  "/shared/styles/hangman.css",
  "/shared/icons/icon.svg",
  "/shared/initLocale.js",
  "/shared/registerSw.js",
  "/shared/sw.js",
  "/shared/config.js",
  "/shared/BaseGame.js",
  "/shared/QuizGame.js",
  "/shared/HangmanGame.js",
  "/shared/dataProvider.js",
  "/shared/deckUtils.js",
  "/shared/wordUtils.js",
  "/shared/hangmanUtils.js",
  "/shared/chatEngine.js",
  "/shared/prefetchGameData.js",
  "/shared/i18n/index.js",
  "/shared/i18n/locales/cs.js",
  "/shared/i18n/locales/en.js",
  "/shared/fixtures/characters.json",
  "/shared/fixtures/spells.json",
  "/guess-character-name/index.html",
  "/guess-character-name/script.js",
  "/guess-spell/index.html",
  "/guess-spell/script.js",
  "/guess-house/index.html",
  "/guess-house/script.js",
  "/who-is-on-photo/index.html",
  "/who-is-on-photo/script.js",
  "/chat-with-character/index.html",
  "/chat-with-character/script.js"
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(async () => {
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.postMessage({ type: "SW_UPDATED" });
      }
      await self.clients.claim();
    })
  );
});
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  if (isHtmlRequest(request, url)) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
function isHtmlRequest(request, url) {
  if (request.mode === "navigate") {
    return true;
  }
  const path = url.pathname;
  return path === "/" || path.endsWith(".html");
}
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw new Error("Network and cache both failed");
  }
}
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}
