import { useState, useEffect } from "react";
import { BaseUrl } from "@/lib/API/Baseurl";

// lib/pricingUtils.js
export function isWeekendInIndia(date = new Date()) {
  const dt = typeof date === "string" ? new Date(date) : date;
  const weekdayShort = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(dt);
  return weekdayShort === "Sat" || weekdayShort === "Sun";
}

export function formatDateKey(date = new Date()) {
  const dt = typeof date === "string" ? new Date(date) : date;
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// In-memory cache for holiday dates per year
const holidayCache = new Map();

/**
 * Fetch Indian holiday dates for a given year (defaults to current year)
 * Returns a Set of "YYYY-MM-DD" strings
 */
export async function fetchHolidayDates(year = new Date().getFullYear()) {
  if (holidayCache.has(year)) {
    return holidayCache.get(year);
  }

  try {
    const res = await fetch(`${BaseUrl}/User/holidays/long-weekends?year=${year}`);
    const json = await res.json();
    if (json.success && json.data?.holidayDates) {
      const set = new Set(json.data.holidayDates);
      holidayCache.set(year, set);
      return set;
    }
  } catch (err) {
    console.warn("[pricingUtils] Could not fetch Indian holidays:", err);
  }

  const emptySet = new Set();
  holidayCache.set(year, emptySet);
  return emptySet;
}

/**
 * React hook to access Indian holiday dates for current/target year
 */
export function useHolidayDates(year = new Date().getFullYear()) {
  const [holidayDates, setHolidayDates] = useState(() => holidayCache.get(year) || new Set());

  useEffect(() => {
    let isMounted = true;
    fetchHolidayDates(year).then((dates) => {
      if (isMounted) setHolidayDates(dates);
    });
    return () => {
      isMounted = false;
    };
  }, [year]);

  return holidayDates;
}

/**
 * items: array of units { startDate, nights } or just use checkIn/checkOut
 * propertyPricing: { weekdayPrice, weekendPrice, holidayPrice }
 * holidayDates: Set or Array of "YYYY-MM-DD"
 */
export function calculateBasePriceForRange(checkInISO, checkOutISO, pricing = {}, holidayDates = new Set()) {
  if (!checkInISO || !checkOutISO) return 0;
  const checkIn = new Date(checkInISO);
  const checkOut = new Date(checkOutISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  let base = 0;

  const holidaysSet = holidayDates instanceof Set ? holidayDates : new Set(holidayDates || []);

  for (let t = +checkIn; t < +checkOut; t += msPerDay) {
    const d = new Date(t);
    const dateStr = formatDateKey(d);
    const isHoliday = holidaysSet.has(dateStr);
    const isWeekend = isWeekendInIndia(d);

    let nightRate;
    if (isHoliday && pricing.holidayPrice && Number(pricing.holidayPrice) > 0) {
      nightRate = Number(pricing.holidayPrice);
    } else if (isWeekend) {
      nightRate = Number(pricing.weekendPrice ?? pricing.weekdayPrice ?? 0);
    } else {
      nightRate = Number(pricing.weekdayPrice ?? 0);
    }

    base += nightRate;
  }
  return Math.round(base * 100) / 100;
}

/**
 * Detailed breakdown of weekdays, weekends, and holidays for a given stay
 */
export function calculateNightBreakdown(checkInISO, checkOutISO, pricing = {}, holidayDates = new Set()) {
  if (!checkInISO || !checkOutISO) {
    return {
      weekdays: 0,
      weekends: 0,
      holidays: 0,
      totalNights: 0,
      weekdayRate: Number(pricing.weekdayPrice || 0),
      weekendRate: Number(pricing.weekendPrice || pricing.weekdayPrice || 0),
      holidayRate: Number(pricing.holidayPrice || 0),
      weekdayTotal: 0,
      weekendTotal: 0,
      holidayTotal: 0,
      baseTotal: 0,
    };
  }

  const checkIn = new Date(checkInISO);
  const checkOut = new Date(checkOutISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  const holidaysSet = holidayDates instanceof Set ? holidayDates : new Set(holidayDates || []);

  let weekdays = 0;
  let weekends = 0;
  let holidays = 0;

  const weekdayRate = Number(pricing.weekdayPrice || 0);
  const weekendRate = Number(pricing.weekendPrice ?? pricing.weekdayPrice ?? 0);
  const holidayRate = Number(pricing.holidayPrice && Number(pricing.holidayPrice) > 0 ? pricing.holidayPrice : 0);

  for (let t = +checkIn; t < +checkOut; t += msPerDay) {
    const d = new Date(t);
    const dateStr = formatDateKey(d);
    const isHoliday = holidaysSet.has(dateStr) && holidayRate > 0;
    const isWeekend = isWeekendInIndia(d);

    if (isHoliday) {
      holidays++;
    } else if (isWeekend) {
      weekends++;
    } else {
      weekdays++;
    }
  }

  const weekdayTotal = weekdays * weekdayRate;
  const weekendTotal = weekends * weekendRate;
  const holidayTotal = holidays * (holidayRate > 0 ? holidayRate : weekdayRate);
  const baseTotal = weekdayTotal + weekendTotal + holidayTotal;
  const totalNights = weekdays + weekends + holidays;

  return {
    weekdays,
    weekends,
    holidays,
    totalNights,
    weekdayRate,
    weekendRate,
    holidayRate,
    weekdayTotal,
    weekendTotal,
    holidayTotal,
    baseTotal: Math.round(baseTotal * 100) / 100,
  };
}

