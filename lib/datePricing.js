// lib/datePricing.js
export function isWeekendInIndia(date = new Date()) {
  const dt = typeof date === "string" ? new Date(date) : date;
  const weekdayShort = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(dt);
  return weekdayShort === "Sat" || weekdayShort === "Sun";
}

/**
 * Calculate base price across a date range using weekday/weekend rates.
 * pricing: { weekdayPrice, weekendPrice }
 */
export function calculateBasePriceForRange(checkInISO, checkOutISO, pricing = {}) {
  if (!checkInISO || !checkOutISO) return 0;
  const checkIn = new Date(checkInISO);
  const checkOut = new Date(checkOutISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  let base = 0;

  for (let t = +checkIn; t < +checkOut; t += msPerDay) {
    const d = new Date(t);
    const isWeekend = isWeekendInIndia(d);
    const nightRate = isWeekend
      ? Number(pricing.weekendPrice ?? pricing.weekdayPrice ?? 0)
      : Number(pricing.weekdayPrice ?? 0);
    base += nightRate;
  }
  return Math.round(base * 100) / 100;
}
