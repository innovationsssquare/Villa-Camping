"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, Users, Home, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInputCard } from "./search-input-card"
import { GuestSelectionDrawer } from "./guest-selection-drawer"
import { CategorySelectionDrawer } from "./category-selection-drawer"
import { RoomSelectionDrawer } from "./room-selection-drawer"

export default function SearchStayPage() {
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false)
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false)
  const [isRoomDrawerOpen, setIsRoomDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("villa")

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
    pets: 0,
  })

  const [roomSelection, setRoomSelection] = useState({
    roomType: "3bhk",
    quantity: 1,
  })

  const guestSummary = useMemo(() => {
    const totalGuests = guests.adults + guests.children
    const parts = []

    if (totalGuests > 0) {
      parts.push(`${totalGuests} Guest${totalGuests > 1 ? "s" : ""}`)
    }
    if (guests.infants > 0) {
      parts.push(`${guests.infants} Infant${guests.infants > 1 ? "s" : ""}`)
    }
    if (guests.pets > 0) {
      parts.push(`${guests.pets} Pet${guests.pets > 1 ? "s" : ""}`)
    }

    return parts.length > 0 ? parts.join(", ") : "Add Guests"
  }, [guests])

  const roomSummary = useMemo(() => {
    const roomTypeMap = {
      "2bhk": "2BHK",
      "3bhk": "3BHK",
      "4bhk": "4BHK",
      "5bhk": "5BHK",
      "6bhk": "6BHK",
      "single-tent": "Single Tent",
      "couple-tent": "Couple Tent",
      "family-tent": "Family Tent",
      "single-cottage": "Single Cottage",
      "couple-cottage": "Couple Cottage",
      "family-cottage": "Family Cottage",
      "standard-room": "Standard Room",
      "deluxe-room": "Deluxe Room",
      suite: "Suite",
      "presidential-suite": "Presidential Suite",
    }

    const roomName = roomTypeMap[roomSelection.roomType] || "Select Room"
    return roomSelection.quantity > 1
      ? `${roomSelection.quantity} ${roomName}s`
      : `${roomSelection.quantity} ${roomName}`
  }, [roomSelection])

  const categoryDisplay = useMemo(() => {
    const categoryMap = {
      cottage: { name: "Cottage", icon: "🏡" },
      camping: { name: "Camping", icon: "⛺" },
      villa: { name: "Villa", icon: "🏖️" },
      hotel: { name: "Hotel", icon: "🏨" },
    }
    return categoryMap[selectedCategory] || categoryMap.villa
  }, [selectedCategory])

  const handleSaveGuests = (newGuests) => {
    setGuests(newGuests)
    setIsGuestDrawerOpen(false)
  }

  const handleSaveCategory = (category) => {
    setSelectedCategory(category)
    const defaultRooms = {
      villa: { roomType: "3bhk", quantity: 1 },
      camping: { roomType: "couple-tent", quantity: 1 },
      cottage: { roomType: "couple-cottage", quantity: 1 },
      hotel: { roomType: "standard-room", quantity: 1 },
    }
    setRoomSelection(defaultRooms[category] || defaultRooms.villa)
    setIsCategoryDrawerOpen(false)
  }

  const handleSaveRoom = (newRoom) => {
    setRoomSelection(newRoom)
    setIsRoomDrawerOpen(false)
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
          icon={<span className="text-xl">{categoryDisplay.icon}</span>}
          label="Category"
          value={categoryDisplay.name}
          onClick={() => setIsCategoryDrawerOpen(true)}
        />

        <Link href="/date-selection" passHref>
          <SearchInputCard
            icon={<Calendar className="h-5 w-5" />}
            label="Check-in Date"
            value="05 Apr Thu 2029"
            badge="1 Night"
            className="relative"
          >
            {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-800">
              Check-Out Date
              <div className="text-base font-bold">06 Apr Fri 2029</div>
            </div> */}
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
          label="Room Selection"
          value={roomSummary}
          onClick={() => setIsRoomDrawerOpen(true)}
        />

        <Button className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg mt-6">SEARCH STAYS</Button>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          Finding your ideal vacation spot should be easy, we're here to help!
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

      <CategorySelectionDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        initialCategory={selectedCategory}
        onSave={handleSaveCategory}
      />

      <RoomSelectionDrawer
        isOpen={isRoomDrawerOpen}
        onClose={() => setIsRoomDrawerOpen(false)}
        category={selectedCategory}
        initialRoom={roomSelection.roomType}
        onSave={handleSaveRoom}
      />
    </div>
  )
}
