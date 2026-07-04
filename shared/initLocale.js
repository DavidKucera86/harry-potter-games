import { initLocale } from "./i18n/index.js";
import { prefetchGameData } from "./prefetchGameData.js";
import { registerServiceWorker } from "./registerSw.js";
initLocale();
prefetchGameData();
registerServiceWorker();
