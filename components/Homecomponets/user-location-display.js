"use client"

import { useState, useEffect } from "react"
import { IoMdPin } from "react-icons/io" // Assuming you have react-icons installed

export default function UserLocationDisplay() {
  const [location, setLocation] = useState({
    city: null,
    country: null,
    error: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Using OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            )
            const data = await response.json()

            if (data && data.address) {
              setLocation({
                city: data.address.city || data.address.town || data.address.village || null,
                country: data.address.country || null,
                error: null,
              })
            } else {
              setLocation((prev) => ({ ...prev, error: "Could not determine city/country." }))
            }
          } catch (err) {
            console.error("Error fetching location details:", err)
            setLocation((prev) => ({ ...prev, error: "Failed to get location details." }))
          } finally {
            setIsLoading(false)
          }
        },
        (error) => {
          let errorMessage = "Geolocation error: "
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "User denied the request for Geolocation."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage += "The request to get user location timed out."
              break
            case error.UNKNOWN_ERROR:
              errorMessage += "An unknown error occurred."
              break
          }
          setLocation({ city: null, country: null, error: errorMessage })
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    } else {
      setLocation({ city: null, country: null, error: "Geolocation is not supported by this browser." })
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-sm font-semibold">
        <span>Loading location...</span>
        <IoMdPin className="text-gray-400" size={15} />
      </div>
    )
  }

  if (location.error) {
    return (
      <div className="flex items-center gap-1 text-xs  font-semibold text-red-500">
        <span className="">Refresh the page</span>
        <IoMdPin size={15} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 text-sm font-semibold">
      <span>
        {location.city || "Unknown City"}
        {location.country && location.city ? `, ${location.country}` : location.country || ""}
      </span>
      <IoMdPin className="text-red-500" size={15} />
    </div>
  )
}
