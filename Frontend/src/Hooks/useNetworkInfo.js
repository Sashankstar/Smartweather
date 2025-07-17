import { useState, useEffect } from "react"
import { networkService } from "../services/networkService.js"

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState({
    online: true,
    effectiveType: "unknown",
    downlink: 0,
    rtt: 0,
  })

  useEffect(() => {
    setNetworkInfo(networkService.getCurrentNetworkInfo())
    const cleanup = networkService.onNetworkChange(setNetworkInfo)
    return cleanup
  }, [])

  return networkInfo
}
