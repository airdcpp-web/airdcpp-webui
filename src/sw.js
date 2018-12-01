const basePath = self.location.origin + self.location.pathname.replace(process.env.SERVICEWORKER, '');

function mapAsset(path) {
  return basePath + path.substr(1);
}

const assets = global.serviceWorkerOption.assets
  .map(mapAsset);

const DEBUG = true;

self.addEventListener('install', e => {
  console.log('[SW] Worker installed');

  e.waitUntil(
    caches.open('resource-store')
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
})

 
self.addEventListener('fetch', e => {
  let cacheUrl = e.request.url;
  if (e.request.url.startsWith(basePath) &&
    !e.request.url.replace(basePath, '').match(/^(view|assets|js|images)\//)
  ) {
    // Routing URL
    cacheUrl = basePath + 'index.html';
  } 

  e.respondWith(
    caches.match(new URL(cacheUrl)).then(function(response) {
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
    })
  );
});