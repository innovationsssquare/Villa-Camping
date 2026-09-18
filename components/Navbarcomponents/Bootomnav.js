"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import {
  Home,
  Compass,
  Play,
  CalendarCheck,
  User,
} from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isVisible } = useScrollDirection();
  const { selectedCategoryName } = useSelector((state) => state.booking || {});

  // Determine active item from route
  const getActiveTab = (path) => {
    if (path === "/") return "home";
    if (path.startsWith("/category") || path.startsWith("/products") || path === "/explore") return "stays";
    if (path.startsWith("/shorts")) return "shorts";
    if (path.startsWith("/booking")) return "bookings";
    if (path.startsWith("/account")) return "profile";
    return "home";
  };

  const [activeTab, setActiveTab] = useState(() => getActiveTab(pathname));

  useEffect(() => {
    setActiveTab(getActiveTab(pathname));
  }, [pathname]);

  const targetCategoryPath = selectedCategoryName
    ? `/category/${selectedCategoryName.toLowerCase()}`
    : "/category/villa";

  const navItems = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      id: "stays",
      label: "Stays",
      path: targetCategoryPath,
      icon: Compass,
    },
    {
      id: "shorts",
      label: "Shorts",
      path: "/shorts",
      icon: Play,
      isSpecial: true,
    },
    {
      id: "bookings",
      label: "Bookings",
      path: "/booking",
      icon: CalendarCheck,
    },
    {
      id: "profile",
      label: "Profile",
      path: "/account",
      icon: User,
    },
  ];

  const handleItemClick = (item) => {
    setActiveTab(item.id);
    if (pathname !== item.path) {
      router.push(item.path);
    }
  };

  return (
    <div
      className={cn(
        "fixed md:hidden bottom-2 left-0 right-0 mx-auto w-[94%] max-w-md z-50 transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}
    >
      <nav className="relative flex items-center justify-between px-2 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-full text-xs transition-colors duration-200 cursor-pointer select-none",
                isActive ? "text-[#ff6900] font-bold" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {/* Active pill indicator background */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-0 rounded-full bg-orange-50/90 border border-orange-200/60 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}

              {/* Icon Container with custom styling for Shorts */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-200",
                  item.isSpecial && !isActive && "bg-neutral-900 text-white shadow-2xs",
                  item.isSpecial && isActive && "bg-[#ff6900] text-white shadow-xs scale-105"
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 transition-transform",
                    isActive && !item.isSpecial && "scale-110 text-[#ff6900]",
                    item.isSpecial && "w-3.5 h-3.5 fill-current ml-0.5"
                  )}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] tracking-tight leading-tight mt-0.5 transition-colors font-medium",
                  isActive ? "text-[#ff6900] font-bold" : "text-neutral-600"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
