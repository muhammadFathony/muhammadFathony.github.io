importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1'},
    { url: '/css/custom.css', revision: '1'},
    { url: '/css/materialize.min.css', revision: '1'},
    { url: '/images/epl.png', revision: '1'},
    { url: '/images/football.png', revision: '1'},
    { url: '/images/icon-192x192.png', revision: '1'},
    { url: '/images/icon-256x256.png', revision: '1'},
    { url: '/images/icon-512x512.png', revision: '1'},
    { url: '/js/api.js', revision: '1'},
    { url: '/js/config.js', revision: '1'},
    { url: '/js/db.js', revision: '1'},
    { url: '/js/idb.js', revision: '1'},
    { url: '/js/materialize.min.js', revision: '1'},
    { url: '/js/nav.js', revision: '1'},
    { url: '/page/favteam.html', revision: '1'},
    { url: '/page/home.html', revision: '1'},
    { url: '/page/schedule.html', revision: '1'},
    { url: '/index.html'},
    { url: '/manifest.json'},
    { url: '/nav.html'},
    { url: '/push.js'},
    { url: '/sarvice-worker.js'},
]);

workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30*24*60*60,
      }),
    ],
	})
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts->stylesheets",
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30*24*60*60,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://api.football-data.org/v2/.*'),
  workbox.strategies.cacheFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.cacheableResponse.Plugin({
           statuses: [0, 200]
        }),
      ],
  })
);
