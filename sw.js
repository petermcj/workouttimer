// Bump VERSION when files change so phones pick up the new app,
// and use the same value in the app.js?v= link in index.html.
const VERSION = "crosscage-v12";
const SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./fonts/fonts.css",
  "./fonts/barlow-400.woff2",
  "./fonts/barlow-500.woff2",
  "./fonts/barlow-600.woff2",
  "./fonts/barlow-condensed-500.woff2",
  "./fonts/barlow-condensed-600.woff2",
  "./fonts/barlow-condensed-700.woff2",
  "./fonts/barlow-condensed-800.woff2",
  "./manifest.webmanifest",
  "./apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/favicon-64.png"
];

self.addEventListener("install", (e) => {
  // cache: "reload" skips the browser's HTTP cache (GitHub Pages lets it keep files for 10 minutes),
  // so a new version never stores an old copy of a file.
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // The page and its script: try the network first so updates arrive, fall back to the cache offline.
  const url = new URL(req.url);
  const isScript = url.origin === location.origin && url.pathname.endsWith("/app.js");
  if (req.mode === "navigate" || isScript) {
    const key = isScript ? "./app.js" : "./index.html";
    e.respondWith(
      // cache: "no-cache" asks the server every time, so the page and its script are always the same version.
      fetch(req, { cache: "no-cache" })
        .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(key, copy)); } return res; })
        .catch(() => caches.match(key))
    );
    return;
  }

  // Everything else (script, fonts, icons): cache first, then store what the network returns.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
