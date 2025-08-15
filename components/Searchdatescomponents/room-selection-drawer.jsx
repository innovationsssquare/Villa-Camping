"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"

const roomOptions = {
  villa: [
    { id: "2bhk", name: "2BHK", icon: "🏠" },
    { id: "3bhk", name: "3BHK", icon: "🏡" },
    { id: "4bhk", name: "4BHK", icon: "🏘️" },
    { id: "5bhk", name: "5BHK", icon: "🏰" },
    { id: "6bhk", name: "6BHK", icon: "🏯" },
  ],
  camping: [
    { id: "single-tent", name: "Single Tent", icon: "⛺" },
    { id: "couple-tent", name: "Couple Tent", icon: "🏕️" },
    { id: "family-tent", name: "Family Tent", icon: "🎪" },
  ],
  cottage: [
    { id: "single-cottage", name: "Single Cottage", icon: "🏘️" },
    { id: "couple-cottage", name: "Couple Cottage", icon: "🏡" },
    { id: "family-cottage", name: "Family Cottage", icon: "🏠" },
  ],
  hotel: [
    { id: "standard-room", name: "Standard Room", icon: "🛏️" },
    { id: "deluxe-room", name: "Deluxe Room", icon: "🛋️" },
    { id: "suite", name: "Suite", icon: "🏨" },
    { id: "presidential-suite", name: "Presidential Suite", icon: "👑" },
  ],
}

export function RoomSelectionDrawer({ isOpen, onClose, category, initialRoom, onSave }) {
  const [selectedRoom, setSelectedRoom] = useState(initialRoom)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (isOpen) {
      setSelectedRoom(initialRoom)
      setQuantity(1)
    }
  }, [isOpen, initialRoom])

  const currentOptions = roomOptions[category] || roomOptions.villa

  const handleSave = () => {
    onSave({
      roomType: selectedRoom,
      quantity: quantity,
    })
    onClose()
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold text-gray-800">Select Room</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2 overflow-y-auto flex-1">
          <div className="space-y-3">
            {currentOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRoom === option.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedRoom(option.id)}
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{option.name}</div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {selectedRoom === option.id && (
                    <div className="w-3 h-3 rounded-full bg-black transition-all duration-200" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleSave}
            className="w-full py-3 bg-black text-white rounded-lg font-semibold"
            disabled={!selectedRoom}
          >
            DONE
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
