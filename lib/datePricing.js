// lib/datePricing.js
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

/**
 * Calculate base price across a date range using weekday/weekend/holiday rates.
 * pricing: { weekdayPrice, weekendPrice, holidayPrice }
 * holidayDates: Set of "YYYY-MM-DD" or Array
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
