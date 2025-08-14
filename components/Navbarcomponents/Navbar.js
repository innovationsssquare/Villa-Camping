"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Globe, Menu, User, Home, Lightbulb, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "./date-picker"
import { GuestSelector } from "./guest-selector"
import { LocationSearch } from "./location-search"

export default function AirbnbNavbar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Search state
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  })

  const dropdownRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      const threshold = isMobile ? 50 : 100
      setIsExpanded(currentScrollY < threshold)

      // Close any open dropdown when scrolling
      if (activeDropdown) {
        setActiveDropdown(null)
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", checkMobile)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, activeDropdown])

  const formatDate = (date) => {
    if (!date) return "Add dates"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getTotalGuests = () => {
    const total = guests.adults + guests.children
    if (total === 1) return "1 guest"
    return `${total} guests`
  }

  const handleGuestChange = (type, value) => {
    setGuests((prev) => ({ ...prev, [type]: value }))
  }

  const handleSearch = () => {
    console.log("Search:", { location, checkIn, checkOut, guests })
    setActiveDropdown(null)
    // Implement search logic here
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? (isMobile ? "h-28" : "h-48") : "h-16 md:h-20"
      } overflow-visible`}
      style={{
        fontFamily:
          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
        background: scrollY > 0 ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: scrollY > 0 ? "0 8px 32px rgba(0, 0, 0, 0.1)" : "0 4px 16px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-full">
        {/* Top row - Logo and right side menu */}
        <div className={`flex items-center justify-between ${isMobile ? "h-16" : "h-20"}`}>
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                <span
                  className="text-white font-bold text-base md:text-lg"
                  style={{
                    fontFamily:
                      'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                  }}
                >
                  a
                </span>
              </div>
              <span
                className="text-red-500 font-bold text-lg md:text-xl hidden sm:block"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                airbnb
              </span>
            </div>
          </div>

          {/* Center search - minimized state */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
              !isExpanded
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 pointer-events-none translate-y-2"
            }`}
          >
            <div
              onClick={() => setActiveDropdown("minimized")}
              className={`flex items-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
                isMobile ? "scale-90" : ""
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div className="flex items-center px-3 md:px-4 py-2">
                <Home className="w-3 h-3 md:w-4 md:h-4 text-gray-600 mr-1 md:mr-2" />
                <span
                  className="text-xs md:text-sm font-medium text-gray-800"
                  style={{
                    fontFamily:
                      'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                  }}
                >
                  {location || "Anywhere"}
                </span>
              </div>
              <div className="border-l border-gray-300 h-4 md:h-6"></div>
              <div className="flex items-center px-3 md:px-4 py-2">
                <span
                  className="text-xs md:text-sm font-medium text-gray-800"
                  style={{
                    fontFamily:
                      'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                  }}
                >
                  {checkIn && checkOut ? `${formatDate(checkIn)} - ${formatDate(checkOut)}` : "Anytime"}
                </span>
              </div>
              <div className="border-l border-gray-300 h-4 md:h-6"></div>
              <div className="flex items-center px-3 md:px-4 py-2">
                <span
                  className="text-xs md:text-sm text-gray-600"
                  style={{
                    fontFamily:
                      'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                  }}
                >
                  {guests.adults > 1 || guests.children > 0 ? getTotalGuests() : "Add guests"}
                </span>
              </div>
              <div className="bg-red-500 rounded-full p-1.5 md:p-2 m-1 shadow-sm">
                <Search className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <span
              className="text-xs md:text-sm font-medium text-gray-800 hidden lg:block cursor-pointer hover:bg-white/30 px-2 md:px-3 py-1 md:py-2 rounded-full transition-all duration-200 backdrop-blur-sm"
              style={{
                fontFamily:
                  'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
              }}
            >
              Become a host
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 md:w-10 md:h-10 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
            >
              <Globe className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <div
              className="flex items-center space-x-1 rounded-full p-0.5 md:p-1 cursor-pointer hover:shadow-lg transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Button variant="ghost" size="icon" className="w-6 h-6 md:w-8 md:h-8 hover:bg-white/30">
                <Menu className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6 md:w-8 md:h-8 hover:bg-white/30">
                <User className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation tabs and expanded search */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {/* Navigation tabs */}
          <div className="hidden md:flex items-center justify-center space-x-8 pb-2">
            <div className="flex items-center space-x-2 cursor-pointer border-b-2 border-gray-800 pb-3">
              <Home className="w-4 h-4" />
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                Homes
              </span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-3 transition-colors">
              <Lightbulb className="w-4 h-4" />
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                Experiences
              </span>
              <span
                className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                NEW
              </span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-3 transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                Services
              </span>
              <span
                className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                NEW
              </span>
            </div>
          </div>

          {/* Mobile navigation tabs */}
          <div className="md:hidden flex items-center justify-center space-x-6 pb-2">
            <div className="flex items-center space-x-1 cursor-pointer border-b-2 border-gray-800 pb-2">
              <Home className="w-3 h-3" />
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                Homes
              </span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-2 transition-colors">
              <Lightbulb className="w-3 h-3" />
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                Experiences
              </span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-2 transition-colors">
              <UtensilsCrossed className="w-3 h-3" />
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily:
                    'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                }}
              >
                Services
              </span>
            </div>
          </div>

          {/* Expanded search form */}
          <div className="pb-2 relative" ref={dropdownRef}>
            <div
              className={`flex items-center rounded-full shadow-xl mx-auto transition-all duration-200 ${
                isMobile ? "max-w-sm" : "max-w-4xl"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(25px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              {isMobile ? (
                // Mobile: Simplified layout
                <>
                  <div
                    onClick={() => setActiveDropdown(activeDropdown === "location" ? null : "location")}
                    className="flex-1 px-3 py-2 border-r border-white/30 rounded-l-full hover:bg-white/30 cursor-pointer transition-all duration-200 backdrop-blur-sm"
                  >
                    <div
                      className="text-xs font-semibold text-gray-800 mb-0.5"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      Where
                    </div>
                    <div
                      className="text-xs text-gray-500 truncate"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      {location || "Add destination"}
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveDropdown(activeDropdown === "guests" ? null : "guests")}
                    className="flex-1 px-3 py-2 hover:bg-white/30 cursor-pointer transition-all duration-200 rounded-r-full backdrop-blur-sm"
                  >
                    <div
                      className="text-xs font-semibold text-gray-800 mb-0.5"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      Who
                    </div>
                    <div
                      className="text-xs text-gray-500"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      {getTotalGuests()}
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-red-500 rounded-full p-2 m-1 cursor-pointer hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                // Desktop: Full layout
                <>
                  <div
                    onClick={() => setActiveDropdown(activeDropdown === "location" ? null : "location")}
                    className={`flex-1 px-4 py-3 border-r border-white/30 rounded-l-full hover:bg-white/30 cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                      activeDropdown === "location" ? "bg-white/20" : ""
                    }`}
                  >
                    <div
                      className="text-xs font-semibold text-gray-800 mb-1"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      Where
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      {location || "Search destinations"}
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveDropdown(activeDropdown === "checkin" ? null : "checkin")}
                    className={`flex-1 px-4 py-3 border-r border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                      activeDropdown === "checkin" ? "bg-white/20" : ""
                    }`}
                  >
                    <div
                      className="text-xs font-semibold text-gray-800 mb-1"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      Check in
                    </div>
                    <div
                      className="text-sm text-gray-500"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      {formatDate(checkIn)}
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveDropdown(activeDropdown === "checkout" ? null : "checkout")}
                    className={`flex-1 px-4 py-3 border-r border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                      activeDropdown === "checkout" ? "bg-white/20" : ""
                    }`}
                  >
                    <div
                      className="text-xs font-semibold text-gray-800 mb-1"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      Check out
                    </div>
                    <div
                      className="text-sm text-gray-500"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      {formatDate(checkOut)}
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveDropdown(activeDropdown === "guests" ? null : "guests")}
                    className={`flex-1 px-4 py-3 hover:bg-white/30 cursor-pointer transition-all duration-200 rounded-r-full backdrop-blur-sm ${
                      activeDropdown === "guests" ? "bg-white/20" : ""
                    }`}
                  >
                    <div
                      className="text-xs font-semibold text-gray-800 mb-1"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      Who
                    </div>
                    <div
                      className="text-sm text-gray-500"
                      style={{
                        fontFamily:
                          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                      }}
                    >
                      {getTotalGuests()}
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-red-500 rounded-full p-3 m-1 cursor-pointer hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Dropdowns with mobile-optimized positioning */}
            {activeDropdown === "location" && (
              <div className={`absolute top-full mt-1 z-50 ${isMobile ? "left-0" : "left-0"}`}>
                <LocationSearch
                  onLocationSelect={(loc) => {
                    setLocation(loc)
                    setActiveDropdown(null)
                  }}
                  isMobile={isMobile}
                />
              </div>
            )}

            {activeDropdown === "checkin" && (
              <div className={`absolute top-full mt-1 z-50 ${isMobile ? "left-0" : "left-1/4"}`}>
                <DatePicker
                  selectedDate={checkIn}
                  onDateSelect={(date) => {
                    setCheckIn(date)
                    setActiveDropdown("checkout")
                  }}
                  placeholder="Check in"
                  isMobile={isMobile}
                />
              </div>
            )}

            {activeDropdown === "checkout" && (
              <div className={`absolute top-full mt-1 z-50 ${isMobile ? "left-0" : "left-2/4"}`}>
                <DatePicker
                  selectedDate={checkOut}
                  onDateSelect={(date) => {
                    setCheckOut(date)
                    setActiveDropdown(null)
                  }}
                  minDate={checkIn || new Date()}
                  placeholder="Check out"
                  isMobile={isMobile}
                />
              </div>
            )}

            {activeDropdown === "guests" && (
              <div className={`absolute top-full mt-1 z-50 ${isMobile ? "right-0" : "right-0"}`}>
                <GuestSelector
                  adults={guests.adults}
                  children={guests.children}
                  infants={guests.infants}
                  pets={guests.pets}
                  onGuestChange={handleGuestChange}
                  isMobile={isMobile}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
