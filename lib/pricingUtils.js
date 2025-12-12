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
 * items: array of units { startDate, nights } or jus t use checkIn/checkOut
 * propertyPricing: { weekdayPrice, weekendPrice }
 */
export function calculateBasePriceForRange(checkInISO, checkOutISO, pricing) {
  const checkIn = new Date(checkInISO);
  const checkOut = new Date(checkOutISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  let base = 0;
  for (let t = +checkIn; t < +checkOut; t += msPerDay) {
    const d = new Date(t);
    const isWeekend = isWeekendInIndia(d);
    base += isWeekend ? Number(pricing.weekendPrice ?? pricing.weekdayPrice ?? 0) : Number(pricing.weekdayPrice ?? 0);
  }
  // round
  return Math.round(base * 100) / 100;
}
