const VERSION_NUMBER = "-1.0.0";
const cacheIds = {
	CORE: "core" + VERSION_NUMBER
}

///////////////////////////////////////////////////////////
//
// Set up
//
///////////////////////////////////////////////////////////


self.addEventListener("install", e => {
	// Activate right away
	self.skipWaiting();

	e.waitUntil(
		caches.open(cacheIds.CORE).then(cache => {
			return cache.addAll([
				"./",
			]);
		})
	);
});


self.addEventListener('activate', function (e) {
	// On version update, remove old cached files
	e.waitUntil(caches.keys().then(function (keys) {
		return Promise.all(keys.filter(function (key) {
			const cacheIDs = Object.entries(cacheIds);
			return !cacheIDs.includes(key) && key.indexOf(VERSION_NUMBER) === -1;
		}).map(function (key) {
			return caches.delete(key);
		}));
	}).then(function () {
		return self.clients.claim();
	}));
});

self.addEventListener('fetch', (event) => {
	// we only care about http requests (ie not chrome extensions)
	if(/^http/.test(event.request.url) && event.request.url.indexOf('google-analytics') == -1) {
		// ignore querystring params for any static resources
		const isStaticResource = (/\.(json|md|woff|js|css|less|html|png|woff2|txt)/.test(event.request.url));
		event.respondWith(
			caches.match(event.request, {ignoreSearch: isStaticResource}).then((resp) => {
				return resp || fetch(event.request).then((response) => {
					return caches.open(cacheIds.CORE).then((cache) => {
						cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	}
});