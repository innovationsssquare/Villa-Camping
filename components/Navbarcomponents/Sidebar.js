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

const navItems = [
  {
    title: "Profile Details",
    href: "/account",
    icon: <User className="h-5 w-5" />,
  },
  // {
  //   title: "About Us",
  //   href: "/about",
  //   icon: <User className="h-5 w-5" />,
  // },
  {
    title: "My Orders",
    href: "/account/orders",
    icon: <ShoppingBag className="h-5 w-5" />,

  },
  // {
  //   title: "Payment Methods",
  //   href: "/profile/payment",
  // },
  {
    title: "Settings",
    href: "/account/settings",
    icon: <SettingsIcon className="h-5 w-5" />,

  },
  {
    title: "Privacy Policy",
    href: "/account/privacy-policy",
    icon: <Shield className="h-5 w-5" />,

  },
  {
    title: "Help & Support",
    href: "/account/support",
    icon: <HelpCircle className="h-5 w-5" />,

  },
  {
    title: "Contact us",
    href: "/contact",
    icon: <PhoneCall className="h-5 w-5" />,

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
        <SheetContent side="left" className="w-[300px] p-0 border-none bg-[#F4F4F4]">
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
    <div className="flex flex-col items-center pt-8 pb-6 h-full bg-gray-50">
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
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full bg-[#106C83] text-white hover:bg-teal-700 h-8 w-8 shadow-md transition-all duration-200 group-hover:scale-110"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit Profile</span>
        </Button>
      </div>

      <h2 className="text-xl font-semibold mt-5 mb-8">Anita Sharma</h2>

      <nav className="w-full px-4 flex-1 ">
        <ul className="space-y-2 w-full divide-y divide-gray-200">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200",
                    isActive ? "bg-[#106C83] text-white shadow-md" : "hover:bg-gray-200 hover:translate-x-1",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn("transition-transform duration-200", isActive ? "text-white" : "text-gray-500")}
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
          className="flex items-center justify-between px-4 py-3 text-red-500 hover:bg-gray-200 hover:translate-x-1 rounded-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
