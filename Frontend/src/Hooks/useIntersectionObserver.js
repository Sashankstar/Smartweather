import { useState, useEffect } from "react"

export const useIntersectionObserver = () => {
  const [visibleTips, setVisibleTips] = useState(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tipId = Number.parseInt(entry.target.getAttribute("data-tip-id") || "0")
            setVisibleTips((prev) => new Set([...prev, tipId]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const tipElements = document.querySelectorAll("[data-tip-id]")
    tipElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return visibleTips
}
