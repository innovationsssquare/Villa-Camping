"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, MapPin, Calendar, Users, Home, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInputCard } from "./search-input-card"
import { GuestSelectionDrawer } from "./guest-selection-drawer"

export default function SearchStayPage() {
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false)
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
    pets: 0,
    rooms: 1,
  })

  const guestSummary = useMemo(() => {
    const parts = []
    if (guests.adults > 0) parts.push(`${guests.adults} Guest${guests.adults > 1 ? "s" : ""}`)
    if (guests.children > 0) parts.push(`${guests.children} Child${guests.children > 1 ? "ren" : ""}`)
    if (guests.infants > 0) parts.push(`${guests.infants} Infant${guests.infants > 1 ? "s" : ""}`)
    if (guests.pets > 0) parts.push(`${guests.pets} Pet${guests.pets > 1 ? "s" : ""}`)
    return parts.join(", ") || "Add Guests"
  }, [guests])

  const roomSummary = useMemo(() => {
    return `${guests.rooms}+ Room${guests.rooms > 1 ? "s" : ""}`
  }, [guests.rooms])

  const handleSaveGuests = (newGuests) => {
    setGuests(newGuests)
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-5 w-5 text-gray-800" />
          <h1 className="text-lg font-semibold text-gray-800">Search your Stay</h1>
        </div>
        
      </header>

      {/* Search Inputs */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <SearchInputCard
          icon={<MapPin className="h-5 w-5" />}
          label="Location/Villas/Landmark"
          value="Luxury Collection, India"
        />

        <Link href="/date-selection" passHref>
          <SearchInputCard
            icon={<Calendar className="h-5 w-5" />}
            label="Check-in Date"
            value="05 Apr Thu 2029"
            badge="1 Night"
            className="relative"
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-800">
              Check-Out Date
              <div className="text-base font-bold">06 Apr Fri 2029</div>
            </div>
          </SearchInputCard>
        </Link>

        <SearchInputCard
          icon={<Users className="h-5 w-5" />}
          label="Total Guests"
          value={guestSummary}
          onClick={() => setIsGuestDrawerOpen(true)}
        />

        <SearchInputCard
          icon={<Home className="h-5 w-5" />}
          label="No. of rooms"
          value={roomSummary}
          onClick={() => setIsGuestDrawerOpen(true)} // Assuming rooms are also managed by the same drawer
        />

        <Button className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg mt-6">SEARCH STAYS</Button>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
         {` Finding your ideal vacation spot should be easy, we're here to help!`}
        </p>
        <Button variant="ghost" className="text-black text-sm font-semibold">
          <Phone className="h-4 w-4 mr-2" />
          Request Callback
        </Button>
        <div className="text-center text-xs text-gray-500 mt-3">
          <span className="mr-1">🔒</span>
          www.thevillacamp.com
        </div>
      </footer>

      <GuestSelectionDrawer
        isOpen={isGuestDrawerOpen}
        onClose={() => setIsGuestDrawerOpen(false)}
        initialGuests={guests}
        onSave={handleSaveGuests}
      />
    </div>
  )
}
