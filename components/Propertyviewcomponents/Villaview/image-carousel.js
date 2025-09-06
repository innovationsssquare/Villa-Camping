"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div className="group relative">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index] || "/placeholder.svg"}
          alt={images[index]?.alt || "Property image"}
          className="h-full w-full object-cover"
        />

        {/* Controls */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Previous image"
            onClick={prev}
            className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Next image"
            onClick={next}
            className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/70 p-1 rounded-full">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("h-2 w-2 rounded-full", i === index ? "bg-primary" : "bg-muted-foreground/40")}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-2 grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Select ${img.alt || "image"} ${i + 1}`}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-md border",
              i === index ? "ring-2 ring-primary" : "border-border",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img || "/placeholder.svg"} alt={img.alt || ""} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
