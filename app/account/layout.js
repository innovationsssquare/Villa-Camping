"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Myaccout from '@/public/Homeasset/Myaccout.png'
import Myaccount2 from '@/public/Homeasset/Myaccount2.png'
import user from '@/public/Homeasset/user.png'
import Aboutusheader from "@/components/Aboutuscomponets/Aboutusheader";
import { useParams } from "next/navigation";
export default function AccountLayout({ children }) {
  const [activeItem, setActiveItem] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params=useParams()
  const menuItems = [
    { id: "profile", label: "Profile Details", href: "/account" },
    { id: "orders", label: "My Orders", href: "/account/orders" },
    // { id: "payment", label: "Payment Methods", href: "/account/payment" },
    { id: "settings", label: "Settings", href: "/account/settings" },
    { id: "privacy", label: "Privacy Policy", href: "/account/privacy-policy" },
    { id: "support", label: "Help & Support", href: "/account/support" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
     <Aboutusheader
        image1={Myaccout}
        image2={Myaccount2}
        title={"My Account"}
      />
    <div className="md:flex w-full md:px-8 md:gap-8  flex-col py-8 md:flex-row ">
    
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden md:block w-80 flex-shrink-0 flex-col   transform transition-transform duration-200 ease-in-out"
        )}
      >
  
        {/* User profile section */}
        <div className="flex flex-col items-center rounded-t-2xl  p-6 bg-muted/50 bg-[#F4F4F4]">
          <div className="relative mb-2">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={user}
                alt="Anita Sharma"
              />
            </Avatar>
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              Edit
            </Button>
          </div>
          <h2 className="text-xl font-semibold mt-4">Anita Sharma</h2>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1  overflow-y-auto rounded-b-2xl bg-[#F4F4F4]">
          <ul className="py-2 px-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between py-3 px-6 hover:bg-muted/70 transition-colors",
                    activeItem === item.id && "bg-[#106C83] rounded-lg text-white font-medium"
                  )}
                  onClick={() => {
                    setActiveItem(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/logout"
                className="flex items-center justify-between py-3 px-6 text-red-500 hover:bg-muted/70 hover:text-red-600 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span>Log Out</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="md:flex-1 w-full">{children}</main>
    </div>
    </>
  );
}
