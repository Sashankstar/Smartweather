import { useRef } from "react"
import { Droplets, Sun, Wind, Eye, Gauge, CloudRain } from "lucide-react"
import { useIntersectionObserver } from "../Hooks/useIntersectionObserver"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card.jsx"
const weatherTips = [
  {
    id: 1,
    title: "Stay Hydrated",
    description: "Drink plenty of water, especially during hot weather to maintain proper hydration levels.",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 2,
    title: "UV Protection",
    description: "Use sunscreen and wear protective clothing when UV index is high to prevent skin damage.",
    icon: <Sun className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: 3,
    title: "Wind Advisory",
    description: "Secure loose objects and be cautious when driving during high wind conditions.",
    icon: <Wind className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 4,
    title: "Visibility Check",
    description: "Use headlights and drive slowly when visibility is reduced due to fog or precipitation.",
    icon: <Eye className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 5,
    title: "Pressure Changes",
    description: "Sudden pressure drops may indicate incoming weather changes. Plan accordingly.",
    icon: <Gauge className="h-5 w-5 text-red-500" />,
  },
  {
    id: 6,
    title: "Rainy Day Tips",
    description: "Carry an umbrella and wear appropriate footwear during rainy conditions.",
    icon: <CloudRain className="h-5 w-5 text-blue-600" />,
  },
]

export const WeatherTips = () => {
  const tipsRef = useRef(null)
  const visibleTips = useIntersectionObserver()

  return (
    <Card className="p-6 bg-blue-100 rounded-lg">
      <CardHeader>
        <CardTitle style={{fontsize:"1.125rem",fontweight:"700",marginbootom:"1rem"}}>🌤️Weather Tips & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={tipsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherTips.map((tip) => (
            <div
              key={tip.id}
              data-tip-id={tip.id}
              className={`p-5 border border-gray-300 rounded-lg transition-all duration-500 bg-white ${
                visibleTips.has(tip.id) ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
              }`}
            >
              <div className="flex items-start gap-4">
                {tip.icon}
                <div>
                  <h3 className="font-semibold text-base">{tip.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}