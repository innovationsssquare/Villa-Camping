"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Users, Home, ChevronDown, Star, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function StickyBookingWidget() {
  const [stickyState, setStickyState] = useState("normal")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2 Adults, 0 Children")
  const [rooms, setRooms] = useState("5 Rooms")
  const widgetRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!widgetRef.current || !containerRef.current) return

      const widgetRect = widgetRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      const footerElement = document.querySelector("footer") || document.querySelector("[data-footer]")

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const widgetHeight = widgetRef.current.offsetHeight

      const stickyStartPoint = 600

      let footerTop = document.body.scrollHeight
      if (footerElement) {
        footerTop = footerElement.getBoundingClientRect().top + scrollY
      }

      const stickyWidgetBottom = scrollY + windowHeight - 24
      const widgetWouldHitFooter = stickyWidgetBottom + widgetHeight > footerTop

      let newState
      if (scrollY < stickyStartPoint) {
        newState = "normal"
      } else if (widgetWouldHitFooter) {
        newState = "bottom"
      } else {
        newState = "sticky"
      }

      if (newState !== stickyState) {
        setStickyState(newState)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [stickyState])

  const getWidgetStyles = () => {
    switch (stickyState) {
      case "sticky":
        return {
          position: "fixed",
          top: "120px",
          right: "0px",
          width: "400px",
          zIndex: 30,
        }
      case "bottom":
        return {
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "100%",
        }
      default:
        return {
          position: "relative",
          width: "100%",
        }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div ref={widgetRef} style={getWidgetStyles()} className="transition-all duration-500 ease-out transform">
        <Card
          className={`shadow-xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-500 ease-out ${
            stickyState === "sticky" ? "shadow-xl transform scale-100 bg-white/98" : "shadow-lg transform scale-100"
          }`}
        >
          <CardContent className="p-6">
            {/* Pricing Header */}
            <div className="flex items-center justify-between mb-6 transition-all duration-300">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 line-through text-lg transition-all duration-300">₹58,750</span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-gray-900 transition-all duration-300">₹52,975</span>
                  <span className="text-gray-600 text-sm transition-all duration-300">(for 5 rooms)</span>
                </div>
                <span className="text-gray-500 text-sm transition-all duration-300">Per Night + Taxes</span>
              </div>
              <div className="flex items-center space-x-1 text-sm transition-all duration-300">
                <Star className="w-4 h-4 fill-current text-yellow-400 transition-all duration-300" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-500">/5</span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:transform hover:scale-102">
                <label className="text-xs font-medium text-gray-700 uppercase block mb-1 transition-all duration-300">
                  Check-in
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 transition-all duration-300" />
                  <div className="flex-1">
                    {checkIn ? (
                      <span className="text-sm text-gray-900 transition-all duration-300">
                        {new Date(checkIn).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 transition-all duration-300">Add Date</span>
                    )}
                  </div>
                </div>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>

              <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:transform hover:scale-102">
                <label className="text-xs font-medium text-gray-700 uppercase block mb-1 transition-all duration-300">
                  Check-out
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 transition-all duration-300" />
                  <div className="flex-1">
                    {checkOut ? (
                      <span className="text-sm text-gray-900 transition-all duration-300">
                        {new Date(checkOut).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 transition-all duration-300">Add Date</span>
                    )}
                  </div>
                </div>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>
            </div>

            {/* Guests and Rooms Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:transform hover:scale-102">
                <label className="text-xs font-medium text-gray-700 uppercase block mb-1 transition-all duration-300">
                  Guests
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400 transition-all duration-300" />
                    <span className="text-sm text-gray-900 transition-all duration-300">{guests}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 hover:rotate-180" />
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:transform hover:scale-102">
                <label className="text-xs font-medium text-gray-700 uppercase block mb-1 transition-all duration-300">
                  No. of Rooms
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-gray-400 transition-all duration-300" />
                    <span className="text-sm text-gray-900 transition-all duration-300">{rooms}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 hover:rotate-180" />
                </div>
              </div>
            </div>

            {/* Best Price Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 transition-all duration-300 hover:bg-green-100 hover:shadow-sm">
              <div className="text-center">
                <div className="text-green-600 font-semibold text-sm mb-1 transition-all duration-300">
                  Select Dates for Best Price
                </div>
                <div className="text-green-600 text-xs transition-all duration-300">
                  Reserve to get exciting offer for this property!
                </div>
              </div>
            </div>

            {/* Reserve Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-4 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 active:scale-95">
              Reserve Now
            </Button>

            {/* Property Features */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between transition-all duration-300 hover:bg-gray-50 rounded-lg p-2 -m-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400 transition-all duration-300" />
                  <span className="text-gray-700 transition-all duration-300">Up to 15 Guests</span>
                </div>
              </div>
              <div className="flex items-center justify-between transition-all duration-300 hover:bg-gray-50 rounded-lg p-2 -m-2">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-gray-400 transition-all duration-300" />
                  <span className="text-gray-700 transition-all duration-300">5 Rooms</span>
                  <Info className="w-3 h-3 text-blue-500 transition-all duration-300 hover:scale-125" />
                </div>
              </div>
              <div className="flex items-center justify-between transition-all duration-300 hover:bg-gray-50 rounded-lg p-2 -m-2">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-center text-gray-400 transition-all duration-300">🛁</span>
                  <span className="text-gray-700 transition-all duration-300">5 Baths</span>
                </div>
              </div>
              <div className="flex items-center justify-between transition-all duration-300 hover:bg-gray-50 rounded-lg p-2 -m-2">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-center text-gray-400 transition-all duration-300">🍽️</span>
                  <span className="text-gray-700 transition-all duration-300">Meals Available</span>
                </div>
              </div>
            </div>

            {/* View Brochure Button */}
            <Button
              variant="outline"
              className="w-full mt-4 border-pink-200 text-pink-600 hover:bg-pink-50 font-medium bg-transparent transition-all duration-300 hover:shadow-md hover:transform hover:scale-105 active:scale-95"
            >
              <span className="mr-2 transition-all duration-300">📋</span>
              View Brochure
            </Button>
          </CardContent>
        </Card>

        {/* Sticky state indicator */}
        <div
          className={`absolute -top-1 left-0 right-0 h-0.5  rounded-full transition-all duration-500 ease-out ${
            stickyState === "sticky" ? "opacity-100 transform scale-x-100" : "opacity-0 transform scale-x-0"
          }`}
          style={{ transformOrigin: "center" }}
        />
      </div>
    </div>
  )
}
