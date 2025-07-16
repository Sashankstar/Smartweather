"use client"

import { useRef, useEffect, useCallback } from "react"

export const WeatherChart = ({ className }) => {
  const canvasRef = useRef(null)

  const drawChart = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fetch weather history from the backend server
    const response = await fetch("http://localhost:3001/api/weather/history")
    const result = await response.json()

    if (!response.ok || !result.success || !result.data) {
      console.error("Failed to fetch weather history:", result.error || response.statusText)
      return
    }

    const history = result.data.map((entry) => ({
      temperature: entry.temperature,
      timestamp: new Date(entry.timestamp),
    }))

    if (history.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#6b7280"
      ctx.font = "16px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("No historical data available", canvas.width / 2, canvas.height / 2)
      return
    }

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    ctx.clearRect(0, 0, width, height)

    const padding = 50
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    if (chartWidth <= 0 || chartHeight <= 0) return

    const temps = history.map((entry) => entry.temperature)
    const maxTemp = Math.max(...temps) + 2
    const minTemp = Math.min(...temps) - 2
    const tempRange = maxTemp - minTemp

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.font = "12px Arial, sans-serif"
    ctx.fillStyle = "#6b7280"

    for (let i = 0; i <= 4; i++) {
      const temp = minTemp + (tempRange / 4) * i
      const y = padding + chartHeight - (chartHeight / 4) * i

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(`${Math.round(temp)}°`, padding - 10, y)
    }

    const numLabels = Math.min(history.length, 6)
    for (let i = 0; i < numLabels; i++) {
      const index = Math.floor(history.length / (numLabels - 1)) * i
      const entry = history[Math.min(index, history.length - 1)]
      const x = padding + (chartWidth / (numLabels - 1)) * i

      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()

      const now = new Date()
      const diffHours = Math.round((now.getTime() - entry.timestamp.getTime()) / (1000 * 60 * 60))
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(diffHours === 0 ? "Now" : `${diffHours}h ago`, x, height - padding + 5)
    }

    if (temps.length > 1) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.beginPath()

      history.forEach((entry, index) => {
        const x = padding + (chartWidth / (history.length - 1)) * index
        const y = padding + chartHeight - ((entry.temperature - minTemp) / tempRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      ctx.fillStyle = "#3b82f6"
      history.forEach((entry, index) => {
        const x = padding + (chartWidth / (history.length - 1)) * index
        const y = padding + chartHeight - ((entry.temperature - minTemp) / tempRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()

        if (index === history.length - 1) {
          ctx.fillStyle = "#1f2937"
          ctx.font = "bold 14px Arial, sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "bottom"
          ctx.fillText(`${entry.temperature}°C`, x, y - 10)
          ctx.fillStyle = "#3b82f6"
        }
      })
    }

    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 16px Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText("24-Hour Temperature Trend", padding, 10)
  }, [])

  useEffect(() => {
    drawChart()
    const handleResize = () => {
      drawChart()
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [drawChart])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-64 border rounded ${className || ""}`}
      style={{ width: "100%", height: "256px" }}
    />
  )
}