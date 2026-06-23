const CACHE_NAME = "nativelearn-pwa-v0.1.0";
const scopeUrl = new URL(self.registration.scope);
const appRootUrl = new URL("./", scopeUrl).href;
const offlineUrl = new URL("offline.html", scopeUrl).href;
const assetsPath = new URL("assets/", scopeUrl).pathname;
const APP_SHELL = ["./", "index.html", "manifest.webmanifest", "offline.html", "icons/nativelearn-icon.svg"].map(
  (path) => new URL(path, scopeUrl).href
);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("nativelearn-pwa-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (shouldCache(request, requestUrl)) {
    event.respondWith(cacheFirst(request));
  }
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(appRootUrl, response.clone());
    }

    return response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match(appRootUrl)) ||
      (await caches.match(offlineUrl))
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    return new Response("", {
      status: 504,
      statusText: "Offline"
    });
  }
}

function shouldCache(request, requestUrl) {
  return (
    requestUrl.pathname.startsWith(assetsPath) ||
    APP_SHELL.includes(requestUrl.href) ||
    ["font", "image", "manifest", "script", "style"].includes(request.destination)
  );
}
