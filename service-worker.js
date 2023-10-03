import { skipWaiting, clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { NetworkOnly, NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing'
import { matchPrecache, precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { Logger } from '@lib/clientLogger.js'

skipWaiting();
clientsClaim();

// must include following lines when using inject manifest module from workbox
// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build#add_an_injection_point
const WB_MANIFEST = self.__WB_MANIFEST;
// Precache fallback route and image
WB_MANIFEST.push({
    url: '/fallback',
    revision: '1234567893',
});
precacheAndRoute(WB_MANIFEST);
// Logger.log('SW: precacheAndRoute')

cleanupOutdatedCaches();

self.addEventListener("sync", (event) => {
    Logger.log(`SW:sync:${event.target}:${event.type}:${event.tag}`)
});

self.addEventListener("periodicsync", (event) => {
    Logger.log(`SW:periodicsync:${event.target}:${event.type}:${event.tag}`)
});

self.addEventListener('fetch', event => {
    if (!event.request.url.endsWith('logs')) {
        Logger.log(`SW:fetch:${event.target}:${event.type}:${event.request.url}`)
    }
    // Add in your own criteria here to return early if this
    // isn't a request that should use background sync.
    // if (event.request.method !== 'POST') {
    //   return;
    // }

    // const bgSyncLogic = async () => {
    //   try {
    //     const response = await fetch(event.request.clone());
    //     return response;
    //   } catch (error) {
    //     await queue.pushRequest({request: event.request});
    //     return error;
    //   }
    // };

    // event.respondWith(bgSyncLogic());
});

const bgSyncPlugin = new BackgroundSyncPlugin('movieUpdates', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});


registerRoute(
    '/',
    new NetworkFirst({
        cacheName: 'start-url',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 4,
                maxAgeSeconds: 31536e3,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    new StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 4,
                maxAgeSeconds: 604800,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
// disable image cache, so we could observe the placeholder image when offline
registerRoute(
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    new NetworkOnly({
        cacheName: 'static-image-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 64,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /\.(?:js)$/i,
    new StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 32,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /\.(?:css|less)$/i,
    new StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 32,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /\.(?:json|xml|csv)$/i,
    new NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 32,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /\/api\/.*$/i,
    new StaleWhileRevalidate({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 500,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
    'GET'
);
registerRoute(
    /.*/i,
    new NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 32,
                maxAgeSeconds: 86400,
                purgeOnQuotaError: !0,
            }),
        ],
    }),
    'GET'
);

// following lines gives you control of the offline fallback strategies
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks

// Use a stale-while-revalidate strategy for all other requests.
setDefaultHandler(new StaleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(({ event }) => {
    // The FALLBACK_URL entries must be added to the cache ahead of time, either
    // via runtime or precaching. If they are precached, then call
    // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
    // to get the response from the correct cache.
    //
    // Use event, request, and url to figure out how to respond.
    // One approach would be to use request.destination, see
    // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
    switch (event.request.destination) {
        case 'document':
            Logger.log(`SW: document - ${JSON.stringify(event)}`)
            // If using precached URLs:
            return matchPrecache('/fallback');
            // return caches.match('/fallback')
            break;
        case 'image':
            Logger.log(`SW: image- ${JSON.stringify(event)}`)
            // If using precached URLs:
            return matchPrecache('/static/images/fallback.png');
            // return caches.match('/static/images/fallback.png')
            break;
        case 'font':
            Logger.log(`SW: font - ${JSON.stringify(event)}`)
            // If using precached URLs:
            // return matchPrecache(FALLBACK_FONT_URL);
            // return caches.match('/static/fonts/fallback.otf')
            break
        default:
            Logger.log(`SW: default - ${JSON.stringify(event)}`)
            // If we don't have a fallback, just return an error response.
            return Response.error();
    }
});

// const status = await self.navigator.permissions.query({
//     name: 'periodic-background-sync',
// });
// Logger.log(`SW:periodicsync:${status.status}`)
//   if (status.state === 'granted') {
//     // Periodic background sync can be used.
//   } else {
//     // Periodic background sync cannot be used.
//   }

// Logger.log(`SW:worker:${navigator}`)
// Logger.log(`SW:worker:${self.navigator}`)

// const registration = await navigator.serviceWorker.ready;
// const registration = self.registration.periodicSync;
// Logger.log(`SW:registration:${registration}`)

// if ('periodicSync' in registration) {
//     try {
//         Logger.log(`SW:periodicsync:setting interval`)
//         await registration.register('content-sync', {
//             minInterval: 2 * 1000, // 24 * 60 * 60 * 1000
//         });
//         Logger.log(`SW:periodicsync:interval set`)
//     } catch (error) {
//         Logger.log(`SW:periodicsync:cannot use sync`)
//     }
// }

// Logger.log(`SW:periodicSync-registration:${self.registration.periodicSync}`)