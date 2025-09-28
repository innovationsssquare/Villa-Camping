import React from "react";
import { Button } from "@heroui/react";
import { SquarePen } from "lucide-react";

const FixedBookingBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-2 z-50">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-price-original line-through">
              ₹34,351
            </span>
            <span className="text-lg font-bold text-price-current">
              ₹31,349
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-villa-text-light">
            <span>2 Guests</span>
           <Button isIconOnly variant="light" size="" className="">
            <SquarePen size={15}/>
           </Button>
          </div>
          <p className="text-xs text-villa-text-light">
            (For 5 rooms) Per night + taxes
          </p>
        </div>
        <Button
          className="bg-black text-white px-4 py-1 rounded-full text-sm hover:bg-villa-text-dark/90"
          size="lg"
        >
          Select Dates
        </Button>
      </div>
    </div>
  );
};

export default FixedBookingBar;
