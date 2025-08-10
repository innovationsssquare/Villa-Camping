import  React from "react"
import { cn } from "@/lib/utils"


export function HolidayCard({ type, dateRange, name, colorClass, className, ...props }) {
  return (
    <div className={cn("flex-shrink-0 w-[150px] p-3 rounded-lg shadow-sm text-sm", colorClass, className)} {...props}>
      <div className="font-semibold">{type}</div>
      <div className="mt-1 text-xs">{dateRange}</div>
      <div className="text-xs text-muted-foreground">{name}</div>
    </div>
  )
}
