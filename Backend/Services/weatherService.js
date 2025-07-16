import fetch from "node-fetch"
import dotenv from "dotenv"
dotenv.config() // Load environment variables from .env file

class WeatherService {
  constructor() {
    this.weatherHistory = []
    this.OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY // Get from .env
  }

  async getCurrentWeather(coords) {
    if (!this.OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key is not configured in the backend server's .env file.")
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.OPENWEATHER_API_KEY}&units=metric`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Weather API error: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()

      const weatherData = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: data.visibility / 1000, // Convert meters to km
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        uvIndex: 0, // OpenWeatherMap current weather doesn't directly provide UV index
        timestamp: new Date(),
      }

      this.addToHistory(weatherData.temperature)
      return weatherData
    } catch (error) {
  console.error("Error fetching weather data:", error.message)
  console.error("Full error object:", error)  // NEW: full stack trace
  throw new Error(`Failed to fetch weather data: ${error.message}`)

    }
  }

  addToHistory(temperature) {
    this.weatherHistory.push({
      temperature,
      timestamp: new Date(),
    })

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    this.weatherHistory = this.weatherHistory.filter((entry) => entry.timestamp > twentyFourHoursAgo)
  }

  generateHistoricalData(baseTemp) {
    const history = []
    const now = new Date()

    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hour = timestamp.getHours()

      const dailyCycle = Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 8
      const randomNoise = (Math.random() - 0.5) * 3
      const temperature = Math.round(baseTemp + dailyCycle + randomNoise)

      history.push({
        temperature: Math.max(0, temperature),
        timestamp,
      })
    }
    return history
  }

  getWeatherHistory() {
    if (this.weatherHistory.length === 0) {
      const baseTemp = 15 + Math.random() * 15
      this.weatherHistory = this.generateHistoricalData(baseTemp)
    }
    return this.weatherHistory
  }
}

export const weatherService = new WeatherService()
