import React from "react";
import { ArrowLeft, Share, Bell, User } from "lucide-react";
import { useCamping } from "@/lib/context/CampingContext";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const TentHeader = () => {
    const camping = useCamping();
    const router = useRouter();
  return (
    <div className="flex items-center  justify-between p-2 bg-background w-full  overflow-hidden">
      <div className="flex items-center w-2/3">
       <Button
          isIconOnly
          variant="light"
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="ml-2 flex items-center truncate ">
          <span className="text-md font-medium truncate">
            {camping?.name} - {camping?.address?.addressLine},{camping?.address?.city}
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

export default TentHeader;
