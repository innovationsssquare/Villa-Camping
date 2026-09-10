"use client";

import { useState, useEffect, useMemo } from "react";
import { BaseUrl } from "@/lib/API/Baseurl";

// Built-in Indian Gazetted Holidays for instant zero-latency render
const STATIC_GAZETTED_HOLIDAYS = [
  { date: "2026-01-01", name: "New Year's Day", isPublic: true },
  { date: "2026-01-14", name: "Makar Sankranti / Pongal", isPublic: false },
  { date: "2026-01-26", name: "Republic Day", isPublic: true },
  { date: "2026-02-15", name: "Maha Shivratri", isPublic: true },
  { date: "2026-03-04", name: "Holi", isPublic: true },
  { date: "2026-03-21", name: "Eid-ul-Fitr (Ramzan Id)", isPublic: true },
  { date: "2026-03-26", name: "Rama Navami", isPublic: true },
  { date: "2026-03-31", name: "Mahavir Jayanti", isPublic: true },
  { date: "2026-04-03", name: "Good Friday", isPublic: true },
  { date: "2026-04-14", name: "Dr. B.R. Ambedkar Jayanti", isPublic: true },
  { date: "2026-05-01", name: "Maharashtra Day / Labour Day", isPublic: true },
  { date: "2026-05-28", name: "Bakrid / Eid-ul-Adha", isPublic: true },
  { date: "2026-06-26", name: "Muharram", isPublic: true },
  { date: "2026-08-15", name: "Independence Day", isPublic: true },
  { date: "2026-08-26", name: "Milad un-Nabi", isPublic: true },
  { date: "2026-09-04", name: "Janmashtami", isPublic: true },
  { date: "2026-09-14", name: "Ganesh Chaturthi", isPublic: true },
  { date: "2026-10-02", name: "Mahatma Gandhi Jayanti", isPublic: true },
  { date: "2026-10-20", name: "Dussehra (Vijayadashami)", isPublic: true },
  { date: "2026-11-08", name: "Diwali (Deepavali)", isPublic: true },
  { date: "2026-11-24", name: "Guru Nanak Jayanti", isPublic: true },
  { date: "2026-12-25", name: "Christmas", isPublic: true },
];

const STATIC_LONG_WEEKENDS = [
  {
    id: "lw-rep-day",
    title: "Republic Day Long Weekend",
    startDate: "2026-01-24",
    endDate: "2026-01-26",
    totalDays: 3,
    holidayNames: ["Republic Day"],
  },
  {
    id: "lw-good-friday",
    title: "Good Friday Easter Weekend",
    startDate: "2026-04-03",
    endDate: "2026-04-05",
    totalDays: 3,
    holidayNames: ["Good Friday"],
  },
  {
    id: "lw-maha-day",
    title: "Maharashtra Day Weekend",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    totalDays: 3,
    holidayNames: ["Maharashtra Day"],
  },
  {
    id: "lw-gandhi-jayanti",
    title: "Gandhi Jayanti Long Weekend",
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    totalDays: 3,
    holidayNames: ["Mahatma Gandhi Jayanti"],
  },
  {
    id: "lw-christmas",
    title: "Christmas Year-End Getaway",
    startDate: "2026-12-25",
    endDate: "2026-12-27",
    totalDays: 3,
    holidayNames: ["Christmas"],
  },
];

function buildInitialHolidayData(year) {
  const map = {};
  const dates = [];
  STATIC_GAZETTED_HOLIDAYS.forEach((h) => {
    map[h.date] = h.name;
    dates.push(h.date);
  });

  const lwDates = [];
  STATIC_LONG_WEEKENDS.forEach((lw) => {
    let curr = new Date(lw.startDate);
    const end = new Date(lw.endDate);
    while (curr <= end) {
      lwDates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
  });

  return {
    allHolidays: STATIC_GAZETTED_HOLIDAYS,
    holidayDates: dates,
    holidayMap: map,
    holidaySet: new Set(dates),
    longWeekendDates: lwDates,
    longWeekendSet: new Set(lwDates),
    longWeekends: STATIC_LONG_WEEKENDS,
    totalLongWeekends: STATIC_LONG_WEEKENDS.length,
  };
}

const holidayCache = new Map();

export function useIndianHolidays(targetYear = new Date().getFullYear()) {
  const [data, setData] = useState(() => {
    if (holidayCache.has(targetYear)) {
      return holidayCache.get(targetYear);
    }
    return buildInitialHolidayData(targetYear);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch(`${BaseUrl}/User/holidays/long-weekends?year=${targetYear}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Holiday fetch failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data) {
          const map = { ...data.holidayMap };
          (json.data.allHolidays || []).forEach((h) => {
            map[h.date] = h.name;
          });

          const longWeekendSet = new Set([
            ...Array.from(data.longWeekendSet),
            ...(json.data.longWeekendDates || []),
          ]);
          const holidaySet = new Set(Object.keys(map));

          const merged = {
            allHolidays: json.data.allHolidays?.length
              ? json.data.allHolidays
              : data.allHolidays,
            holidayDates: Array.from(holidaySet),
            holidayMap: map,
            holidaySet,
            longWeekendDates: Array.from(longWeekendSet),
            longWeekendSet,
            longWeekends: json.data.longWeekends?.length
              ? json.data.longWeekends
              : data.longWeekends,
            totalLongWeekends:
              json.data.totalLongWeekends || data.totalLongWeekends,
          };

          holidayCache.set(targetYear, merged);
          setData(merged);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetYear]);

  const helpers = useMemo(() => {
    const isHoliday = (dateStr) => Boolean(data?.holidayMap?.[dateStr]);
    const getHolidayName = (dateStr) => data?.holidayMap?.[dateStr] || null;
    const isLongWeekend = (dateStr) =>
      Boolean(data?.longWeekendSet?.has(dateStr));

    const getNextLongWeekend = () => {
      if (!data?.longWeekends?.length) return null;
      const todayStr = new Date().toISOString().split("T")[0];
      return (
        data.longWeekends.find((lw) => lw.endDate >= todayStr) ||
        data.longWeekends[0]
      );
    };

    return {
      isHoliday,
      getHolidayName,
      isLongWeekend,
      getNextLongWeekend,
    };
  }, [data]);

  return {
    ...data,
    ...helpers,
    isLoading,
    error,
  };
}
