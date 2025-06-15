"use client";

import { Home, Gift, Heart, Recycle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { RiHome5Fill } from "react-icons/ri";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { IoGrid } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { RiRecycleFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { FaSyncAlt } from "react-icons/fa";

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("home");
  const { isVisible } = useScrollDirection();
  const router = useRouter();
  const pathname = usePathname();
  const [activeitem, setactiveitem] = useState();

  // useEffect(() => {
  //   switch (pathname) {
  //     case "/":
  //       setActiveTab("/");
  //       break;
  //     case "/account":
  //       setActiveTab("account");
  //       break;
  //     case "/category/all":
  //       setActiveTab("category/all");
  //       break;
  //     case "/wishlist":
  //       setActiveTab("wishlist");
  //       break;
  //     case "/eco-friendly":
  //       setActiveTab("eco-friendly");
  //       break;
  //     default:
  //       setActiveTab("/");
  //   }
  // }, [pathname]);

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("/");
    } else if (pathname === "/account") {
      setActiveTab("/account");
    } else if (pathname === "/wishlist") {
      setActiveTab("/wishlist");
    } else if (pathname === "/eco-friendly") {
      setActiveTab("/eco-friendly");
    } else if (
      pathname.startsWith("/category") ||
      pathname.startsWith("/products")
    ) {
      setActiveTab("/category/all");
    } else {
      setActiveTab("/"); // Or null, if you want no tab to be active on unknown pages like product details
    }
  }, [pathname]);

  // if (pathname.startsWith("/products/")) {
  //   return null;
  // }

  const navItems = [
    {
      value: "/",
      icon: <RiHome5Fill className="h-5 w-5" />,
      label: "Home",
    },
    {
      value: "/category/all",
      icon: <IoGrid className="h-5 w-5" />,
      label: "category",
    },
    {
      value: "/wishlist",
      icon: <FaHeart className="h-5 w-5" />,
      label: "Favorites",
    },
    {
      value: "/eco-friendly",
      icon: <FaSyncAlt className="h-5 w-5" />,
      label: "Recycle",
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
        "fixed md:hidden bottom-1 left-0 right-0 mx-auto w-full overflow-hidden   px-2 z-40 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-20"
      )}
    >
      <Tabs
        defaultValue="/"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="h-16 z-20 w-full border border-gray-300 rounded-full bg-white p-1 ">
          {navItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn(
                "flex  h-14  w-full flex-1 flex-col items-center justify-center  rounded-full data-[state=active]:bg-transparent",
                "focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              onClick={() => {
                setActiveTab(item.value);
                if (pathname !== item.value) {
                  router.push(item.value);
                }
              }}
            >
              <div
                className={cn(
                  "flex h-12    w-12 items-center justify-center rounded-full transition-colors duration-400",
                  activeTab === item.value
                    ? "categorygradient text-[#106C83] shadow-none"
                    : "text-gray-400"
                )}
              >
                {item.icon}
              </div>
              <span className="sr-only">{item.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
