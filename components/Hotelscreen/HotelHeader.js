import React from "react";
import { ArrowLeft, Share, Bell, User } from "lucide-react";

const HotelHeader = () => {
  return (
    <div className="flex items-center  justify-between p-2 bg-background w-full  overflow-hidden">
      <div className="flex items-center w-2/3">
        <button className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-2 flex items-center truncate ">
          <span className="text-md font-medium truncate">
            Vatalya vila - Malawali,lonavala
          </span>
        </div>
      </div>

      <div className="flex items-center  ">
        <button className="p-2">
          <Share className="w-5 h-5" />
        </button>
        <button className="p-2 relative">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-villa-red rounded-full"></div>
        </button>
        <button className="p-2">
          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-background" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default  HotelHeader;
