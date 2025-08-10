import React from "react"
import { cn } from "@/lib/utils"


export function SearchInputCard({ icon, label, value, badge, className, ...props }) {
  return (
    <div
      className={cn("flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-white cursor-pointer", className)}
      {...props}
    >
      <div className="text-gray-500">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium text-gray-800">{value}</div>
      </div>
      {badge && <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{badge}</span>}
    </div>
  )
}
