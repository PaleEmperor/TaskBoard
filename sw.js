const CACHE_NAME = "homeflow-cache-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./school.html",
  "./tabs.js",
  "./styles.css",
  "./app.js",
  "./data/fi-holidays.json",
  "./data/member-birthdays.json",
  "./art/birthday-images/linnea.png",
  "./art/birthday-images/sini.png",
  "./art/birthday-images/bjorn.png",
  "./art/birthday-images/nina.png",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

async function injectTabs(response, url) {
  if (!response || !response.ok || url.pathname.endsWith("/school.html")) {
    return response;
  }

  const contentType = response.headers.get("content-type") || "";
  const isHtml = contentType.includes("text/html") || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/");
  if (!isHtml) {
    return response;
  }

  const html = await response.text();
  if (html.includes("./tabs.js")) {
    return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
  }

  const injected = html.replace("</body>", "<script src=\"./tabs.js\"></script>\n  </body>");
  return new Response(injected, { status: response.status, statusText: response.statusText, headers: response.headers });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cached) => {
      let response = cached;

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          response = networkResponse;
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
      } catch (error) {
        // Offline: keep using the cached copy when available.
      }

      if (!response) {
        return Response.error();
      }

      return injectTabs(response, url);
    })
  );
});