"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DatePicker({ selectedDate, onDateSelect, minDate, placeholder, isMobile = false }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date) => {
    if (minDate) {
      return date < minDate
    }
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      const isDisabled = isDateDisabled(date)

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onDateSelect(date)}
          disabled={isDisabled}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm font-medium transition-colors ${
            isSelected
              ? "bg-red-500 text-white"
              : isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-red-50 text-gray-700"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  return (
    <div className="relative">
      {/* Tooltip Arrow - Responsive sizing and positioning */}
      <div
        className={`absolute -top-1.5 md:-top-2 left-1/2 transform -translate-x-1/2 bg-white border-l border-t border-gray-200 rotate-45 z-10 ${
          isMobile ? "w-3 h-3" : "w-3 h-3 md:w-4 md:h-4"
        }`}
      ></div>

      <div
        className={`bg-white border border-gray-200 rounded-2xl shadow-lg relative z-20 ${
          isMobile ? "p-4 w-72" : "p-4 md:p-6 w-72 md:w-80"
        }`}
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("prev")}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <h3 className="font-semibold text-gray-900 text-sm md:text-base">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("next")}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="w-8 h-6 md:w-10 md:h-8 flex items-center justify-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      </div>
    </div>
  )
}
