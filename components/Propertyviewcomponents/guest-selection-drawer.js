"use client";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { Button } from "@heroui/react";

export default function GuestSelectionDrawer({
  isOpen,
  onClose,
  guestCounts,
  onGuestCountsChange,
}) {
  const updateCount = (type, increment) => {
    const newCounts = { ...guestCounts };
    if (increment) {
      newCounts[type] += 1;
    } else if (newCounts[type] > 0) {
      newCounts[type] -= 1;
    }

    // Ensure at least 1 adult
    if (type === "adults" && newCounts.adults < 1) {
      newCounts.adults = 1;
    }

    onGuestCountsChange(newCounts);
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] w-full border-none">
        <DrawerHeader className="flex flex-row items-center justify-between w-full ">
          <DrawerTitle className="text-lg font-semibold text-black">
            Total Guests
          </DrawerTitle>
          <Button
            variant="light"
            size="icon"
            onPress={onClose}
            className="rounded-full p-1 border-gray-300 border "
          >
            <X className="h-5 w-5 text-black" />
          </Button>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">Adults</h3>
              <p className="text-sm text-gray-600">Age 13 years and more</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateCount("adults", false)}
                disabled={guestCounts.adults <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FaMinus className="w-3 h-3 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-black">
                {guestCounts.adults.toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => updateCount("adults", true)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <FaPlus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">Children</h3>
              <p className="text-sm text-gray-600">Age 3-12 years</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateCount("children", false)}
                disabled={guestCounts.children <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FaMinus className="w-3 h-3 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-black">
                {guestCounts.children.toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => updateCount("children", true)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <FaPlus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">Infants</h3>
              <p className="text-sm text-gray-600">Age 0-2 years</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateCount("infants", false)}
                disabled={guestCounts.infants <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FaMinus className="w-3 h-3 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-black">
                {guestCounts.infants.toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => updateCount("infants", true)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <FaPlus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={handleDone}
            className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            DONE
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
