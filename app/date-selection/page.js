"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Sparkles, Calendar, Check } from "lucide-react";
import { Button, addToast } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCheckin, setCheckout } from "@/Redux/Slices/bookingSlice";
import { flushSync } from "react-dom";
import { HolidayCard } from "@/components/Searchdatescomponents/holiday-card";
import { useIndianHolidays } from "@/hooks/useIndianHolidays";
import moment from "moment-timezone";

export default function DatePickerPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { checkin, checkout } = useSelector((state) => state.booking);

  const [selectedCheckInDate, setSelectedCheckInDate] = useState(
    checkin ? new Date(checkin) : null
  );
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(
    checkout ? new Date(checkout) : null
  );

  const [currentMonth] = useState(new Date());
  const [selectedLwId, setSelectedLwId] = useState(null);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { longWeekends, holidayMap, isHoliday, getHolidayName, isLongWeekend } =
    useIndianHolidays(currentYear);

  const handleSelectLongWeekend = (lw) => {
    const [startYear, startMonth, startDay] = lw.startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = lw.endDate.split("-").map(Number);

    const checkIn = new Date(startYear, startMonth - 1, startDay);
    const checkOut = new Date(endYear, endMonth - 1, endDay);

    flushSync(() => {
      setSelectedCheckInDate(checkIn);
      setSelectedCheckOutDate(checkOut);
      setSelectedLwId(lw.id);
      dispatch(setCheckin(checkIn.toISOString()));
      dispatch(setCheckout(checkOut.toISOString()));
    });
  };

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year, month) =>
    new Date(year, month, 1).getDay();

  const handleDateClick = (date) => {
    const clickedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    flushSync(() => {
      if (!selectedCheckInDate || (selectedCheckInDate && selectedCheckOutDate)) {
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

  const handleSaveAndBack = () => {
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

    const calendarDays = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${month}-${i}`} className="h-11 w-full" />);
    }

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const isPast = currentDay.getTime() < todayMidnight.getTime();

      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const holidayName = holidayMap?.[dateKey];
      const isHolidayDate = Boolean(holidayName);
      const isLw = isLongWeekend(dateKey);

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

      const isRangeLeading = isCheckIn && selectedCheckOutDate;
      const isRangeTrailing = isCheckOut && selectedCheckInDate;

      calendarDays.push(
        <div
          key={`${month}-${day}`}
          className="relative h-11 w-full flex items-center justify-center"
          onClick={() => !isPast && handleDateClick(currentDay)}
        >
          {/* Continuous Airbnb Range Highlight Strip */}
          {(isInRange || isRangeLeading || isRangeTrailing) && (
            <div
              className={cn(
                "absolute inset-y-1 bg-neutral-100",
                isInRange && "inset-x-0",
                isRangeLeading && "left-1/2 right-0",
                isRangeTrailing && "left-0 right-1/2"
              )}
            />
          )}

          {/* Date Circle Button */}
          <button
            type="button"
            disabled={isPast}
            className={cn(
              "relative z-10 w-9 h-9 rounded-full flex flex-col items-center justify-center text-xs font-semibold transition-all duration-150 cursor-pointer",
              isPast && "text-neutral-300 cursor-not-allowed line-through",
              (isCheckIn || isCheckOut) && "bg-black text-white font-bold shadow-sm scale-105",
              isInRange && "text-neutral-900 font-semibold hover:bg-neutral-200",
              !isCheckIn && !isCheckOut && !isInRange && !isPast && "hover:bg-neutral-100 text-neutral-800"
            )}
          >
            <span>{day}</span>

            {/* Indian Holiday / Long weekend indicator */}
            {isHolidayDate && !isCheckIn && !isCheckOut && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white" />
            )}
            {!isHolidayDate && isLw && !isCheckIn && !isCheckOut && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500 ring-1 ring-white" />
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="mb-6 px-4">
        <h2 className="text-base font-bold text-neutral-900 mb-3">
          {monthName} {year}
        </h2>
        <div className="grid grid-cols-7 gap-y-1">{calendarDays}</div>
      </div>
    );
  };

  const monthsToRender = useMemo(() => {
    const months = [];
    for (let i = 0; i < 6; i++) {
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
      <header className="flex items-center justify-between py-3 px-4 border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-2">
          <Button onPress={() => router.back()} variant="light" isIconOnly>
            <ChevronLeft className="h-5 w-5 text-neutral-800" />
          </Button>
          <h1 className="text-base font-bold text-neutral-900">
            Select Stay Dates
          </h1>
        </div>

        {(selectedCheckInDate || selectedCheckOutDate) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCheckInDate(null);
              setSelectedCheckOutDate(null);
              dispatch(setCheckin(null));
              dispatch(setCheckout(null));
            }}
            className="text-xs font-semibold text-neutral-600 hover:text-black underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </header>

      {/* Long Weekends Strip */}
      {longWeekends && longWeekends.length > 0 && (
        <div className="py-2.5 px-4 border-b border-neutral-150 bg-amber-50/40 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Upcoming Indian Long Weekends ({longWeekends.length})
            </span>
            <span className="text-[11px] text-amber-700 font-medium">Tap to auto-select</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {longWeekends.map((lw) => {
              const startFmt = new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
              }).format(new Date(lw.startDate));
              const endFmt = new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
              }).format(new Date(lw.endDate));

              return (
                <HolidayCard
                  key={lw.id}
                  type={`${lw.totalDays} Days in a row`}
                  totalDays={lw.totalDays}
                  dateRange={`${startFmt} - ${endFmt}`}
                  name={lw.holidayNames[0] || "Long Weekend"}
                  isSelected={selectedLwId === lw.id}
                  onClick={() => handleSelectLongWeekend(lw)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 py-2.5 px-4 text-center text-xs font-bold text-neutral-400 uppercase border-b border-neutral-150 shrink-0">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto pt-4 pb-32">
        {monthsToRender.map((monthDate, index) => (
          <div key={index}>{renderMonth(monthDate)}</div>
        ))}
      </div>

      {/* Bottom Fixed Bar (Airbnb Floating Action) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-5 py-3.5 z-50 flex items-center justify-between shadow-lg">
        <div>
          <div className="text-xs text-neutral-500 font-medium">
            {numberOfNights > 0
              ? `${numberOfNights} ${numberOfNights === 1 ? "night" : "nights"}`
              : selectedCheckInDate
              ? "Select checkout date"
              : "Select check-in date"}
          </div>
          <div className="text-sm font-bold text-neutral-900 mt-0.5">
            {formatDateDisplay(selectedCheckInDate)} – {formatDateDisplay(selectedCheckOutDate)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAndBack}
          disabled={!selectedCheckInDate || !selectedCheckOutDate}
          className="bg-black hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3 rounded-full cursor-pointer transition-all shadow-md active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
}
