"use client";
import React from "react";
import { ArrowLeft, Share, Bell, User } from "lucide-react";
import { useVilla } from "@/lib/context/VillaContext";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const VillaHeader = () => {
  const villa = useVilla();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-3 h-12 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 w-full overflow-hidden">
      <div className="flex items-center w-2/3">
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.back()}
          className="p-1.5 -ml-1 text-gray-700 hover:text-[#ff6900] rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-1.5 flex items-center truncate">
          <span className="text-sm font-bold text-gray-900 truncate">
            {villa?.name}
          </span>
          <span className="text-xs text-gray-400 mx-1">•</span>
          <span className="text-xs text-gray-500 truncate">
            {villa?.address?.city}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Button isIconOnly variant="light" className="p-1.5 text-gray-600 hover:text-[#ff6900] rounded-full">
          <Share className="w-4 h-4" />
        </Button>
        <Button
          onPress={() => router.push("/notifications")}
          isIconOnly
          variant="light"
          className="p-1.5 relative text-gray-600 hover:text-[#ff6900] rounded-full"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-[#ff6900] ring-2 ring-white rounded-full"></div>
        </Button>
        <Button
          onPress={() => router.push("/account")}
          isIconOnly
          radius="full"
          variant="light"
          className="p-1"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-[#ff8533] to-[#ff6900] rounded-full flex items-center justify-center shadow-xs">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default VillaHeader;
