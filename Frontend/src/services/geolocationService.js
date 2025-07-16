class GeolocationService {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          let errorMessage = "Unknown geolocation error"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }
}

export const geolocationService = new GeolocationService()
