"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { CounterButton } from "./counter-button"



export function GuestSelectionDrawer({ isOpen, onClose, initialGuests, onSave }) {
  const [adults, setAdults] = useState(initialGuests.adults)
  const [children, setChildren] = useState(initialGuests.children)
  const [infants, setInfants] = useState(initialGuests.infants)
  const [pets, setPets] = useState(initialGuests.pets)
  const [rooms, setRooms] = useState(initialGuests.rooms)

  const handleSave = () => {
    onSave({ adults, children, infants, pets, rooms })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed bottom-0 left-0 right-0 top-auto h-auto max-h-[90vh] rounded-t-2xl bg-white p-6 shadow-lg sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold">Total Guests</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Adults</div>
              <div className="text-sm text-gray-500">Age 13 years and more</div>
            </div>
            <CounterButton
              value={adults}
              onDecrement={() => setAdults((prev) => Math.max(1, prev - 1))} // Minimum 1 adult
              onIncrement={() => setAdults((prev) => prev + 1)}
              min={1}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Children</div>
              <div className="text-sm text-gray-500">Age 3-12 years</div>
            </div>
            <CounterButton
              value={children}
              onDecrement={() => setChildren((prev) => Math.max(0, prev - 1))}
              onIncrement={() => setChildren((prev) => prev + 1)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Infants</div>
              <div className="text-sm text-gray-500">Age 0-2 years</div>
            </div>
            <CounterButton
              value={infants}
              onDecrement={() => setInfants((prev) => Math.max(0, prev - 1))}
              onIncrement={() => setInfants((prev) => prev + 1)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Pets</div>
            </div>
            <CounterButton
              value={pets}
              onDecrement={() => setPets((prev) => Math.max(0, prev - 1))}
              onIncrement={() => setPets((prev) => prev + 1)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Rooms</div>
            </div>
            <CounterButton
              value={rooms}
              onDecrement={() => setRooms((prev) => Math.max(1, prev - 1))} // Minimum 1 room
              onIncrement={() => setRooms((prev) => prev + 1)}
              min={1}
            />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <Button className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg" onClick={handleSave}>
            DONE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
