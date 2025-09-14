"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  CreditCard,
  SettingsIcon,
  Shield,
  HelpCircle,
  LogOut,
  Pencil,
  PhoneCall,
  X,
  Phone,
} from "lucide-react";
import { TiThMenu } from "react-icons/ti";
import { FaUser } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdHelp } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  MessageCircle,
  Bell,
  MapPin,
  Heart,
  Gift,
  Users,
  Calendar,
  ChevronRight,
  DollarSign,
  Settings,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Menu,
} from "lucide-react";
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
    href: "/booking",
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
        <SheetTrigger asChild>
          <Button variant="ghost" className="rounded-full">
            <TiThMenu size={24} className="-ml-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] p-0 bg-gray-50 border-none"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 pt-12">
              <Card className="bg-black/90 border-0 text-white p-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback className="bg-gray-300 text-black font-semibold">
                        S
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-sm font-semibold">Hi santosh</h2>
                      <p className="text-blue-100 text-xs">
                        santosh.sa40@gmail.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4">
              <Card className="shadow-none border border-gray-300 rounded-2xl p-0">
                <CardContent className="p-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <User className="h-5 w-5 text-black fill-black" />
                      </div>
                      <span className="text-xs text-center text-gray-600  font-semibold">
                        My Account
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <MessageCircle className="h-5 w-5 text-black fill-black" />
                      </div>
                      <span className="text-xs text-center text-gray-600 font-semibold">
                        Support
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 relative">
                      <div className="p-3 bg-gray-100 rounded-full relative">
                        <Bell className="h-5 w-5 text-black fill-black" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-center text-gray-600 font-semibold">
                        Notifications
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-gray-300 rounded-2xl p-0">
                <CardContent className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-3">My Trips</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-semibold">
                          View/Manage Trips
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-semibold">
                          Wishlist
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-gray-300 rounded-2xl p-0">
                <CardContent className="p-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden">
                      <img
                        src="/house-property-hosting.jpg"
                        alt="Hosting"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        Get Started with Hosting
                      </h4>
                      <p className="text-xs text-gray-600">
                        List your property & earn extra income
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-gray-300 rounded-2xl p-0">
                <CardContent className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-semibold">Contact us</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-semibold">Privacy Policy</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-semibold">
                         Terms & Conditions
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="shadow-none border border-gray-300 rounded-2xl p-0">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-8 rounded-sm overflow-hidden">
                          <div className="h-2 bg-orange-500"></div>
                          <div className="h-2 bg-white"></div>
                          <div className="h-2 bg-green-500"></div>
                        </div>
                        <div>
                          <span className="text-gray-700">Country</span>
                          <p className="text-sm text-gray-500">India</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <span className="text-gray-700">Currency</span>
                          <p className="text-sm text-gray-500">INR</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">
                          Communication Preferences
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              <Card className="shadow-none border border-gray-300 rounded-2xl p-0 mb-2">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    Show us your love & follow
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Instagram className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 text-xs font-semibold">Instagram</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-black rounded-lg flex items-center justify-center">
                          <X className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 text-xs font-semibold">X</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-semibold text-xs">LinkedIn</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Facebook className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-semibold text-xs">Facebook</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

           
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
