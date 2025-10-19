"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button ,addToast} from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCheckin, setCheckout } from "@/Redux/Slices/bookingSlice";
import { flushSync } from "react-dom";

export default function DatePickerPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ get values from Redux
  const { checkin, checkout } = useSelector((state) => state.booking);

  // ✅ initialize local state from Redux
  const [selectedCheckInDate, setSelectedCheckInDate] = useState(
    checkin ? new Date(checkin) : null
  );
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(
    checkout ? new Date(checkout) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    );
  }, []);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // const handleDateClick = (date) => {
  //   const clickedDate = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate()
  //   );

  //   if (!selectedCheckInDate || (selectedCheckInDate && selectedCheckOutDate)) {
  //     setSelectedCheckInDate(clickedDate);
  //     setSelectedCheckOutDate(null);
  //     dispatch(setCheckin(clickedDate.toISOString())); // ✅ save in Redux
  //     dispatch(setCheckout(null));
  //   } else if (selectedCheckInDate) {
  //     if (clickedDate.getTime() < selectedCheckInDate.getTime()) {
  //       setSelectedCheckInDate(clickedDate);
  //       setSelectedCheckOutDate(null);
  //       dispatch(setCheckin(clickedDate.toISOString()));
  //       dispatch(setCheckout(null));
  //     } else if (clickedDate.getTime() === selectedCheckInDate.getTime()) {
  //       setSelectedCheckInDate(null);
  //       setSelectedCheckOutDate(null);
  //       dispatch(setCheckin(null));
  //       dispatch(setCheckout(null));
  //     } else {
  //       setSelectedCheckOutDate(clickedDate);
  //       dispatch(setCheckout(clickedDate.toISOString())); // ✅ save in Redux
  //     }
  //   }
  // };
  const handleDateClick = (date) => {
    const clickedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    flushSync(() => {
      // all setState and dispatch inside flushSync run immediately
      if (
        !selectedCheckInDate ||
        (selectedCheckInDate && selectedCheckOutDate)
      ) {
        setSelectedCheckInDate(clickedDate);
        setSelectedCheckOutDate(null);
        dispatch(setCheckin(clickedDate.toISOString()));
        dispatch(setCheckout(null));
      } else if (selectedCheckInDate) {
        if (clickedDate.getTime() < selectedCheckInDate.getTime()) {
          setSelectedCheckInDate(clickedDate);
          setSelectedCheckOutDate(null);
          dispatch(setCheckin(clickedDate.toISOString()));
          dispatch(setCheckout(null));
        } else if (clickedDate.getTime() === selectedCheckInDate.getTime()) {
          setSelectedCheckInDate(null);
          setSelectedCheckOutDate(null);
          dispatch(setCheckin(null));
          dispatch(setCheckout(null));
        } else {
          setSelectedCheckOutDate(clickedDate);
          dispatch(setCheckout(clickedDate.toISOString()));
        }
      }
    });
  };

  const handleNext = () => {
    if (!selectedCheckInDate || !selectedCheckOutDate) {
       addToast({
        title: "Please select both check-in and check-out dates",
        color: "danger",
      });
      return;
    }
    router.back();
  };

  const numberOfNights = useMemo(() => {
    if (selectedCheckInDate && selectedCheckOutDate) {
      const diffTime = Math.abs(
        selectedCheckOutDate.getTime() - selectedCheckInDate.getTime()
      );
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [selectedCheckInDate, selectedCheckOutDate]);

  const tooltipText = useMemo(() => {
    if (!selectedCheckInDate) return "Select Check-in Date";
    if (!selectedCheckOutDate) return "Select Check-out Date";
    return `${numberOfNights} Total Nights`;
  }, [selectedCheckInDate, selectedCheckOutDate, numberOfNights]);

  const tooltipPositionClass = useMemo(() => {
    if (!selectedCheckInDate) return "left-[25%] -translate-x-1/2";
    if (selectedCheckInDate && !selectedCheckOutDate)
      return "left-[75%] -translate-x-1/2";
    return "left-1/2 -translate-x-1/2";
  }, [selectedCheckInDate, selectedCheckOutDate]);

  const formatDateDisplay = (date) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
        }).format(date)
      : "-";

  const renderMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const startDayIndex = firstDay === 0 ? 6 : firstDay - 1;

    const calendarDays = [];

    for (let i = 0; i < startDayIndex; i++) {
      calendarDays.push(
        <div
          key={`empty-${month}-${i}`}
          className="h-12 w-12  flex items-center justify-center"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;

      const isCheckIn =
        selectedCheckInDate &&
        currentDay.toDateString() === selectedCheckInDate.toDateString();
      const isCheckOut =
        selectedCheckOutDate &&
        currentDay.toDateString() === selectedCheckOutDate.toDateString();
      const isInRange =
        selectedCheckInDate &&
        selectedCheckOutDate &&
        currentDay.getTime() > selectedCheckInDate.getTime() &&
        currentDay.getTime() < selectedCheckOutDate.getTime();

      calendarDays.push(
        <div
          key={`${month}-${day}`}
         className={cn(
            "aspect-square flex items-center justify-center text-sm border border-gray-200 cursor-pointer",
            isWeekend ? "text-red-500" : "text-gray-800",
            isCheckIn && "bg-black text-white rounded-full",
            isCheckOut && "bg-black text-white rounded-full",
            isInRange && "bg-gray-200 text-black border border-white",
          )}
          onClick={() => handleDateClick(currentDay)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 ">
          {monthName} {year}
        </h2>
        <div className="grid grid-cols-7 gap-0.5">{calendarDays}</div>
      </div>
    );
  };

  const monthsToRender = useMemo(() => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + i,
        1
      );
      months.push(date);
    }
    return months;
  }, [currentMonth]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header */}
      <header className="flex items-center justify-between py-3  border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button onPress={() => router.back()} variant="light" isIconOnly>
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </Button>{" "}
          <h1 className="text-md font-semibold text-gray-800">
            Select Check-In Date
          </h1>
        </div>
      </header>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-0.5 py-3 text-center text-sm font-medium border-b border-gray-200">
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={cn(index >= 5 ? "text-red-500" : "text-gray-600")}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto p-1 pb-28">
        {monthsToRender.map((monthDate, index) => (
          <div key={index}>{renderMonth(monthDate)}</div>
        ))}
      </div>

      {/* Bottom Fixed Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-1 z-[200] shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.1),_0_-2px_4px_-2px_rgb(0_0_0_/_0.1)]">
        <div className="relative">
          {/* Tooltip */}
          <div
            className={cn(
              "absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg pointer-events-none opacity-100 scale-100 transition-all duration-300 ease-out",
              tooltipPositionClass
            )}
          >
            {tooltipText}
            <div className="absolute left-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black -translate-x-1/2"></div>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between rounded-lg p-2">
            <div
              className={cn(
                "flex-1 rounded-md p-2 text-sm font-medium text-gray-800 transition-colors duration-300",
                selectedCheckInDate && !selectedCheckOutDate
                  ? "bg-blue-100"
                  : "bg-gray-200"
              )}
            >
              Check-In Date
              <div className="text-md font-bold">
                {formatDateDisplay(selectedCheckInDate)}
              </div>
            </div>

            <div className="mx-2 bg-black p-2 text-white text-xs rounded-full transition-all duration-300">
              {numberOfNights} {numberOfNights === 1 ? "Night" : "Nights"}
            </div>

            <div
              className={cn(
                "flex-1 rounded-md p-2 text-sm font-medium text-gray-800 transition-colors duration-300",
                selectedCheckInDate && selectedCheckOutDate
                  ? "bg-blue-100"
                  : "bg-gray-200"
              )}
            >
              Check-Out Date
              <div className="text-md font-bold">
                {formatDateDisplay(selectedCheckOutDate)}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Next button - always clickable */}
        <Button
          onPress={handleNext}
          className="w-full py-3 text-base font-semibold bg-black text-white rounded-lg active:scale-[0.98] transition-transform duration-150 z-[300]"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
}
