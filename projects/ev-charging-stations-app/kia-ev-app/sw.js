// NiroCharge Service Worker v1.0
const CACHE_NAME = 'nirocharge-v1';
const BASE = '/projects/ev-charging-stations-app';
const OFFLINE_URLS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap',
];

// Install: pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_URLS).catch(err => {
        console.warn('NiroCharge SW: Pre-cache partial failure', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for assets, network-first for API calls
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and chrome-extension
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Network-first for external APIs (charging data)
  if (url.hostname.includes('nrel.gov') ||
      url.hostname.includes('openchargemap.io') ||
      url.hostname.includes('plugshare.com') ||
      url.hostname.includes('maps.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for app shell
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// Background sync for offline charging session logging
self.addEventListener('sync', event => {
  if (event.tag === 'sync-charging-logs') {
    event.waitUntil(syncChargingLogs());
  }
});

async function syncChargingLogs() {
  // Sync any offline-stored charging session data when back online
  console.log('NiroCharge: Syncing charging logs...');
}

// Push notifications (for charger available alerts)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'NiroCharge';
  const options = {
    body: data.body || 'A charger is now available near you',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'charger-alert',
    data: data.url,
    actions: [
      { action: 'navigate', title: '🗺 Navigate' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'navigate' && event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});
