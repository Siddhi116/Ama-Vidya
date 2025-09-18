// Service Worker for Offline Functionality

const CACHE_NAME = 'edustem-v1.0.0';
const STATIC_CACHE = 'edustem-static-v1.0.0';
const DYNAMIC_CACHE = 'edustem-dynamic-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
    '/',
    '/index.html',
    '/student.html',
    '/teacher.html',
    '/css/main.css',
    '/css/student.css',
    '/css/teacher.css',
    '/js/main.js',
    '/js/multilang.js',
    '/js/progress.js',
    '/js/games.js',
    '/js/student.js',
    '/js/teacher.js',
    '/assets/lang/en.json',
    '/assets/lang/od.json',
    '/assets/images/student-avatar.svg',
    '/assets/images/teacher-avatar.svg',
    '/manifest.json'
];

// Dynamic content patterns (for videos, games, etc.)
const DYNAMIC_PATTERNS = [
    /\/assets\/videos\//,
    /\/assets\/games\//,
    /\/assets\/images\//,
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /\.(?:mp4|webm|ogg)$/
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (unless it's for assets)
    if (url.origin !== location.origin && !isDynamicAsset(url.pathname)) {
        return;
    }
    
    event.respondWith(
        handleFetchRequest(request)
    );
});

async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    try {
        // For HTML pages, use cache-first strategy
        if (isHTMLPage(url.pathname)) {
            return await cacheFirstStrategy(request, STATIC_CACHE);
        }
        
        // For static assets, use cache-first strategy
        if (isStaticAsset(url.pathname)) {
            return await cacheFirstStrategy(request, STATIC_CACHE);
        }
        
        // For dynamic content, use network-first strategy
        if (isDynamicAsset(url.pathname)) {
            return await networkFirstStrategy(request, DYNAMIC_CACHE);
        }
        
        // Default to network-first for other requests
        return await networkFirstStrategy(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('Service Worker: Fetch error', error);
        
        // Return offline fallback for HTML pages
        if (isHTMLPage(url.pathname)) {
            return await getOfflineFallback();
        }
        
        throw error;
    }
}

async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('Service Worker: Serving from cache', request.url);
        // Update cache in background if online
        if (navigator.onLine) {
            updateCacheInBackground(request, cacheName);
        }
        return cachedResponse;
    }
    
    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

async function updateCacheInBackground(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            console.log('Service Worker: Cache updated in background', request.url);
        }
    } catch (error) {
        // Silently fail background updates
        console.log('Service Worker: Background update failed', request.url);
    }
}

async function getOfflineFallback() {
    const cache = await caches.open(STATIC_CACHE);
    return cache.match('/index.html') || new Response(
        `<!DOCTYPE html>
        <html>
        <head>
            <title>EduSTEM - Offline</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    margin: 0; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                }
                .offline-message {
                    background: rgba(255,255,255,0.1);
                    padding: 2rem;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
            </style>
        </head>
        <body>
            <div class="offline-message">
                <h1>🚀 EduSTEM</h1>
                <h2>You're Offline</h2>
                <p>You're currently offline, but you can still access cached content.</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        </body>
        </html>`,
        {
            headers: { 'Content-Type': 'text/html' }
        }
    );
}

// Helper functions
function isHTMLPage(pathname) {
    return pathname.endsWith('.html') || 
           pathname === '/' || 
           pathname.endsWith('/');
}

function isStaticAsset(pathname) {
    return pathname.startsWith('/css/') ||
           pathname.startsWith('/js/') ||
           pathname.startsWith('/assets/lang/') ||
           pathname.endsWith('.json');
}

function isDynamicAsset(pathname) {
    return DYNAMIC_PATTERNS.some(pattern => pattern.test(pathname));
}

// Background sync for progress data
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgressData());
    }
});

async function syncProgressData() {
    try {
        // Get stored progress data
        const progressData = await getStoredProgressData();
        
        if (progressData && navigator.onLine) {
            // Sync with server when online
            await fetch('/api/sync-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(progressData)
            });
            
            console.log('Service Worker: Progress data synced');
        }
    } catch (error) {
        console.error('Service Worker: Progress sync failed', error);
    }
}

async function getStoredProgressData() {
    // This would integrate with the progress manager's local storage data
    const progressKey = 'studentProgress';
    const storedData = localStorage.getItem(progressKey);
    return storedData ? JSON.parse(storedData) : null;
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/assets/images/explore-icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/close-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('EduSTEM', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/student.html')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CACHE_CONTENT') {
        event.waitUntil(cacheContent(event.data.urls));
    }
});

async function cacheContent(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
                console.log('Service Worker: Cached content', url);
            }
        } catch (error) {
            console.error('Service Worker: Failed to cache', url, error);
        }
    }
}

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker: Global error', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
    event.preventDefault();
});

console.log('Service Worker: Script loaded');