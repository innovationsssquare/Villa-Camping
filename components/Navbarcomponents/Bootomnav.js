"use client";
import { cn } from "@/lib/utils";
import { Tabs, Tab } from "@heroui/react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { usePathname } from "next/navigation";
import { RiHome5Fill } from "react-icons/ri";
import { IoGrid } from "react-icons/io5";
import { FaUser, FaPlay } from "react-icons/fa";
import { BsFillChatSquareHeartFill } from "react-icons/bs";

export function BottomNav() {
  const { isVisible } = useScrollDirection();
  const pathname = usePathname();

  const navItems = [
    {
      value: "/",
      icon: <RiHome5Fill className="h-5 w-5" />,
      label: "Home",
    },
    {
      value: "/category/all",
      icon: <IoGrid className="h-5 w-5" />,
      label: "Category",
    },
    {
      value: "/shorts",
      icon: <FaPlay className="h-6 w-6" />,
      label: "Shorts",
    },
    {
      value: "/booking",
      icon: <BsFillChatSquareHeartFill className="h-5 w-5" />,
      label: "Booking",
    },
    {
      value: "/account",
      icon: <FaUser className="h-5 w-5" />,
      label: "Profile",
    },
  ];

  return (
    <div
      className={cn(
        "fixed md:hidden bottom-0.5 left-0 right-0 mx-auto w-full px-4 z-40 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-20"
      )}
    >
      <Tabs
        aria-label="Bottom navigation"
        selectedKey={pathname}
        radius="full"
        className="w-full"
        classNames={{
          tabList:
            "h-14 z-20 w-full border border-gray-300 rounded-full p-1 bg-white",
          tab: "flex h-10 flex-1 flex-col items-center justify-center rounded-full data-[selected=true]:bg-transparent focus-visible:ring-0",
          cursor: "rounded-full border-gray-300 border backdrop-blur-2xl",
        }}
      >
        {navItems.map((item) => (
          <Tab
            key={item.value}
            title={
              <div className="flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-colors duration-400",
                    item.value === "/shorts" && pathname !== item.value
                      ? "p-3 text-white bg-black"
                      : ""
                  )}
                >
                  {item.icon}
                </div>
                <span className="sr-only">{item.label}</span>
              </div>
            }
            href={item.value} // 👈 directly link tab → route
          />
        ))}
      </Tabs>
    </div>
  );
}
