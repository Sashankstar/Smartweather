import { Wifi, WifiOff } from "lucide-react"
import { useNetworkInfo } from "../hooks/useNetworkInfo.js"

export const NetworkStatus = () => {
  const networkInfo = useNetworkInfo()

  const getNetworkIcon = () => {
    return networkInfo.online ? (
      <Wifi className="h-4 w-4 text-green-500" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="flex items-center gap-2">
      {getNetworkIcon()}
      <span className="text-sm text-gray-600">
        {networkInfo.effectiveType} • {networkInfo.downlink}Mbps
      </span>
    </div>
  )
}