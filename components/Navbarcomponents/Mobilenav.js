"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { UserSidebar } from "./Sidebar";
import { NotificationSheet } from "./Notificationsheet";

import { BookingSearchBox } from "./booking-search-box";
import UserLocationDisplay from "../Homecomponets/user-location-display";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState({
    menu: false,
    notifications: false,
  });

  const cartItemCount = 3;
  const { isVisible } = useScrollDirection();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full  rounded-b-2xl px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden ",
        isVisible
          ? "translate-y-0 bg-[#FFFFFF4D] backdrop-blur-2xl"
          : "-translate-y-14 bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserSidebar />
          {pathname === "/" ||
          pathname === "/explore" ||
          pathname.startsWith("/products/") ||
          pathname.startsWith("/category/") ? (
            <div>
              <div className="text-xs font-medium">Location</div>
              <UserLocationDisplay />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="flex items-center gap-2">
          <NotificationSheet />

          {/* <Button
            onClick={() => router.push("/bag")}
            variant="outline"
            size="icon"
            className="rounded-md  border-gray-300 relative bg-[#FFFFFF4D]"
          >
            <IoBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-black text-white border-1 border-white min-w-[1.25rem] h-5"
                variant="default"
              >
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button> */}
        </div>
      </div>

      {(pathname === "/" || pathname.startsWith("/category/")) && (
        <div className="mt-4 flex w-full justify-between items-center gap-2">
          <div className="w-full">
            <BookingSearchBox />
          </div>
        </div>
      )}
    </header>
  );
}
