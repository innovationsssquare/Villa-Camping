"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyCard } from "./property-card"




export function PropertyDrawer({
  properties,
  isOpen,
  onToggle,
  selectedProperty,
  onPropertySelect,
}) {
  const [viewMode, setViewMode] = useState("list")
  const [sortBy, setSortBy] = useState("price")
  const [isExpanded, setIsExpanded] = useState(false)

  // Sort properties based on selected criteria
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return a.id.localeCompare(b.id)
      default:
        return 0
    }
  })

  // Calculate drawer height based on state
  const getDrawerHeight = () => {
    if (!isOpen) return "h-0"
    if (isExpanded) return "h-[70vh]"
    return "h-[40vh]" // Half-open by default
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl transition-all duration-300 ease-out z-40
        ${getDrawerHeight()}
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
    >
      {/* Drawer Handle */}
      <div className="flex items-center justify-center py-2 border-b border-border bg-muted/30">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-1 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50 transition-colors"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">
            {properties.length} Villa{properties.length !== 1 ? "s" : ""} Found
          </h2>
          <Badge variant="secondary" className="text-xs">
            {properties.filter((p) => p.isHot).length} Hot Deals
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-border rounded-md px-2 py-1 bg-background"
          >
            <option value="price">Price: Low to High</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>

          {/* Expand/Collapse Button */}
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Property List */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "list" ? (
          <div className="p-4 space-y-3">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant="compact"
                isSelected={selectedProperty === property.id}
                onSelect={() => onPropertySelect(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant="full"
                isSelected={selectedProperty === property.id}
                onSelect={() => onPropertySelect(property.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
            <div className="text-muted-foreground mb-2">No villas found</div>
            <div className="text-sm text-muted-foreground">Try adjusting your search criteria or location</div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer (only visible when half-open) */}
      {isOpen && !isExpanded && (
        <div className="border-t border-border bg-muted/20 p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Avg: ₹{Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString()}
                /night
              </span>
              <span className="text-muted-foreground">
                {properties.filter((p) => p.rating >= 4.5).length} highly rated
              </span>
            </div>
            <button onClick={() => setIsExpanded(true)} className="text-primary hover:text-primary/80 font-medium">
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
