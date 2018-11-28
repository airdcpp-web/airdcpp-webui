const basePath = self.location.origin + self.location.pathname.replace(process.env.SERVICEWORKER, '');
//console.log('BASEPATH', basePath);

function mapAsset(path) {
  const ret = basePath + path.substr(1);
  //console.log('ASSET', ret);
  return ret;
}

const assets = global.serviceWorkerOption.assets
  .map(mapAsset);

self.addEventListener('install', e => {
  console.log('Service Worker installed');
  e.waitUntil(
    caches.open('resource-store').then(function(cache) {
      return cache.addAll([
        ...assets,
      ]);
    })
  );
});
 
self.addEventListener('fetch', e => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});