"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment-timezone";

export function DualDatePicker({
  checkinDate,
  checkoutDate,
  onCheckinSelect,
  onCheckoutSelect,
  minDate,
  isMobile = false,
  timezone = "Asia/Kolkata",
  onClose,
  focusedSide,
  setFocusedSide
}) {
  const [leftMonth, setLeftMonth] = useState(() => {
    const base = checkinDate ? moment(checkinDate) : moment();
    return base.tz(timezone).startOf("month").toDate();
  });

  const [rightMonth, setRightMonth] = useState(() => {
    const base = checkinDate ? moment(checkinDate) : moment();
    return base.tz(timezone).add(1, "month").startOf("month").toDate();
  });

  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    if (checkinDate && !checkoutDate) {
      setFocusedSide("checkout");
    } else if (!checkinDate) {
      setFocusedSide("checkin");
    }
  }, [checkinDate, checkoutDate]);

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
    []
  );

  const startOfTodayLocal = useMemo(
    () => moment.tz(timezone).startOf("day").toDate(),
    [timezone]
  );

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
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isDateDisabled = (dateObj, isCheckout = false) => {
    if (dateObj < minBoundary) return true;
    if (isCheckout && checkinDate) {
      return dateObj <= new Date(checkinDate);
    }
    return false;
  };

  const isDateInRange = (dateObj) => {
    if (!checkinDate) return false;

    const mStart = moment.tz(checkinDate, timezone).startOf("day");
    const mCurrent = moment(dateObj).tz(timezone).startOf("day");

    if (checkoutDate) {
      const mEnd = moment.tz(checkoutDate, timezone).startOf("day");
      return mCurrent.isBetween(mStart, mEnd, "day", "[]");
    }

    if (hoveredDate && focusedSide === "checkout") {
      const mHovered = moment(hoveredDate).tz(timezone).startOf("day");
      if (mHovered.isAfter(mStart)) {
        return mCurrent.isBetween(mStart, mHovered, "day", "[]");
      }
    }

    return false;
  };

  const navigateMonth = (direction, side) => {
    if (side === "left") {
      setLeftMonth((prev) => {
        const m = moment(prev).tz(timezone).startOf("month");
        const next =
          direction === "prev" ? m.subtract(1, "month") : m.add(1, "month");
        const newDate = next.toDate();

        // Ensure right month is always after left month
        const rightMoment = moment(rightMonth).tz(timezone).startOf("month");
        if (next.isSameOrAfter(rightMoment)) {
          setRightMonth(next.add(1, "month").toDate());
        }

        return newDate;
      });
    } else {
      setRightMonth((prev) => {
        const m = moment(prev).tz(timezone).startOf("month");
        const next =
          direction === "prev" ? m.subtract(1, "month") : m.add(1, "month");
        const newDate = next.toDate();

        // Ensure right month is always after left month
        const leftMoment = moment(leftMonth).tz(timezone).startOf("month");
        if (next.isSameOrBefore(leftMoment)) {
          setLeftMonth(leftMoment.subtract(1, "month").toDate());
        }

        return newDate;
      });
    }
  };

  const handleDateClick = (mCell, isCheckout = false) => {
    const isoDate = mCell.format();

    if (isCheckout || (checkinDate && focusedSide === "checkout")) {
      onCheckoutSelect(isoDate);
      setFocusedSide("checkin");
      if (onClose) onClose();
    } else {
      onCheckinSelect(isoDate);
      setFocusedSide("checkout");
    }
  };

  const renderCalendar = (currentMonth, isRightSide = false) => {
    const mCurrent = moment(currentMonth).tz(timezone);
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10" />);
    }

    const mCheckin = checkinDate
      ? moment.tz(checkinDate, timezone).startOf("day")
      : null;
    const mCheckout = checkoutDate
      ? moment.tz(checkoutDate, timezone).startOf("day")
      : null;

    for (let day = 1; day <= daysInMonth; day++) {
      const mCell = moment
        .tz(
          {
            year: mCurrent.year(),
            month: mCurrent.month(),
            day,
          },
          timezone
        )
        .startOf("day");

      const dateObj = mCell.toDate();
      const isDisabled = isDateDisabled(dateObj, isRightSide);
      const isCheckinDate = mCheckin ? mCell.isSame(mCheckin, "day") : false;
      const isCheckoutDate = mCheckout ? mCell.isSame(mCheckout, "day") : false;
      const isInRange = isDateInRange(dateObj);
      const isToday = mCell.isSame(moment.tz(timezone).startOf("day"), "day");

      let buttonClasses = [
        "w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm font-medium transition-all duration-200 flex items-center justify-center relative",
      ];

      if (isDisabled) {
        buttonClasses.push("text-gray-300 cursor-not-allowed");
      } else if (isCheckinDate || isCheckoutDate) {
        buttonClasses.push(
          "bg-black text-white rounded-full z-10 shadow-md"
        );
      } else if (isInRange) {
        buttonClasses.push("bg-black/10 text-black");

        // Add range styling
        if (mCheckin && mCell.isSame(mCheckin.clone().add(1, "day"), "day")) {
          buttonClasses.push("rounded-l-full");
        }
        if (
          mCheckout &&
          mCell.isSame(mCheckout.clone().subtract(1, "day"), "day")
        ) {
          buttonClasses.push("rounded-r-full");
        }
        if (hoveredDate && !checkoutDate && focusedSide === "checkout") {
          const mHovered = moment(hoveredDate).tz(timezone).startOf("day");
          if (mCell.isSame(mHovered.clone().subtract(1, "day"), "day")) {
            buttonClasses.push("rounded-r-full");
          }
        }
      } else {
        buttonClasses.push(
          "hover:bg-black/20 text-foreground hover:rounded-full hover:scale-105"
        );
      }

      if (isToday && !isCheckinDate && !isCheckoutDate) {
        buttonClasses.push("border border-black");
      }

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isDisabled) {
              handleDateClick(mCell, isRightSide);
            }
          }}
          onMouseEnter={() => {
            if (
              !isDisabled &&
              checkinDate &&
              !checkoutDate &&
              focusedSide === "checkout"
            ) {
              setHoveredDate(dateObj);
            }
          }}
          onMouseLeave={() => {
            setHoveredDate(null);
          }}
          disabled={isDisabled}
          aria-label={`Select ${mCell.format("YYYY-MM-DD")}`}
          className={buttonClasses.join(" ")}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative animate-fade-in ">
      {/* Tooltip Arrow */}
      <div className="absolute bg-white -top-1.5 md:-top-2 left-1/2 -translate-x-1/2 bg-card border-l border-t border-gray-200 rotate-45 z-10 w-3 h-3 md:w-4 md:h-4" />

      <div
        className={`bg-card border border-gray-200 rounded-2xl shadow-elegant relative z-20 bg-white ${
          isMobile ? "p-4 w-80" : "p-6 w-[650px]"
        }`}
      >
        {/* Headers */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Check-in Header */}
          <div
            className={`text-center p-3 rounded-lg border-2 transition-all ${
              focusedSide === "checkin"
                ? "border-black bg-gray-200"
                : "border-gray-200"
            }`}
          >
            <h3 className="font-semibold text-foreground text-sm">Check-in</h3>
            <p className="text-xs text-muted-foreground">
              {checkinDate
                ? moment(checkinDate).format("MMM DD, YYYY")
                : "Select date"}
            </p>
          </div>

          {/* Check-out Header */}
          <div
            className={`text-center p-3 rounded-lg border-2 transition-all ${
              focusedSide === "checkout"
                ? "border-black bg-gray-200"
                : "border-gray-200"
            }`}
          >
            <h3 className="font-semibold text-foreground text-sm">Check-out</h3>
            <p className="text-xs text-muted-foreground">
              {checkoutDate
                ? moment(checkoutDate).format("MMM DD, YYYY")
                : "Select date"}
            </p>
          </div>
        </div>

        {/* Dual Calendar */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Calendar (Check-in) */}
          <div>
            {/* Left Month Header */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("prev", "left")}
                className="w-6 h-6 rounded-full hover:bg-muted"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <h4 className="font-medium text-foreground text-xs">
                {monthNames[leftMonth.getMonth()]} {leftMonth.getFullYear()}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("next", "left")}
                className="w-6 h-6 rounded-full hover:bg-muted"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>

            {/* Left Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="w-8 h-6 md:w-10 md:h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Left Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar(leftMonth, false)}
            </div>
          </div>

          {/* Right Calendar (Check-out) */}
          <div>
            {/* Right Month Header */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("prev", "right")}
                className="w-6 h-6 rounded-full hover:bg-muted"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <h4 className="font-medium text-foreground text-xs">
                {monthNames[rightMonth.getMonth()]} {rightMonth.getFullYear()}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("next", "right")}
                className="w-6 h-6 rounded-full hover:bg-muted"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>

            {/* Right Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="w-8 h-6 md:w-10 md:h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Right Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar(rightMonth, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
