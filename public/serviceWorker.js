// 'use strict'
//
//
// //Cache polyfil to support cacheAPI in all browsers
// // importScripts('./cache-polyfill.js');
//
// var cacheName = 'initial-cache-v1'
//
// //Files to save in cache
// var files = [
//   './',
//   './index.html',
//   './index.html?utm=homescreen', //SW treats query string as new page
//   './css/styles.css',
//   'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700', //caching 3rd party content
//   './images/icons/android-chrome-192x192.png',
//   './images/icons/favicon-16x16.png',
//   './images/icons/favicon-32x32.png',
//   // './js/app2.js',
//   // './js/push.js',
//   // './js/sync.js',
//   // './js/snackbar.js',
//   './manifest.json'
// ]
//
// //Adding `install` event listener
// self.addEventListener('install', function (event) {
//   console.info('Event: Install')
//
//   event.waitUntil(
//     caches.open(cacheName)
//     .then(function (cache) {
//       //[] of files to cache & if any of the file not present `addAll` will fail
//       return cache.addAll(files)
//       .then(function () {
//         console.info('All files are cached')
//         return self.skipWaiting() //To forces the waiting service worker to become the active service worker
//       })
//       .catch(function (error) {
//         console.error('Failed to cache', error)
//       })
//     })
//   )
// })
//
// /*
//   FETCH EVENT: triggered for every request made by index page, after install.
// */
//
//Adding `fetch` event listener7

var CACHE_VERSION = 1;

// Shorthand identifier mapped to specific versioned cache.
var CURRENT_CACHES = {
  font: 'font-cache-v' + CACHE_VERSION
};

self.addEventListener('activate', function(event) {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  // Active worker won't be treated as activated until promise resolves successfully.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            console.log('Deleting out of date cache:', cacheName);

            return caches.delete(cacheName);
          }
        })
      );
    })
  );
})
var cacheName = 'initial-cache-v1'
self.addEventListener('install', function (event) {
  debugger
  console.info('Event: Install')

  // event.waitUntil(
  //   caches.open(cacheName)
  //   .then(function (cache) {
  //     //[] of files to cache & if any of the file not present `addAll` will fail
  //     return;
  //     // return cache.addAll(files)
  //     // .then(function () {
  //     //   console.info('All files are cached')
  //     //   return self.skipWaiting() //To forces the waiting service worker to become the active service worker
  //     // })
  //     // .catch(function (error) {
  //     //   console.error('Failed to cache', error)
  //     // })
  //   })
  // )
})
self.addEventListener('fetch', function (event) {
  var request = event.request
  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then(function(response) {
      if (response) {
        console.info('Event: Fetch CACHED')
        return response
      }
      console.info('Event: Fetch no CACHED')
      //if request is not cached, add it to cache
      return fetch(request).then(function(response) {
        var responseToCache = response.clone()
        caches.open(cacheName).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message)
            })
          })

          return response
        })
      })
    )
  })

// /*
//   ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
// */
//
// //Adding `activate` event listener
// self.addEventListener('activate', function (event) {
//   console.info('Event: Activate')
//
//   //Active Service Worker to set itself as the active on current client and all other active clients.
//   return self.clients.claim()
// })
//
// /*
//   PUSH EVENT: triggered everytime, when a push notification is received.
// */
//
// //Adding `push` event listener
// self.addEventListener('push', function(event) {
//   console.info('Event: Push')
//
//   var title = 'Push notification demo'
//   var body = {
//     'body': 'click to return to application',
//     'tag': 'demo',
//     'icon': './images/icons/apple-touch-icon.png',
//     //Custom actions buttons
//     'actions': [
//       { 'action': 'yes', 'title': 'I ♥ this app!'},
//       { 'action': 'no', 'title': 'I don\'t like this app'}
//     ]
//   }
//
//   event.waitUntil(self.registration.showNotification(title, body))
// })
//
// /*
//   BACKGROUND SYNC EVENT: triggers after `bg sync` registration and page has network connection.
//   It will try and fetch github username, if its fulfills then sync is complete. If it fails,
//   another sync is scheduled to retry (will will also waits for network connection)
// */
//
// self.addEventListener('sync', function(event) {
//   console.info('Event: Sync')
//
//   //Check registered sync name or emulated sync from devTools
//   if (event.tag === 'github' || event.tag === 'test-tag-from-devtools') {
//     event.waitUntil(
//       //To check all opened tabs and send postMessage to those tabs
//       self.clients.matchAll().then(function (all) {
//         return all.map(function (client) {
//           return client.postMessage('online') //To make fetch request, check app.js - line no: 122
//         })
//       })
//       .catch(function (err) {
//         console.error(err)
//       })
//     )
//   }
// })
//
// /*
//   NOTIFICATION EVENT: triggered when user click the notification.
// */
//
// //Adding `notification` click event listener
// self.addEventListener('notificationclick', function(event) {
//   var appURL = new URL('/', location).href
//
//   //Listen to custom action buttons in push notification
//   if (event.action === 'yes') {
//     console.log('I ♥ this app!')
//   }
//   else if (event.action === 'no') {
//     console.warn('I don\'t like this app')
//   }
//
//   event.notification.close() //Close the notification
//
//   //To open the app after clicking notification
//   event.waitUntil(
//     clients.matchAll()
//     .then(function(clients) {
//       for (var i = 0; i < clients.length; i++) {
//         var client = clients[i]
//         //If site is opened, focus to the site
//         if (client.url === appURL) {
//           return client.focus()
//         }
//       }
//
//       //If site is cannot be opened, open in new window
//       return clients.openWindow('/')
//     })
//     .catch(function (err) {
//       console.error(err)
//     })
//   )
// })
