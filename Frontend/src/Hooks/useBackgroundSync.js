"use client"

import { useEffect } from "react"

export const useBackgroundSync = (onSyncComplete) => {
  useEffect(() => {
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered for background sync")
          navigator.serviceWorker.controller?.postMessage({
            type: "REGISTER_SYNC",
          })
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "WEATHER_SYNC_COMPLETE") {
          console.log("Background sync completed")
          onSyncComplete?.(event.data.data)
        }
      })
    }

    const syncInterval = setInterval(
      () => {
        if (document.visibilityState === "visible") {
          onSyncComplete?.({})
        }
      },
      10 * 60 * 1000,
    )

    return () => clearInterval(syncInterval)
  }, [onSyncComplete])
}
