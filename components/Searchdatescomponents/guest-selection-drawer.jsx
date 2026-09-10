"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { X, Users } from "lucide-react";
import { CounterButton } from "./counter-button";
import { useSelector, useDispatch } from "react-redux";
import { updateGuestCount } from "@/Redux/Slices/bookingSlice";

export function GuestSelectionDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { selectedGuest } = useSelector((state) => state.booking);

  const handleUpdate = (type, value) => {
    dispatch(updateGuestCount({ type, value }));
  };

  const totalGuests = (selectedGuest.adults || 1) + (selectedGuest.childrenn || 0);

  const summaryPill = useMemo(() => {
    const parts = [`${totalGuests} Guest${totalGuests > 1 ? "s" : ""}`];
    if (selectedGuest.infants > 0) {
      parts.push(
        `${selectedGuest.infants} Infant${selectedGuest.infants > 1 ? "s" : ""}`
      );
    }
    if (selectedGuest.pets > 0) {
      parts.push(
        `${selectedGuest.pets} Pet${selectedGuest.pets > 1 ? "s" : ""}`
      );
    }
    return parts.join(" • ");
  }, [totalGuests, selectedGuest.infants, selectedGuest.pets]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[88vh] rounded-t-3xl border-none bg-white p-0 overflow-hidden">
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1" />

        <DrawerHeader className="text-left px-5 pt-2 pb-3 border-b border-neutral-150">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff6900]" />
                <span>Who's Coming?</span>
              </DrawerTitle>
              <div className="text-xs text-[#ff6900] font-semibold mt-0.5">
                {summaryPill}
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                <X className="h-4 w-4 text-neutral-600" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-5 py-3 divide-y divide-neutral-100 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Adults */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-bold text-sm text-neutral-900">Adults</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Ages 13 or above
              </div>
            </div>
            <CounterButton
              value={selectedGuest.adults || 1}
              onDecrement={() =>
                handleUpdate("adults", Math.max(1, (selectedGuest.adults || 1) - 1))
              }
              onIncrement={() =>
                handleUpdate("adults", (selectedGuest.adults || 1) + 1)
              }
              min={1}
            />
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-bold text-sm text-neutral-900">Children</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Ages 2–12 years
              </div>
            </div>
            <CounterButton
              value={selectedGuest.childrenn || 0}
              onDecrement={() =>
                handleUpdate("childrenn", Math.max(0, (selectedGuest.childrenn || 0) - 1))
              }
              onIncrement={() =>
                handleUpdate("childrenn", (selectedGuest.childrenn || 0) + 1)
              }
              min={0}
            />
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-bold text-sm text-neutral-900">Infants</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Under 2 years (doesn't count toward max)
              </div>
            </div>
            <CounterButton
              value={selectedGuest.infants || 0}
              onDecrement={() =>
                handleUpdate("infants", Math.max(0, (selectedGuest.infants || 0) - 1))
              }
              onIncrement={() =>
                handleUpdate("infants", (selectedGuest.infants || 0) + 1)
              }
              min={0}
            />
          </div>

          {/* Pets */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-bold text-sm text-neutral-900">Pets</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Bringing a service animal or companion?
              </div>
            </div>
            <CounterButton
              value={selectedGuest.pets || 0}
              onDecrement={() =>
                handleUpdate("pets", Math.max(0, (selectedGuest.pets || 0) - 1))
              }
              onIncrement={() =>
                handleUpdate("pets", (selectedGuest.pets || 0) + 1)
              }
              min={0}
            />
          </div>
        </div>

        {/* Footer with Done Button */}
        <DrawerFooter className="px-5 py-3 border-t border-neutral-150 bg-white">
          <Button
            onClick={onClose}
            className="w-full py-3 h-12 text-sm font-bold bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            Confirm Guests ({totalGuests})
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
