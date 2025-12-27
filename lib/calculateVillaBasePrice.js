import moment from "moment-timezone";

export function calculateVillaTotal(pricing, checkInISO, checkOutISO) {
  if (!pricing || !checkInISO || !checkOutISO) return 0;

  const checkIn = moment.tz(checkInISO, "Asia/Kolkata").startOf("day");
  const checkOut = moment.tz(checkOutISO, "Asia/Kolkata").startOf("day");

  let total = 0;
  let cursor = checkIn.clone();

  while (cursor.isBefore(checkOut)) {
    const day = cursor.day(); // 0 = Sun, 6 = Sat

    const isWeekend = day === 0 || day === 6;

    total += isWeekend
      ? Number(pricing.weekendPrice || 0)
      : Number(pricing.weekdayPrice || 0);

    cursor.add(1, "day");
  }

  return total;
}
