class NetworkService {
  getCurrentNetworkInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
    }
  }

  onNetworkChange(callback) {
    const updateNetworkInfo = () => {
      callback(this.getCurrentNetworkInfo())
    }

    window.addEventListener("online", updateNetworkInfo)
    window.addEventListener("offline", updateNetworkInfo)

    const connection = navigator.connection
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo)
    }

    return () => {
      window.removeEventListener("online", updateNetworkInfo)
      window.removeEventListener("offline", updateNetworkInfo)
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo)
      }
    }
  }
}

export const networkService = new NetworkService()
