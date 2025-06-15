"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function ButtonLoader({
  size = "md",
  color = "#0e7490", 
  outlineColor = "#f9d0d0", 
  dotColor = "#f9d0d0",
  className,
  isLoading = true,
  speed = 2,
}) {
  const [rotation, setRotation] = useState(0)

  // Size mapping
  const sizeMap = {
    sm: {
      button: "w-16 h-16",
      hole: "w-2 h-2",
      outline: "w-20 h-20",
      dot: "w-2.5 h-2.5",
    },
    md: {
      button: "w-24 h-24",
      hole: "w-3 h-3",
      outline: "w-32 h-32",
      dot: "w-3.5 h-3.5",
    },
    lg: {
      button: "w-32 h-32",
      hole: "w-4 h-4",
      outline: "w-40 h-40",
      dot: "w-4.5 h-4.5",
    },
  }

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 10 / speed)

    return () => clearInterval(interval)
  }, [isLoading, speed])

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer circle with rotating dot */}
      <div
        className={cn("absolute rounded-full border-2", sizeMap[size].outline)}
        style={{ borderColor: outlineColor }}
      >
        {/* Rotating dot */}
        {isLoading && (
          <div
            className={cn("absolute rounded-full", sizeMap[size].dot)}
            style={{
              backgroundColor: dotColor,
              top: "-5px",
              left: "50%",
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transformOrigin: "center calc(50% + ${sizeMap[size].outline.split(' ')[0].replace('w-', '')}px / 2)",
            }}
          />
        )}
      </div>

      {/* Button */}
      <div
        className={cn("rounded-full flex items-center justify-center relative z-10", sizeMap[size].button)}
        style={{
          backgroundColor: color,
          boxShadow: "inset 0 -4px 6px rgba(0, 0, 0, 0.1), inset 0 4px 6px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Button holes - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn("rounded-full bg-white", sizeMap[size].hole)}
              style={{
                boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

