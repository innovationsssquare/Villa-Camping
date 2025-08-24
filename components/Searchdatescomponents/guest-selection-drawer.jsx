"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { X } from "lucide-react"
import { CounterButton } from "./counter-button"
import { useSelector, useDispatch } from "react-redux"
import { updateGuestCount } from "@/Redux/Slices/bookingSlice"

export function GuestSelectionDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { selectedGuest } = useSelector((state) => state.booking)

  const handleUpdate = (type, value) => {
    dispatch(updateGuestCount({ type, value }))
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
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Adults</div>
              <div className="text-sm text-gray-500">Age 13 years and more</div>
            </div>
            <CounterButton
              value={selectedGuest.adults}
              onDecrement={() =>
                handleUpdate("adults", Math.max(1, selectedGuest.adults - 1))
              }
              onIncrement={() =>
                handleUpdate("adults", selectedGuest.adults + 1)
              }
              min={1}
            />
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Children</div>
              <div className="text-sm text-gray-500">Age 3-12 years</div>
            </div>
            <CounterButton
              value={selectedGuest.childrenn}
              onDecrement={() =>
                handleUpdate("childrenn", Math.max(0, selectedGuest.childrenn - 1))
              }
              onIncrement={() =>
                handleUpdate("childrenn", selectedGuest.childrenn + 1)
              }
            />
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Infants</div>
              <div className="text-sm text-gray-500">Age 0-2 years</div>
            </div>
            <CounterButton
              value={selectedGuest.infants}
              onDecrement={() =>
                handleUpdate("infants", Math.max(0, selectedGuest.infants - 1))
              }
              onIncrement={() =>
                handleUpdate("infants", selectedGuest.infants + 1)
              }
            />
          </div>

          {/* Pets */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Pets</div>
            </div>
            <CounterButton
              value={selectedGuest.pets}
              onDecrement={() =>
                handleUpdate("pets", Math.max(0, selectedGuest.pets - 1))
              }
              onIncrement={() =>
                handleUpdate("pets", selectedGuest.pets + 1)
              }
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg"
            onClick={onClose}
          >
            DONE
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
