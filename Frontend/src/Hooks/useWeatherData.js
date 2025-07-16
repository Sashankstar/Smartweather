import { useState, useEffect, useCallback } from "react"
import { geolocationService } from "../services/geolocationService.js"
export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const coords = await geolocationService.getCurrentLocation()

      // Call the backend server API
      const response = await fetch(
        `http://localhost:3001/api/weather/current?lat=${coords.latitude}&lon=${coords.longitude}`,
        console.error("Backend API Error (current weather):", error)
      )
      const result = await response.json()

      if (response.ok && result.success && result.data) {
        setWeatherData(result.data)
        setLastUpdated(new Date())
      } else {
        setError(result.error || "Failed to fetch weather data from API")
      }
    } catch (err) {
      setError(err.message || "Unknown error occurred during API call")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeatherData()
  }, [fetchWeatherData])

  return {
    weatherData,
    loading,
    error,
    lastUpdated,
    refetch: fetchWeatherData,
  }
}
