"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function BookingSearchBox() {
  const [checkIn, setCheckIn] = useState()
  const [checkOut, setCheckOut] = useState()
const router=useRouter()
  const handleSearch = () => {
    console.log({ checkIn, checkOut })
  }

  return (
    <div onClick={()=>router.push("/date-selection")} className="bg-[#FFFFFF4D] rounded-full border border-gray-200 shadow-sm p-1 flex items-center">
      {/* Check-in */}
      <div className="flex-1 px-4 py-2">
        <div className="text-xs font-medium text-gray-600 mb-1">Check in</div>
        {/* <DatePicker date={checkIn} onDateChange={setCheckIn} placeholder="Add dates" className="text-sm" /> */}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200" />

      {/* Check-out */}
      <div className="flex-1 px-4 py-2">
        <div className="text-xs font-medium text-gray-600 mb-1">Check out</div>
        {/* <DatePicker date={checkOut} onDateChange={setCheckOut} placeholder="Add dates" className="text-sm" /> */}
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        size="icon"
        className="rounded-full bg-black hover:bg-[#0d5a6e] h-10 w-10 ml-2"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
