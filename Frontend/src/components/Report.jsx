import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction
} from "@/components/ui/card.jsx"

import { Skeleton } from "@/components/ui/skeleton.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  Cloud,
  CloudRain
} from "lucide-react"
const getWeatherIcon = (description) => {
  switch (description?.toLowerCase()) {
    case "clear sky":
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />
    case "few clouds":
    case "scattered clouds":
    case "broken clouds":
    case "overcast clouds":
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />
    case "shower rain":
    case "rain":
    case "light rain":
    case "moderate rain":
      return <CloudRain className="h-8 w-8 text-blue-500" />
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />
  }
}
 export const Weathercard = ({ weatherData, loading }) => {
  return (
    <>
    <div style={{display: "grid", gridtemplatecolumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem",backgroundColor:"#dbeafe"}}>
    <div style={{minheight: "100vh",padding:"1.5rem",background:"linear-gradient(to bottom right, #eff6ff, #e0e7ff);"}}>
      <div style={{maxwidth: "100px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"2rem"}}> 
        <Card style={{padding:"1.5rem",backgroundColor:"#f0f9ff",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px",}}>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <MapPin className="h-5 w-5 text-gray-400" style={{marginLeft:"290px"}} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-3xl font-extrabold">{weatherData?.location}</div>
            )}
          </CardContent>
        </Card>

        <Card style={{padding:"1.5rem",backgroundColor:"white",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px"}}>
          <CardHeader >
            <CardTitle className="text-sm font-semibold">Temperature</CardTitle>
            <Thermometer className="h-5 w-5 text-gray-400"  style={{marginLeft:"290px"}}/>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold">{weatherData?.temperature}°C</div>
                {weatherData && getWeatherIcon(weatherData.description)}
              </div>
            )}
            {weatherData && <p className="text-xs text-gray-500 mt-1">Feels like {weatherData.feelsLike}°C</p>}
          </CardContent>
        </Card>

        <Card style={{padding:"1.5rem",backgroundColor:"#f0f9ff",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px"}}>
          <CardHeader >
            <CardTitle className="text-sm font-semibold">Humidity</CardTitle>
            <Droplets className="h-5 w-5 text-gray-400" style={{marginLeft:"290px"}}/>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-3xl font-extrabold">{weatherData?.humidity}%</div>
            )}
          </CardContent>
        </Card>
        <Card style={{padding:"1.5rem",backgroundColor:"white",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px"}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Wind Speed</CardTitle>
            <Wind className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-3xl font-extrabold">{weatherData?.windSpeed} km/h</div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"1rem",  backgroundcolor:" #dbeafe",borderRadius:"0.75rem"}}>
        <div style={{backgroundColor:"#f0f9ff",padding:" 1rem 1.25rem",borderRadius:"0.5rem",display:"flex",justifyContent:"space-between",gap:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)"}}>
        <Card style={{padding:"1.5rem",backgroundColor:"#f0f9ff",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px"}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Visibility</CardTitle>
            <Eye className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-3xl font-extrabold">{weatherData?.visibility} km</div>
            )}
          </CardContent>
        </Card>

        <Card style={{padding:"1.5rem",backgroundColor:"white",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px"}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Pressure</CardTitle>
            <Gauge className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-3xl font-extrabold">{weatherData?.pressure} hPa</div>
            )}
          </CardContent>
        </Card>

        <Card style={{padding:"1.5rem",backgroundColor:"#f0f9ff",borderRadius:"0.5rem", boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",width:"300px"}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">UV Index</CardTitle>
            <Sun className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold">{weatherData?.uvIndex}</div>
                <Badge
                  variant={
                    weatherData && weatherData.uvIndex > 7
                    ? "destructive"
                    : weatherData && weatherData.uvIndex > 3
                    ? "default"
                    : "secondary"
                  }
                  >
                  {weatherData && weatherData.uvIndex > 7
                    ? "High"
                    : weatherData && weatherData.uvIndex > 3
                    ? "Moderate"
                    : "Low"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
            </div>
      </div>
            </div>
    </>
  )
}