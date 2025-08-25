"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa";

export function BookingSearchBox() {
  const {
    selectedCategoryId,
    checkin,
    checkout,
    selectedGuest,
    selectedCategoryName,
  } = useSelector((state) => state.booking);

  const { isVisible } = useScrollDirection();

  const router = useRouter();
 

  const formatDate = (date) => {
    if (!date) return "Add dates";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={() => router.push("/search-stay")}
      className={`
        bg-[#FFFFFF4D] rounded-full border border-gray-300 shadow-sm p-1 flex gap-2 justify-between w-full items-center
        transition-all duration-300 ease-in-out transform-gpu
        ${isVisible ? "scale-100 opacity-100" : "scale-90 mt-1"}
      `}
    >
      <div
        className={`
        flex-1 justify-center items-center  py-2 
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-70"}
      `}
      >
        <div className="flex justify-center items-center gap-2 text-xs font-medium text-gray-600 mb-1 ">
          <FaHome className="h-3 w-3 text-black" />
          {selectedCategoryName || "Category"}{" "}
        </div>
        {/* <DatePicker date={checkIn} onDateChange={setCheckIn} placeholder="Add dates" className="text-sm" /> */}
      </div>

      <div
        className={`
        w-px h-8 bg-gray-200
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-50"}
      `}
      />

      {/* Check-in */}
      <div
        className={`
        flex-1 justify-center items-center  py-2 
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-70"}
      `}
      >
        <div className="flex justify-center items-center gap-2 text-xs font-medium text-gray-600 mb-1 ">
          <BsCalendar2CheckFill className="h-3 w-3 text-black" />
          {formatDate(checkin)}
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
        flex-1  py-2
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-70"}
      `}
      >
        <div className="flex justify-center items-center gap-2 text-xs font-medium text-gray-600 mb-1">
          <BsCalendar2CheckFill className="h-3 w-3 text-black" />
          {formatDate(checkout)}
        </div>
        {/* <DatePicker date={checkOut} onDateChange={setCheckOut} placeholder="Add dates" className="text-sm" /> */}
      </div>

      {/* Search Button */}
      <Button
        size="icon"
        className={`
          rounded-full bg-black hover:bg-black h-10 w-10 ml-2
          transition-all duration-300 ease-in-out transform-gpu
          ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-90"}
        `}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
