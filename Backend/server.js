import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import { weatherService } from "./Services/weatherService.js"

const app = express()
const PORT = process.env.PORT || 3001

// Enable CORS for frontend communication
app.use(cors())
app.use(express.json()) // For parsing application/json

// API endpoint to get current weather
app.get("/api/weather/current", async (req, res) => {
  try {
    const { lat, lon } = req.query
    if (!lat || !lon) {
      return res.status(400).json({ success: false, error: "Latitude and longitude are required." })
    }
    const weatherData = await weatherService.getCurrentWeather({
      latitude: Number.parseFloat(lat),
      longitude: Number.parseFloat(lon),
    })
    res.json({ success: true, data: weatherData })
  } catch (error) {
    console.error("Backend API Error (current weather):", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// API endpoint to get weather history
app.get("/api/weather/history", async (req, res) => {
  try {
    const history = weatherService.getWeatherHistory()
    res.json({ success: true, data: history })
  } catch (error) {
    console.error("Backend API Error (weather history):", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
