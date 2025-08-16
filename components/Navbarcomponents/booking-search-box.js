"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BsCalendar2CheckFill } from "react-icons/bs"
import { useScrollDirection } from "@/hooks/use-scroll-direction"

export function BookingSearchBox() {
  const [checkIn, setCheckIn] = useState()
  const [checkOut, setCheckOut] = useState()
  const { isVisible } = useScrollDirection()

  const router = useRouter()
  const handleSearch = () => {
    console.log({ checkIn, checkOut })
  }

  return (
    <div
      onClick={() => router.push("/search-stay")}
      className={`
        bg-[#FFFFFF4D] rounded-full border border-gray-300 shadow-sm p-1 flex justify-center items-center
        transition-all duration-300 ease-in-out transform-gpu
        ${isVisible ? "scale-100 opacity-100" : "scale-90 mt-1"}
      `}
    >
      {/* Check-in */}
      <div
        className={`
        flex-1 justify-center items-center px-4 py-2
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-70"}
      `}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
          <BsCalendar2CheckFill className="h-3 w-3 text-black" />
          Check in
        </div>
        {/* <DatePicker date={checkIn} onDateChange={setCheckIn} placeholder="Add dates" className="text-sm" /> */}
      </div>

      {/* Divider */}
      <div
        className={`
        w-px h-8 bg-gray-200
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-50"}
      `}
      />

      {/* Check-out */}
      <div
        className={`
        flex-1 px-4 py-2
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-70"}
      `}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
          <BsCalendar2CheckFill className="h-3 w-3 text-black" />
          Check out
        </div>
        {/* <DatePicker date={checkOut} onDateChange={setCheckOut} placeholder="Add dates" className="text-sm" /> */}
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        size="icon"
        className={`
          rounded-full bg-black hover:bg-[#0d5a6e] h-10 w-10 ml-2
          transition-all duration-300 ease-in-out transform-gpu
          ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-90"}
        `}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
