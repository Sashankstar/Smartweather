import { useState, useEffect, useCallback } from "react"
import { geolocationService } from "../services/geolocationService.js"

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchWeatherData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const coords = await geolocationService.getCurrentLocation()
      const url = `https://smartweather.onrender.com/api/weather/current?lat=${coords.latitude}&lon=${coords.longitude}`

      const response = await fetch(url)
      const text = await response.text()  // read raw response

      if (!response.ok) {
        console.error("Fetch error:", text)
        throw new Error(`HTTP ${response.status}`)
      }

      let result
      try {
        result = JSON.parse(text)  // safe parse
      } catch (parseErr) {
        console.error("Invalid JSON:", text)
        throw new Error("Invalid JSON response")
      }

      if (result.success && result.data) {
        setWeatherData(result.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || "API returned invalid data")
      }

    } catch (err) {
      console.error("FetchWeatherData error:", err)
      setError(err.message)
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
