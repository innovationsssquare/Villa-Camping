"use client"

import { useState, useEffect } from "react"
import { Search, Globe, Menu, User, Home, Lightbulb, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import Logo  from "../../public/Loginasset/Logo.png"
import Image from "next/image";
export default function AirbnbNavbar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const { isVisible ,setIsVisible} = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Expand when scrolled down more than 100px
      setIsExpanded(currentScrollY < 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-500 ease-in-out ${
        isVisible ? "h-48" : "h-16"
      } overflow-hidden`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Top row - Logo and right side menu */}
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Image src={Logo} alt="Thevillacamp" className="h-14 w-14 object-contain"/>
              <span className="text-black italic font-bold text-xl hidden sm:block">Thevillacamp</span>
            </div>
          </div>

          {/* Center search - minimized state (only visible when not expanded) */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
              !isVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 pointer-events-none translate-y-4"
            }`}
          >
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center px-4 py-2">
                <Home className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-800">Anywhere</span>
              </div>
              <div className="border-l border-gray-300 h-6"></div>
              <div className="flex items-center px-4 py-2">
                <span className="text-sm font-medium text-gray-800">Anytime</span>
              </div>
              <div className="border-l border-gray-300 h-6"></div>
              <div className="flex items-center px-4 py-2">
                <span className="text-sm text-gray-600">Add guests</span>
              </div>
              <div onClick={()=>setIsVisible(!isVisible)} className="bg-black italic rounded-full p-2 m-1">
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-800 hidden md:block cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
              Become a host
            </span>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-1 border border-gray-300 rounded-full p-1 cursor-pointer hover:shadow-md transition-shadow">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Menu className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation tabs and expanded search (only visible when expanded) */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {/* Navigation tabs */}
          <div className="flex items-center justify-center space-x-8 pb-2">
            <div className="flex items-center space-x-2 cursor-pointer border-b-2 border-gray-800 pb-3">
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Homes</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-3 transition-colors">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Experiences</span>
              <span className="bg-black italic text-white text-xs px-1.5 py-0.5 rounded font-medium">NEW</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-3 transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
              <span className="text-sm font-medium">Services</span>
              <span className="bg-black italic text-white text-xs px-1.5 py-0.5 rounded font-medium">NEW</span>
            </div>
          </div>

          {/* Expanded search form */}
          <div className="pb-2">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg max-w-4xl mx-auto">
              <div className="flex-1 px-4 py-3 border-r border-gray-300 rounded-l-full hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-xs font-semibold text-gray-800 mb-1">Where</div>
                <div className="text-sm text-gray-500">Search destinations</div>
              </div>
              <div className="flex-1 px-4 py-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-xs font-semibold text-gray-800 mb-1">Check in</div>
                <div className="text-sm text-gray-500">Add dates</div>
              </div>
              <div className="flex-1 px-4 py-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-xs font-semibold text-gray-800 mb-1">Check out</div>
                <div className="text-sm text-gray-500">Add dates</div>
              </div>
              <div className="flex-1 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-r-full">
                <div className="text-xs font-semibold text-gray-800 mb-1">Who</div>
                <div className="text-sm text-gray-500">Add guests</div>
              </div>
              <div className="bg-black italic rounded-full p-3 m-1 cursor-pointer hover:bg-red-600 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
