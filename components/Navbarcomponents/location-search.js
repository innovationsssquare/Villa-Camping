"use client"

import { useState } from "react"
import { MapPin, Clock } from "lucide-react"

const popularDestinations = [
  { name: "Paris, France", type: "City" },
  { name: "New York, United States", type: "City" },
  { name: "Tokyo, Japan", type: "City" },
  { name: "London, United Kingdom", type: "City" },
  { name: "Barcelona, Spain", type: "City" },
  { name: "Rome, Italy", type: "City" },
]

const recentSearches = ["San Francisco, CA", "Los Angeles, CA", "Miami, FL"]

export function LocationSearch({ onLocationSelect, isMobile = false }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDestinations = popularDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="relative">
      {/* Tooltip Arrow - Responsive sizing and positioning */}
      <div
        className={`absolute -top-1.5 md:-top-2 bg-white border-l border-t border-gray-200 rotate-45 z-10 ${
          isMobile
            ? "w-3 h-3 left-1/4 transform -translate-x-1/2"
            : "w-3 h-3 md:w-4 md:h-4 left-1/2 transform -translate-x-1/2"
        }`}
      ></div>

      <div
        className={`bg-white border border-gray-200 rounded-2xl shadow-lg relative z-20 ${
          isMobile ? "p-4 w-72" : "p-4 md:p-6 w-72 md:w-80"
        }`}
      >
        <input
          type="text"
          placeholder="Search destinations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
            isMobile ? "p-2.5 text-sm" : "p-2.5 md:p-3 text-sm md:text-base"
          }`}
        />

        {searchTerm === "" && (
          <>
            <div className={isMobile ? "mt-4" : "mt-4 md:mt-6"}>
              <h4 className={`font-medium text-gray-900 mb-2 md:mb-3 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                Recent searches
              </h4>
              {recentSearches.map((location, index) => (
                <button
                  key={index}
                  onClick={() => onLocationSelect(location)}
                  className={`flex items-center w-full hover:bg-gray-50 rounded-lg transition-colors ${
                    isMobile ? "p-1.5" : "p-1.5 md:p-2"
                  }`}
                >
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-2 md:mr-3" />
                  <span className={`text-gray-700 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>{location}</span>
                </button>
              ))}
            </div>

            <div className={isMobile ? "mt-4" : "mt-4 md:mt-6"}>
              <h4 className={`font-medium text-gray-900 mb-2 md:mb-3 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                Popular destinations
              </h4>
              {popularDestinations.map((destination, index) => (
                <button
                  key={index}
                  onClick={() => onLocationSelect(destination.name)}
                  className={`flex items-center w-full hover:bg-gray-50 rounded-lg transition-colors ${
                    isMobile ? "p-1.5" : "p-1.5 md:p-2"
                  }`}
                >
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-2 md:mr-3" />
                  <div className="text-left">
                    <div className={`text-gray-700 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                      {destination.name}
                    </div>
                    <div className={`text-gray-500 ${isMobile ? "text-xs" : "text-xs md:text-sm"}`}>
                      {destination.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {searchTerm !== "" && (
          <div className={isMobile ? "mt-3" : "mt-3 md:mt-4"}>
            {filteredDestinations.map((destination, index) => (
              <button
                key={index}
                onClick={() => onLocationSelect(destination.name)}
                className={`flex items-center w-full hover:bg-gray-50 rounded-lg transition-colors ${
                  isMobile ? "p-1.5" : "p-1.5 md:p-2"
                }`}
              >
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-2 md:mr-3" />
                <div className="text-left">
                  <div className={`text-gray-700 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                    {destination.name}
                  </div>
                  <div className={`text-gray-500 ${isMobile ? "text-xs" : "text-xs md:text-sm"}`}>
                    {destination.type}
                  </div>
                </div>
              </button>
            ))}
            {filteredDestinations.length === 0 && (
              <div className={`text-gray-500 text-center py-4 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                No destinations found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
