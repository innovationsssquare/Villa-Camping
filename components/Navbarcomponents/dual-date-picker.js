"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
  Tag,
} from "lucide-react";
import moment from "moment-timezone";
import { useIndianHolidays } from "@/hooks/useIndianHolidays";

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
  setFocusedSide,
}) {
  const currentYear = useMemo(() => {
    return checkinDate
      ? moment.tz(checkinDate, timezone).year()
      : moment().tz(timezone).year();
  }, [checkinDate, timezone]);

  const {
    allHolidays,
    holidayMap,
    longWeekendSet,
    longWeekends,
    getNextLongWeekend,
    isHoliday,
    getHolidayName,
    isLongWeekend,
  } = useIndianHolidays(currentYear);

  const [leftMonth, setLeftMonth] = useState(() => {
    const base = checkinDate ? moment(checkinDate) : moment();
    return base.tz(timezone).startOf("month").toDate();
  });

  const [rightMonth, setRightMonth] = useState(() => {
    const base = checkinDate ? moment(checkinDate) : moment();
    return base.tz(timezone).add(1, "month").startOf("month").toDate();
  });

  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipHoliday, setTooltipHoliday] = useState(null);

  const navigateMonth = (direction) => {
    setLeftMonth((prev) => {
      const m = moment(prev).tz(timezone).startOf("month");
      const next =
        direction === "prev" ? m.subtract(1, "month") : m.add(1, "month");
      setRightMonth(next.clone().add(1, "month").toDate());
      return next.toDate();
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const startOfToday = useMemo(
    () => moment.tz(timezone).startOf("day").toDate(),
    [timezone]
  );

  const minBoundary = useMemo(() => {
    if (!minDate) return startOfToday;
    return moment.tz(minDate, timezone).startOf("day").toDate();
  }, [minDate, timezone, startOfToday]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const [internalSide, setInternalSide] = useState(() => {
    if (checkinDate && !checkoutDate) return "checkout";
    return focusedSide || "checkin";
  });

  useEffect(() => {
    if (focusedSide) {
      setInternalSide(focusedSide);
    }
  }, [focusedSide]);

  useEffect(() => {
    if (!checkinDate) {
      setInternalSide("checkin");
      if (setFocusedSide) setFocusedSide("checkin");
    } else if (checkinDate && !checkoutDate) {
      setInternalSide("checkout");
      if (setFocusedSide) setFocusedSide("checkout");
    }
  }, [checkinDate, checkoutDate, setFocusedSide]);

  const currentSide = focusedSide || internalSide;

  const updateSide = (side) => {
    setInternalSide(side);
    if (setFocusedSide) setFocusedSide(side);
  };

  const isDateDisabled = (mCell) => {
    const cellMidnight = mCell.clone().startOf("day");
    const minMidnight = moment(minBoundary).tz(timezone).startOf("day");

    // Only dates before today (or minBoundary) are disabled
    if (cellMidnight.isBefore(minMidnight)) return true;

    return false;
  };

  const handleDateClick = (mCell) => {
    const isoDate = mCell.format();
    const cellMidnight = mCell.clone().startOf("day");
    const checkinMidnight = checkinDate
      ? moment.tz(checkinDate, timezone).startOf("day")
      : null;

    // SCENARIO 1: Check-in is selected, waiting for Check-out
    if (checkinDate && !checkoutDate) {
      // If user clicks a date on or before check-in date:
      // Treat as new check-in date and continue waiting for check-out
      if (cellMidnight.isSameOrBefore(checkinMidnight)) {
        onCheckinSelect(isoDate);
        onCheckoutSelect(null);
        updateSide("checkout");
        return;
      }

      // Valid checkout date strictly after check-in
      onCheckoutSelect(isoDate);
      updateSide("checkin");

      // BOTH CHECK-IN AND CHECK-OUT DATES ARE NOW SELECTED!
      // Dismiss popup after a smooth delay
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 280);
      }
      return;
    }

    // SCENARIO 2: Currently selecting Check-in (or starting fresh / re-selecting range)
    if (!checkinDate || (checkinDate && checkoutDate) || currentSide === "checkin") {
      onCheckinSelect(isoDate);
      onCheckoutSelect(null);
      updateSide("checkout");
      // NEVER dismiss on check-in selection; wait for checkout selection
      return;
    }

    // SCENARIO 3: Explicit checkout side
    if (currentSide === "checkout") {
      if (checkinMidnight && cellMidnight.isSameOrBefore(checkinMidnight)) {
        onCheckinSelect(isoDate);
        onCheckoutSelect(null);
        updateSide("checkout");
        return;
      }

      onCheckoutSelect(isoDate);
      updateSide("checkin");

      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 280);
      }
    }
  };

  // Quick Weekend Selection
  const handleSelectWeekend = (offsetWeeks = 0) => {
    const now = moment().tz(timezone);
    const dayOfWeek = now.isoWeekday();
    let thisFriday =
      dayOfWeek <= 5
        ? now.clone().isoWeekday(5)
        : now.clone().add(1, "week").isoWeekday(5);

    if (offsetWeeks > 0) {
      thisFriday = thisFriday.add(offsetWeeks, "weeks");
    }

    const sunday = thisFriday.clone().add(2, "days");

    onCheckinSelect(thisFriday.startOf("day").format());
    onCheckoutSelect(sunday.startOf("day").format());
    updateSide("checkin");
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 280);
    }
  };

  // Jump to specific Indian Holiday: select as Check-in and focus Checkout
  const handleSelectHoliday = (holiday) => {
    const mHol = moment.tz(holiday.date, timezone).startOf("day");
    onCheckinSelect(mHol.format());
    onCheckoutSelect(null);

    // Jump calendar to that month
    setLeftMonth(mHol.clone().startOf("month").toDate());
    setRightMonth(mHol.clone().add(1, "month").startOf("month").toDate());

    // Explicitly focus checkout so the user selects their checkout date
    updateSide("checkout");
  };

  // Jump to upcoming Long Weekend
  const handleSelectUpcomingLongWeekend = () => {
    const nextLw = getNextLongWeekend();
    if (!nextLw) return;

    const [sYear, sMonth, sDay] = nextLw.startDate.split("-").map(Number);
    const [eYear, eMonth, eDay] = nextLw.endDate.split("-").map(Number);

    const mStart = moment
      .tz({ year: sYear, month: sMonth - 1, day: sDay }, timezone)
      .startOf("day");
    const mEnd = moment
      .tz({ year: eYear, month: eMonth - 1, day: eDay }, timezone)
      .startOf("day");

    onCheckinSelect(mStart.format());
    onCheckoutSelect(mEnd.format());

    setLeftMonth(mStart.clone().startOf("month").toDate());
    setRightMonth(mStart.clone().add(1, "month").startOf("month").toDate());
    updateSide("checkin");
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 280);
    }
  };

  const clearDates = () => {
    onCheckinSelect(null);
    onCheckoutSelect(null);
    setHoveredDate(null);
    updateSide("checkin");
  };

  const nightsCount = useMemo(() => {
    if (!checkinDate || !checkoutDate) return null;
    const mIn = moment.tz(checkinDate, timezone).startOf("day");
    const mOut = moment.tz(checkoutDate, timezone).startOf("day");
    const diff = mOut.diff(mIn, "days");
    return diff > 0 ? diff : null;
  }, [checkinDate, checkoutDate, timezone]);

  const renderMonth = (monthDate) => {
    const mCurrent = moment(monthDate).tz(timezone);
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = getFirstDayOfMonth(monthDate);

    const mCheckin = checkinDate
      ? moment.tz(checkinDate, timezone).startOf("day")
      : null;
    const mCheckout = checkoutDate
      ? moment.tz(checkoutDate, timezone).startOf("day")
      : null;
    const mHovered =
      hoveredDate && currentSide === "checkout"
        ? moment(hoveredDate).tz(timezone).startOf("day")
        : null;

    const days = [];

    // Empty start cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 sm:h-8.5 w-full" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const mCell = mCurrent.clone().date(day).startOf("day");
      const dateStr = mCell.format("YYYY-MM-DD");
      const isDisabled = isDateDisabled(mCell);
      const isToday = mCell.isSame(startOfToday, "day");

      const isStart = mCheckin ? mCell.isSame(mCheckin, "day") : false;
      const isEnd = mCheckout ? mCell.isSame(mCheckout, "day") : false;

      let isInRange = false;
      if (mCheckin && mCheckout) {
        isInRange = mCell.isAfter(mCheckin) && mCell.isBefore(mCheckout);
      } else if (mCheckin && mHovered && mHovered.isAfter(mCheckin)) {
        isInRange = mCell.isAfter(mCheckin) && mCell.isBefore(mHovered);
      }

      const holidayName = getHolidayName(dateStr);
      const isHolidayDate = Boolean(holidayName);
      const isLwDate = isLongWeekend(dateStr);

      const isRangeLeading =
        isStart && (mCheckout || (mHovered && mHovered.isAfter(mCheckin)));
      const isRangeTrailing =
        isEnd || (mHovered && mCell.isSame(mHovered) && mCheckin);

      days.push(
        <div
          key={day}
          className="relative h-8 sm:h-8.5 w-full flex items-center justify-center"
          onMouseEnter={() => {
            if (!isDisabled && checkinDate && !checkoutDate) {
              setHoveredDate(mCell.toDate());
            }
          }}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {/* Continuous Airbnb Range Highlight Strip */}
          {(isInRange || isRangeLeading || isRangeTrailing) && (
            <div
              className={`absolute inset-y-0.5 transition-all duration-150 ${
                isInRange
                  ? "inset-x-0 bg-neutral-100"
                  : isRangeLeading
                  ? "left-1/2 right-0 bg-neutral-100"
                  : isRangeTrailing
                  ? "left-0 right-1/2 bg-neutral-100"
                  : ""
              }`}
            />
          )}

          {/* Date Circular Button with Indian Holiday Styling */}
          <button
            type="button"
            onClick={() => !isDisabled && handleDateClick(mCell)}
            disabled={isDisabled}
            onMouseEnter={() => {
              if (isHolidayDate) {
                setTooltipHoliday({
                  name: holidayName,
                  date: mCell.format("MMM DD"),
                });
              }
            }}
            onMouseLeave={() => setTooltipHoliday(null)}
            className={`relative z-10 w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex flex-col items-center justify-center transition-all duration-150 ${
              isDisabled
                ? "text-neutral-300 cursor-not-allowed line-through text-xs"
                : isStart || isEnd
                ? "bg-black text-white font-bold shadow-sm scale-105"
                : isInRange
                ? "text-neutral-900 font-semibold hover:bg-neutral-200"
                : isHolidayDate
                ? "bg-amber-100/80 text-amber-950 font-bold border border-amber-300 hover:bg-amber-200 hover:scale-105 shadow-2xs"
                : isToday
                ? "border-2 border-black text-black font-bold hover:bg-neutral-100"
                : "text-neutral-800 font-medium hover:bg-neutral-100 hover:scale-105"
            }`}
          >
            <span className="text-xs leading-none select-none">{day}</span>

            {/* Prominent Star for Indian Gazetted Holidays */}
            {isHolidayDate && !isStart && !isEnd && (
              <span className="absolute -top-1 -right-0.5 text-[8px] leading-none select-none">
                ⭐
              </span>
            )}
            {!isHolidayDate && isLwDate && !isStart && !isEnd && (
              <span
                className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white"
                title="Long Weekend Date"
              />
            )}
          </button>
        </div>
      );
    }

    return days;
  };

  const nextLw = getNextLongWeekend();

  // Filter upcoming holidays for horizontal carousel
  const upcomingHolidays = useMemo(() => {
    const todayStr = moment().tz(timezone).format("YYYY-MM-DD");
    return (allHolidays || [])
      .filter((h) => h.date >= todayStr)
      .slice(0, 6);
  }, [allHolidays, timezone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className={`relative z-50 bg-white rounded-3xl border border-neutral-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.16)] overflow-hidden ${
        isMobile ? "w-[330px] p-3.5" : "w-[640px] max-w-[95vw] p-4 sm:p-4.5"
      }`}
    >
      {/* Airbnb Sliding Header: Check-in vs Check-out Tabs */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-150">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full relative">
          <button
            type="button"
            onClick={() => updateSide("checkin")}
            className={`relative z-10 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              currentSide === "checkin" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Check in: {checkinDate ? moment(checkinDate).format("MMM DD") : "Select date"}
            {currentSide === "checkin" && (
              <motion.div
                layoutId="activeDateHeaderPill"
                className="absolute inset-0 bg-white rounded-full shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => updateSide("checkout")}
            className={`relative z-10 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              currentSide === "checkout" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Check out: {checkoutDate ? moment(checkoutDate).format("MMM DD") : "Select date"}
            {currentSide === "checkout" && (
              <motion.div
                layoutId="activeDateHeaderPill"
                className="absolute inset-0 bg-white rounded-full shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Quick Weekend & Long Weekend Badges */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSelectWeekend(0)}
            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer transition-colors"
          >
            This Weekend
          </button>
          {nextLw && (
            <button
              type="button"
              onClick={handleSelectUpcomingLongWeekend}
              className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 cursor-pointer transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              {nextLw.title}
            </button>
          )}
        </div>
      </div>

      {/* Prominent Indian Holidays Strip (Tap to Auto-Select, Hidden Scrollbar) */}
      {upcomingHolidays.length > 0 && (
        <div className="mb-2.5 pb-2 border-b border-neutral-150">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <span>⭐</span> Upcoming Indian Gazetted Holidays
            </span>
            <span className="text-[10px] text-amber-700 font-medium">Tap to jump & select</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {upcomingHolidays.map((h) => {
              const formattedDate = moment(h.date).format("MMM D");
              return (
                <button
                  key={h.date + h.name}
                  type="button"
                  onClick={() => handleSelectHoliday(h)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-medium shrink-0 cursor-pointer transition-all hover:scale-102 flex items-center gap-1.5 shadow-2xs"
                >
                  <Tag className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                  <span>{h.name}</span>
                  <span className="text-[10px] text-amber-700 font-normal">({formattedDate})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dual Month Calendar View */}
      <div className={`grid ${isMobile ? "grid-cols-1 gap-3.5" : "grid-cols-2 gap-5 sm:gap-6"} relative`}>
        {/* Left Month */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">
              {monthNames[leftMonth.getMonth()]} {leftMonth.getFullYear()}
            </h4>
            {isMobile && (
              <button
                type="button"
                onClick={() => navigateMonth("next")}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {!isMobile && <div className="w-7" />}
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="text-[10px] font-bold text-neutral-400 uppercase">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7">{renderMonth(leftMonth)}</div>
        </div>

        {/* Right Month (Desktop) */}
        {!isMobile && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="w-7" />
              <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">
                {monthNames[rightMonth.getMonth()]} {rightMonth.getFullYear()}
              </h4>
              <button
                type="button"
                onClick={() => navigateMonth("next")}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d} className="text-[10px] font-bold text-neutral-400 uppercase">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7">{renderMonth(rightMonth)}</div>
          </div>
        )}
      </div>

      {/* Holiday Hover Tooltip Banner */}
      <div className="h-5 mt-1.5 flex items-center">
        <AnimatePresence>
          {tooltipHoliday ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300 font-semibold"
            >
              <span>⭐</span>
              <span>{tooltipHoliday.date}:</span>
              <span>{tooltipHoliday.name} (Gazetted Holiday)</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3 text-[10px] text-neutral-500">
              <span className="flex items-center gap-1 font-medium">
                <span className="text-amber-500">⭐</span> Amber background = Indian Gazetted Holiday
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Long Weekend
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar: Selection Summary & Actions */}
      <div className="flex items-center justify-between pt-2.5 mt-1.5 border-t border-neutral-150">
        <div className="text-xs text-neutral-600">
          {nightsCount ? (
            <span className="font-semibold text-neutral-900">
              {nightsCount} {nightsCount === 1 ? "night" : "nights"} selected
            </span>
          ) : checkinDate ? (
            <span className="text-[#ff6900] font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              Select check-out date to continue
            </span>
          ) : (
            <span>Select check-in date</span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {(checkinDate || checkoutDate) && (
            <button
              type="button"
              onClick={clearDates}
              className="text-xs font-semibold text-neutral-600 hover:text-black underline cursor-pointer transition-colors"
            >
              Clear dates
            </button>
          )}

          {onClose && (
            <button
              type="button"
              disabled={!checkinDate || !checkoutDate}
              onClick={() => {
                if (checkinDate && checkoutDate) {
                  onClose();
                }
              }}
              className={`text-xs font-semibold px-4 py-1.5 rounded-xl transition-all shadow-xs ${
                checkinDate && checkoutDate
                  ? "bg-black hover:bg-neutral-800 text-white cursor-pointer"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
              }`}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
