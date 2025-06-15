"use client";

import { useState } from "react";
import { Bell, MapPin, Menu, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { FilterDrawer } from "../Productcomponets/filter-drawer";
import { usePathname, useRouter } from "next/navigation";
import { UserSidebar } from "./Sidebar";
import { NotificationSheet } from "./Notificationsheet";
import { Badge } from "@/components/ui/badge";
import { IoMdPin } from "react-icons/io";
import { HeaderTitle } from "./HeaderTitle";
import { IoBag } from "react-icons/io5";

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
        "fixed top-0 left-0 right-0 w-full bg-white px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden ",
        isVisible ? "translate-y-0" : "-translate-y-full"
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
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span>Hyderabad, India</span>
                <IoMdPin className="text-red-500" size={15} />
              </div>
            </div>
          ) : (
            <HeaderTitle />
          )}
        </div>

        <div className="flex items-center gap-2">
          <NotificationSheet />

          <Button
            onClick={() => router.push("/bag")}
            variant="outline"
            size="icon"
            className="rounded-md border border-gray-300 relative"
          >
            <IoBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-[#106C83] text-white border-2 border-white min-w-[1.25rem] h-5"
                variant="default"
              >
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>
        </div>
      </div>

      {(pathname === "/" || pathname.startsWith("/category/")) && (
        <div className="mt-4 flex w-full justify-between items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search (Eg: Threads)"
              className="pl-9 rounded-md border-gray-300 h-10 text-sm"
            />
          </div>
          {pathname.startsWith("/category/") && <FilterDrawer />}
        </div>
      )}
    </header>
  );
}
