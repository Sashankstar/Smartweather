import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card.jsx";
import { Button } from "@/Components/ui/button"
import { Alert, AlertDescription } from "@/Components/ui/alert.jsx"
import { RefreshCw, TrendingUp } from "lucide-react"
import { useWeatherData } from "./Hooks/useWeatherData.js"
import { useBackgroundSync } from "./Hooks/useBackgroundSync.js"
import { NetworkStatus } from "./components/NetworkStatus.jsx"
import { WeatherCards } from "./components/weathercards.jsx"
import { WeatherChart } from "./components/WeatherChart.jsx"
import { WeatherTips } from "./components/WeatherTips.jsx"

export default function App() {
  const { weatherData, loading, error, lastUpdated, refetch } = useWeatherData()

  useBackgroundSync((data) => {
    if (data) {
      refetch()
    }
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={refetch} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-8">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",}}>
          <div style={{display:"flex", flexDirection:"column",}}>
            <h1 style={{fontSize:"2.25rem",fontWeight:"800",color:"#111827"}}>Weather Dashboard</h1>
            <p style={{marginTop:"0.25rem",color:"#4b5563"}}>Smart local weather & connectivity monitoring</p>
          </div>
          <div className="flex items-center gap-6">
            <NetworkStatus />
            <Button onClick={refetch} disabled={loading} size="sm" style={{display:"flex", alignItems:"center", gap:"0.5rem", backgroundColor:"#000", color:"#fff", padding:"0.5rem 1rem", borderRadius:"0.375rem",fontSize:"0.87rem",border:"none", cursor:"pointer",transition:"background-color 0.3s "}}>
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
        <Card className="rounded-lg shadow-md" >
        <div style={{display: "grid", gridTemplateColumns: "repeat(2, minmax(300px, 1fr))", gap: "1rem",backgroundColor:"#dbeafe", padding:"1.5rem", borderRadius:"0.75rem",boxShadow:"0 2px 6px rgba(0, 0, 0, 0.1)",marginTop:"1.5rem"}}>
          <WeatherCards weatherData={weatherData} loading={loading} style={{border:"1px solid red"}}/>
          <WeatherTips />
        </div>
          <CardHeader >
          </CardHeader>
          <CardContent>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <TrendingUp className="h-6 w-6" />
              Temperature Trend (24h)
            </CardTitle>
          </CardContent>
            <WeatherChart />
        </Card>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-6 bg-white p-3 rounded-md shadow-sm">
          <div style={{display:"flex", alignItems:"center", gap:"0.5rem", color:"green"}}>
            <NetworkStatus/>
          </div>
          {lastUpdated && <div style={{color:"red"}}>Last updated: {lastUpdated.toLocaleTimeString()}</div>}
        </div>
      </div>
    </div>
  )
}