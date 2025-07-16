// Service Worker for Background Sync
const CACHE_NAME = "weather-dashboard-v1"
const WEATHER_SYNC_TAG = "weather-sync"

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(self.clients.claim())
})

// Background Sync event
self.addEventListener("sync", (event) => {
  if (event.tag === WEATHER_SYNC_TAG) {
    console.log("Background sync triggered for weather data")
    event.waitUntil(syncWeatherData())
  }
})

// Sync weather data function (this will now call the backend server)
async function syncWeatherData() {
  try {
    console.log("Syncing weather data in background...")

    // In a real scenario, you'd need to get the user's location here
    // or have the backend handle location based on IP.
    // For simplicity, this service worker just notifies the main thread.
    // The main thread (frontend) will then trigger a fetch.

    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({
        type: "WEATHER_SYNC_COMPLETE",
        timestamp: Date.now(),
      })
    })
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "REGISTER_SYNC") {
    self.registration.sync
      .register(WEATHER_SYNC_TAG)
      .then(() => {
        console.log("Background sync registered")
      })
      .catch((error) => {
        console.error("Background sync registration failed:", error)
      })
  }
})
