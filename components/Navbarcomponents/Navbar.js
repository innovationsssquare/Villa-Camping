"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Mail,
  Search,
  ShoppingBag,
  User,
  Truck,
  BadgePercent,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Brandname from "@/public/Homeasset/Brandname.png";
import Brandimage from "@/public/Homeasset/Brandimage.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WishlistDialog } from "../Homecomponets/Wishlist";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaTag } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const { isVisible } = useScrollDirection();

  return (
    <div
      className={cn(
        "w-full fixed top-0  left-0 right-0 z-50 hidden md:block transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Top bar */}
      <div className="w-full bg-[#106C83] text-white px-4  py-2 flex items-center justify-between">
        <div className="flex items-center h-6 gap-2">
          <p className="text-xs">All your tailoring essential at one place!</p>
          <Separator orientation="vertical" />

          <Link href="/track" className="flex items-center text-xs">
            <Truck size={18} />
            Track Order
          </Link>
          <Separator orientation="vertical" />

          <Link href="/contact" className="flex items-center text-xs">
            <Mail className="h-4 w-4 mr-2" />
            brindah@gmail.com
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center">
              <span className="text-xs">$ USD</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>

            <div className="flex items-center">
              <span className="text-xs">English</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="w-full border-b bg-white border-gray-300 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="flex items-center ">
            <Image
              src={Brandimage}
              alt="Brandimage"
              className="object-contain h-14 w-14"
            />
            <Image
              src={Brandname}
              alt="Brandname"
              className="object-contain w-48"
            />
          </div>
        </Link>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="flex items-center rounded-md h-11  border border-gray-300">
            <div className="">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-full w-44 border-0 rounded-l-md rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fabrics">Fabrics</SelectItem>
                  <SelectItem value="threads">Threads</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator orientation="vertical" />

            <input
              type="text"
              placeholder="Search (eg: Threads)"
              className="flex-1 h-full border-0 py-2 px-4 focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="flex items-center bg-[#106C83] text-white px-5 py-2 h-full rounded-r-md focus:outline-none">
              <Search className="h-5 w-5" />
              <span className="ml-2 font-medium">Search</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <Link
            href="/account"
            className="flex flex-col items-center text-gray-700"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">My Account</span>
          </Link>

          <WishlistDialog />

          <Link
            href="/bag"
            className="flex flex-col items-center text-gray-700 relative"
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-[#EDC5C5] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
            <span className="text-xs mt-1">My Bag</span>
          </Link>
        </div>
      </div>

      {/* Navigation menu - Now sticky */}
      <div className="sticky  top-0 z-50 w-full border-b border-gray-300 px-4 py-3 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-[#106C83] text-sm">
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-[#106C83] text-sm"
          >
            About Us
          </Link>

         
          <DropdownMenu>
            <DropdownMenuTrigger>
              {" "}
              <p className="flex items-center text-gray-700 hover:text-[#106C83] text-sm">
                Categories
                <ChevronDown className="h-4 w-4 ml-1" />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"bg-white border-none"}>
              <DropdownMenuItem>  <Link
                  href="/category/fabrics"
                  className="block   text-gray-700 hover:bg-teal-50 hover:text-[#106C83] text-sm"
                >
                  Fabrics
                </Link></DropdownMenuItem>
              <DropdownMenuItem> <Link
                  href="/category/fabrics"
                  className="block   text-gray-700 hover:bg-teal-50 hover:text-[#106C83] text-sm"
                >
                 Threads
                </Link></DropdownMenuItem>
              <DropdownMenuItem> <Link
                  href="/category/Accessories"
                  className="block  text-gray-700 hover:bg-teal-50 hover:text-[#106C83] text-sm"
                >
                  Accessories
                </Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/eco-friendly"
            className="text-gray-700 hover:text-[#106C83] text-sm "
          >
            Eco - Friendly
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-[#106C83] text-sm"
          >
            Contact Us
          </Link>

          <Link
            href="/seller"
            className="flex items-center text-[#106C83] text-sm gap-2 font-semibold"
          >
           <FaTag color="#106C83" size={15}/>
           Become a Partner
          </Link>
        </div>

        <div className="flex items-center">
          <div className="bg-[#EDC5C55C] text-red-800 px-4 py-1 rounded-md flex items-center">
            <BiSolidOffer size={20} className="text-[#333333] mr-2" />
            <span className="text-[#333333] text-sm font-semibold">
              Christmas Offer Alert! Get 30% OFF on every purchase!
            </span>
            <Link href="/coupon" className="ml-4 text-[#106C83] text-sm font-semibold">
              Use Coupon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
