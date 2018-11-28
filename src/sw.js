const basePath = self.location.origin + self.location.pathname.replace(process.env.SERVICEWORKER, '');

function mapAsset(path) {
  const ret = basePath + path.substr(1);
  return ret;
}

const assets = global.serviceWorkerOption.assets
  .map(mapAsset);

const DEBUG = true;

/*if (DEBUG) {
  console.log('[SW] Basepath', basePath);
  console.log('[SW] Assets', assets);
}*/

self.addEventListener('install', e => {
  console.log('[SW] Worker installed');
  e.waitUntil(
    caches.open('resource-store')
      .then(cache => cache.addAll([ ...assets ]))
      .then(() => {
        if (DEBUG) {
          console.log('[SW] Assets cached: main', assets)
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
  if (DEBUG) {
    console.log('[SW] Fetch', e.request.url);
  }

  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});