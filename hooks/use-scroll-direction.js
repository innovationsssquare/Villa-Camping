"use client"

import { useState, useEffect } from "react"


export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null)
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Don't run on server
    if (typeof window === "undefined") return

    const threshold = 10
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }

      const newScrollDirection = scrollY > lastScrollY ? "down" : "up"
      setScrollDirection(newScrollDirection)
      setIsVisible(newScrollDirection === "up" || scrollY < 10)

      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return { scrollDirection, isVisible,setIsVisible }
}

