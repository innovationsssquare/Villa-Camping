"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { X } from "lucide-react"
import { CounterButton } from "./counter-button"

export function GuestSelectionDrawer({ isOpen, onClose, initialGuests, onSave }) {
  const [adults, setAdults] = useState(initialGuests.adults)
  const [children, setChildren] = useState(initialGuests.children)
  const [infants, setInfants] = useState(initialGuests.infants)
  const [pets, setPets] = useState(initialGuests.pets)

  useEffect(() => {
    if (isOpen) {
      setAdults(initialGuests.adults)
      setChildren(initialGuests.children)
      setInfants(initialGuests.infants)
      setPets(initialGuests.pets)
    }
  }, [isOpen, initialGuests])

  const handleSave = () => {
    onSave({ adults, children, infants, pets })
    onClose()
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold">Total Guests</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Adults</div>
              <div className="text-sm text-gray-500">Age 13 years and more</div>
            </div>
            <CounterButton
              value={adults}
              onDecrement={() => setAdults((prev) => Math.max(1, prev - 1))}
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
        </div>

        <DrawerFooter>
          <Button className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg" onClick={handleSave}>
            DONE
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
