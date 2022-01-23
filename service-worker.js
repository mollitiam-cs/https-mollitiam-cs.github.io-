const CACHE_NAME = "mollitiam";

self.addEventListener("install", e => {
	console.log("Installed?!?X")
	e.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll([
				"./",
			]);
		})
	);
});

self.addEventListener('fetch', (event) => {
	// we only care about http requests (ie not chrome extensions)
	if(/^http/.test(event.request.url) && event.request.url.indexOf('google-analytics') !== -1) {
		// ignore querystring params for any static resources
		const isStaticResource = (/\.(json|md|woff|js|css|less|html|png|woff2|txt)/.test(event.request.url));
		event.respondWith(
			caches.match(event.request, {ignoreSearch: isStaticResource}).then((resp) => {
				return resp || fetch(event.request).then((response) => {
					return caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	}
});