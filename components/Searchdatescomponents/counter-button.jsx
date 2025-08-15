"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

export function CounterButton({ value, onDecrement, onIncrement, min = 0, max }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-8 h-8 border-gray-300 bg-transparent hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
        onClick={onDecrement}
        disabled={typeof value === "number" && value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center font-semibold text-lg">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-8 h-8 border-gray-300 bg-transparent hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
        onClick={onIncrement}
        disabled={typeof value === "number" && max !== undefined && value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
