"use client"

import React, { useRef, useEffect, useCallback } from "react"

export function WeatherChart({ className }) {
  const canvasRef = useRef(null)

  const drawChart = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const url = "https://smartweather.onrender.com/api/weather/history"
    let response = await fetch(url).catch(err => {
      console.error("Network error:", err)
      return null
    })
    if (!response) return

    const text = await response.text().catch(err => {
      console.error("Failed to read text:", err)
      return ""
    })

    if (!response.ok) {
      console.error("HTTP error:", response.status, text)
      return
    }

    let result
    try {
      result = JSON.parse(text)
    } catch {
      console.error("Invalid JSON:", text)
      return
    }

    if (!result.success || !Array.isArray(result.data)) {
      console.error("Unexpected data:", result)
      return
    }

    const history = result.data
      .map(entry => ({
        temperature: entry.temperature,
        timestamp: new Date(entry.timestamp),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    if (history.length < 2) {
      console.warn("Not enough data to plot")
      return
    }

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 50
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    const temps = history.map(h => h.temperature)
    const maxTemp = Math.max(...temps) + 2
    const minTemp = Math.min(...temps) - 2
    const tempRange = maxTemp - minTemp

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.font = "12px Arial, sans-serif"
    ctx.fillStyle = "#6b7280"
    for (let i = 0; i <= 4; i++) {
      const y = padding + chartHeight - (chartHeight / 4) * i
      const temp = minTemp + (tempRange / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(`${Math.round(temp)}°`, padding - 10, y)
    }

    const startTs = history[0].timestamp.getTime()
    const endTs = history[history.length - 1].timestamp.getTime()
    const timeSpan = endTs - startTs
    const now = new Date()

    const numLabels = Math.min(history.length, 6)
    for (let i = 0; i < numLabels; i++) {
      const idx = Math.floor((history.length - 1) * (i / (numLabels - 1)))
      const entry = history[idx]
      const x = padding + ((entry.timestamp.getTime() - startTs) / timeSpan) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
      const diffH = Math.round((now - entry.timestamp) / (1000 * 60 * 60))
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(diffH === 0 ? "Now" : `${diffH}h ago`, x, height - padding + 5)
    }

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()
    history.forEach((entry, i) => {
      const x = padding + ((entry.timestamp.getTime() - startTs) / timeSpan) * chartWidth
      const y = padding + chartHeight - ((entry.temperature - minTemp) / tempRange) * chartHeight
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    ctx.fillStyle = "#3b82f6"
    history.forEach((entry, i) => {
      const x = padding + ((entry.timestamp.getTime() - startTs) / timeSpan) * chartWidth
      const y = padding + chartHeight - ((entry.temperature - minTemp) / tempRange) * chartHeight
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
      if (i === history.length - 1) {
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 14px Arial, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"
        ctx.fillText(`${entry.temperature}°C`, x, y - 10)
        ctx.fillStyle = "#3b82f6"
      }
    })

    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 16px Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText("24‑Hour Temperature Trend", padding, 10)
  }, [])

  useEffect(() => {
    drawChart()
    window.addEventListener("resize", drawChart)
    return () => window.removeEventListener("resize", drawChart)
  }, [drawChart])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-64 border rounded ${className || ""}`}
      style={{ width: "100%", height: "256px" }}
    />
  )
}
