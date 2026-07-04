import { getStrings } from './i18n/index.js';

let pendingReload = false;

function showUpdateBanner(): void {
  const banner = document.getElementById('swUpdateBanner');
  if (!banner || !banner.hidden) {
    return;
  }

  banner.hidden = false;

  const message = document.getElementById('swUpdateMessage');
  if (message) {
    message.textContent = getStrings().ui.swUpdateMessage;
  }

  const reloadBtn = document.getElementById('swUpdateReloadBtn');
  if (reloadBtn instanceof HTMLButtonElement) {
    reloadBtn.textContent = getStrings().ui.swUpdateReload;
    reloadBtn.setAttribute('aria-label', getStrings().ui.swUpdateReload);
    reloadBtn.addEventListener('click', () => {
      pendingReload = true;
      window.location.reload();
    }, { once: true });
  }
}

function bindServiceWorkerEvents(registration: ServiceWorkerRegistration): void {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    if (!newWorker) {
      return;
    }

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        showUpdateBanner();
      }
    });
  });
}

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const register = () => {
    navigator.serviceWorker.register('/shared/sw.js')
      .then((registration) => {
        bindServiceWorkerEvents(registration);

        if (registration.waiting && navigator.serviceWorker.controller) {
          showUpdateBanner();
        }
      })
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  };

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SW_UPDATED') {
      showUpdateBanner();
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (pendingReload) {
      window.location.reload();
    }
  });

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
}
