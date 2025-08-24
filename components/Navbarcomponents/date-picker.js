"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment-timezone";

/**
 * Props:
 *  - selectedDate: ISO string (recommended) or Date | null
 *  - onDateSelect: (isoString: string) => void
 *  - minDate: ISO string or Date (optional) — days before this are disabled
 *  - placeholder: string (optional)
 *  - isMobile: boolean (optional)
 *  - timezone: string (optional) — defaults to "Asia/Kolkata"
 */
export function DatePicker({
  selectedDate,
  onDateSelect,
  minDate,
  placeholder,
  isMobile = false,
  timezone = "Asia/Kolkata",
}) {
  // Anchor the visible month to the selectedDate (if present), else to today
  const [currentMonth, setCurrentMonth] = useState(() => {
    const base = selectedDate ? moment(selectedDate) : moment();
    return base.tz(timezone).startOf("month").toDate();
  });

  // Keep currentMonth in sync if selectedDate changes externally
  useEffect(() => {
    if (selectedDate) {
      const m = moment.tz(selectedDate, timezone).startOf("month");
      setCurrentMonth(m.toDate());
    }
  }, [selectedDate, timezone]);

  const monthNames = useMemo(
    () => [
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
    ],
    [],
  );

  const startOfTodayLocal = useMemo(
    () => moment.tz(timezone).startOf("day").toDate(),
    [timezone],
  );

  // Normalize min boundary (if provided) to local start-of-day for comparisons
  const minBoundary = useMemo(() => {
    if (!minDate) return startOfTodayLocal;
    const m =
      typeof minDate === "string"
        ? moment.tz(minDate, timezone)
        : moment(minDate).tz(timezone);
    return m.startOf("day").toDate();
  }, [minDate, timezone, startOfTodayLocal]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 = Sunday

  const isDateDisabled = (dateObj) => {
    // dateObj is a plain JS Date at local midnight for the grid cell
    return dateObj < minBoundary;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const m = moment(prev).tz(timezone).startOf("month");
      const next = direction === "prev" ? m.subtract(1, "month") : m.add(1, "month");
      return next.toDate();
    });
  };

  const renderCalendar = () => {
    const mCurrent = moment(currentMonth).tz(timezone);
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10" />);
    }

    // Selected day as moment for reliable compare
    const mSelected =
      selectedDate != null
        ? moment.tz(selectedDate, timezone).startOf("day")
        : null;

    for (let day = 1; day <= daysInMonth; day++) {
      // Create a local (timezone-aware) moment at midnight for this cell
      const mCell = moment
        .tz(
          {
            year: mCurrent.year(),
            month: mCurrent.month(),
            day,
          },
          timezone,
        )
        .startOf("day");

      const dateObj = mCell.toDate(); // used for disabled compare only
      const isDisabled = isDateDisabled(dateObj);

      const isSelected =
        mSelected != null ? mCell.isSame(mSelected, "day") : false;

      const isToday = mCell.isSame(moment.tz(timezone).startOf("day"), "day");

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isDisabled) {
              // Emit ISO 8601 string with offset (timezone)
              const isoDate = mCell.format(); // e.g., 2025-08-26T00:00:00+05:30
              onDateSelect(isoDate);
            }
          }}
          disabled={isDisabled}
          aria-label={`Select ${mCell.format("YYYY-MM-DD")}`}
          className={[
            "w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm font-medium transition-colors flex items-center justify-center",
            isSelected
              ? "bg-black text-white"
              : isDisabled
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-black text-gray-700 hover:text-white",
            !isSelected && !isDisabled && isToday ? "border border-black" : "",
          ].join(" ")}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  return (
    <div className="relative">
      {/* Tooltip Arrow */}
      <div
        className={`absolute -top-1.5 md:-top-2 left-1/2 -translate-x-1/2 bg-white border-l border-t border-gray-200 rotate-45 z-10 ${
          isMobile ? "w-3 h-3" : "w-3 h-3 md:w-4 md:h-4"
        }`}
      />

      <div
        className={`bg-white border border-gray-200 rounded-2xl shadow-lg relative z-20 ${
          isMobile ? "p-4 w-72" : "p-4 md:p-6 w-72 md:w-80"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("prev")}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full hover:bg-gray-100"
            aria-label="Previous month"
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
            aria-label="Next month"
          >
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Weekdays */}
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

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

        {/* Optional placeholder / helper text */}
        {placeholder && (
          <div className="mt-3 text-[11px] md:text-xs text-gray-500 text-center">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
