"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  CreditCard,
  SettingsIcon,
  Shield,
  HelpCircle,
  LogOut,
  Pencil,
  PhoneCall
} from "lucide-react"
import { TiThMenu } from "react-icons/ti";
import { FaUser } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdHelp } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const navItems = [
  {
    title: "Profile Details",
    href: "/account",
    icon: <FaUser className="h-5 w-5" />,
  },
  // {
  //   title: "About Us",
  //   href: "/about",
  //   icon: <User className="h-5 w-5" />,
  // },
  {
    title: "My Booking",
    href: "/account/orders",
    icon: <FaBook className="h-5 w-5" />,

  },
  // {
  //   title: "Payment Methods",
  //   href: "/profile/payment",
  // },
  {
    title: "Settings",
    href: "/account/settings",
    icon: <IoSettings className="h-5 w-5 " />,

  },
  {
    title: "Privacy Policy",
    href: "/account/privacy-policy",
    icon: <IoShieldCheckmark className="h-5 w-5 " />,

  },
  {
    title: "Help & Support",
    href: "/account/support",
    icon: <MdHelp className="h-5 w-5 " />,

  },
  {
    title: "Contact us",
    href: "/contact",
    icon: <FaPhoneAlt className="h-5 w-5 " />,

  },
];

export function UserSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sheet when route changes (mobile only)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" className="rounded-full">
            <TiThMenu size={24} className="-ml-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0 border-none bg-[#FFFFFF4D] backdrop-blur-2xl">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="w-[300px] border-r h-screen">
          <SidebarContent pathname={pathname} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ pathname }) {
  return (
    <div className="flex flex-col items-center pt-8 pb-6 h-full bg-[#FFFFFF4D]">
      <div className="relative group">
        <Avatar
          className="w-24 h-24 border-2 border-white transition-transform group-hover:scale-105"
          style={{ backgroundColor: "#F8D347" }}
        >
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xW1n9mtRQ1Cnd53Nk8YuryoGCgjk7d.png"
            alt="Anita Sharma"
          />
          <AvatarFallback style={{ backgroundColor: "#F8D347" }}>AS</AvatarFallback>
        </Avatar>
       
      </div>

      <h2 className="text-xl font-semibold mt-5 mb-8">Santosh Alimkar</h2>

      <nav className="w-full px-4 flex-1 ">
        <ul className="space-y-2 w-full ">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200",
                    isActive ? "bg-black text-white shadow-md" : "hover:bg-gray-200 hover:translate-x-1",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn("transition-transform duration-200", isActive ? "text-white" : "text-black")}
                    >
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive ? "translate-x-0" : "group-hover:translate-x-1",
                    )}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="w-full px-4 mt-auto">
        <Link
          href="/logout"
          className="flex items-center justify-between px-4 py-3 text-red-500 bg-[#FFFFFF4D] hover:translate-x-1 rounded-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <IoLogOut className="h-5 w-5" />
            <span>Log Out</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
