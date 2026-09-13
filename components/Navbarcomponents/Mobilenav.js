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
        "fixed top-0 left-0 right-0 w-full rounded-b-xl px-3 pt-1 pb-1.5 z-50 transition-transform duration-300 ease-in-out md:hidden shadow-xs",
        isVisible
          ? "translate-y-0 bg-white/95 backdrop-blur-md"
          : "-translate-y-8 bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <UserSidebar />
          {pathname === "/" ||
            pathname === "/explore" ||
            pathname.startsWith("/products/") ||
            pathname.startsWith("/category/") ? (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="uppercase font-bold text-neutral-400">Location:</span>
              <UserLocationDisplay />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <NotificationSheet />
        </div>
      </div>

      {(pathname === "/" || pathname.startsWith("/category/")) && (
        <div className="mt-1 flex w-full justify-between items-center">
          <div className="w-full">
            <BookingSearchBox />
          </div>
        </div>
      )}
    </header>
  );
}
