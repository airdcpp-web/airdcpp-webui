const basePath = self.location.origin + self.location.pathname.replace(process.env.SERVICEWORKER, '');

function mapAsset(path) {
  return basePath + path.substr(1);
}

const assets = global.serviceWorkerOption.assets
  .map(mapAsset);

const DEBUG = true;
const CACHE_NAME = 'resource-store';

self.addEventListener('install', e => {
  console.log('[SW] Worker installed');

  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([ ...assets ]))
      .then(() => {
        if (DEBUG) {
          console.log('[SW] Assets: ', assets);
        }
      })
      .catch(error => {
        console.error(error)
        throw error
      })

  );
});

const deleteUnusedAssets = (cache) => {
  return cache.keys()
    .then(keys => {
      return Promise.all(
        keys.map((request, index, array) => {
          if (assets.indexOf(request.url) !== -1) {
            if (DEBUG) {
              console.log(`[SW] Cached asset ${request.url} still exists, skip delete`);
            }

            return null;
          }

          return cache.delete(request)
            .then(deleted => {
              console.log(`[SW] Cached asset ${request.url} deleted`, deleted);
            });
        })
      );
    });
};

self.addEventListener('activate', event => {
  if (DEBUG) {
    console.log('[SW] Activate event')
  }

  // Clean the caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.open(cacheName)
            .then(cache => deleteUnusedAssets(cache));
        })
      )
    })
  )
});

function respondCache(e, cacheUrl) {
  return caches.match(new URL(cacheUrl)).then(function(response) {
    if (!!response) {
      if (DEBUG) {
        console.log('[SW] Return cached', e.request.url);
      }

      return response;
    }

    if (DEBUG) {
      console.log('[SW] Fetch', e.request.url);
    }

    return fetch(e.request);
  });
}

 
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate' || (
      e.request.url.startsWith(basePath) &&
      e.request.url.indexOf('.', basePath.length) === -1 && // no file extension?
      !e.request.url.replace(basePath, '').match(/^(view)\//)
    )
  ) {
    console.log('[SW] Navigate action, fetch index', e.request.url);
    const cacheUrl = basePath + 'index.html';

    // Try to fetch index from the server, fall back to using a cached version if it fails
    return e.respondWith(
      new Promise((resolve, reject) => {
        fetch(cacheUrl).then(res => {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(new Request(cacheUrl), res.clone()).then(() => {
                console.log('[SW] Index file cached', e.request.url);
                resolve(res);
              });
            });
          })
          .catch(err => {
            console.log('[SW] Navigate action, failed to fetch index', e.request.url, err);
            resolve(respondCache(e, cacheUrl));
          });
      })
    );
  }

  return e.respondWith(respondCache(e, e.request.url));
});