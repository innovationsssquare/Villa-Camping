"use client";
import { cn } from "@/lib/utils";
import { Tabs, Tab } from "@heroui/react";
import { useEffect, useState } from "react";
import { RiHome5Fill } from "react-icons/ri";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { IoGrid } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BsFillChatSquareHeartFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { DiBootstrap } from "react-icons/di";
import { IoMdBookmarks } from "react-icons/io";

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("home");
  const { isVisible } = useScrollDirection();
  const router = useRouter();
  const pathname = usePathname();
  const [activeitem, setactiveitem] = useState();

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("/");
    } else if (pathname === "/account") {
      setActiveTab("/account");
    } else if (pathname === "/shorts") {
      setActiveTab("/shorts");
    } else if (pathname === "/booking") {
      setActiveTab("/booking");
    } else if (
      pathname.startsWith("/category") ||
      pathname.startsWith("/products")
    ) {
      setActiveTab("/category/all");
    } else {
      setActiveTab("/"); // Or null, if you want no tab to be active on unknown pages like product details
    }
  }, [pathname]);

  const navItems = [
    {
      value: "/",
      icon: <RiHome5Fill className="h-6 w-6" />,
      label: "Home",
    },
    {
      value: "/category/all",
      icon: <IoGrid className="h-6 w-6" />,
      label: "category",
    },
    {
      value: "/shorts",
      icon: <FaPlay size={24} className="h-6 w-6" />,
      label: "Favorites",
    },
    {
      value: "/booking",
      icon: <BsFillChatSquareHeartFill className="h-6 w-6" />,
      label: "Recycle",
    },
    {
      value: "/account",
      icon: <FaUser className="h-6 w-6" />,
      label: "Profile",
    },
  ];

  return (
    <div
      className={cn(
        "fixed md:hidden bottom-0.5 left-0 right-0 mx-auto w-full overflow-hidden   px-4 z-40 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-20"
      )}
    >
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
        className="w-full"
        classNames={{
          tabList:
          "h-14 z-20 w-full border border-gray-300 rounded-full  p-1 bg-white",
          tab: "flex h-10 w-full flex-1 flex-col items-center justify-center rounded-full data-[selected=true]:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
          cursor: "rounded-full border-gray-300 border backdrop-blur-2xl ",
        }}
      >
        {navItems.map((item) => (
          <Tab
            key={item.value}
            title={
              <div
                className="w-full h-full flex flex-col items-center justify-center"
                onClick={() => {
                  setActiveTab(item.value);
                  if (pathname !== item.value) {
                    router.push(item.value);
                  }
                }}
              >
                <div
                  className={cn(
                    "flex   items-center justify-center rounded-full transition-colors duration-400",

                    item.value === "/shorts" && activeTab !== item.value
                      ? " p-3 text-white bg-black "
                      : ""
                  )}
                >
                  <span>{item.icon}</span>
                </div>

                <span className="sr-only">{item.label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
