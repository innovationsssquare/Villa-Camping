import { calculateBasePriceForRange } from "./datePricing.js";

/**
 * selectedCottages = { Single: { quantity: 2 }, Family: { quantity: 1 } }
 * dayCottages = dayDetails.data.cottages OR cottage units array
 */
export function calculateHotelTotal(
  selectedRooms = {},
  dayRooms = [],
  checkInISO,
  checkOutISO
) {
  if (!checkInISO || !checkOutISO) return 0;

  let total = 0;

  for (const [roomType, data] of Object.entries(selectedRooms)) {
    const qty = Number(data?.quantity || 0);
    if (qty <= 0) continue;

    const room = dayRooms?.find(
      (c) => c.roomType === roomType
    );
    const wPrice = room ? room.price?.weekday : (data?.weekdayPrice || 0);
    const wePrice = room ? (room.price?.weekend ?? room.price?.weekday) : (data?.weekendPrice ?? data?.weekdayPrice ?? 0);

    const priceForOneRoom = calculateBasePriceForRange(
      checkInISO,
      checkOutISO,
      {
        weekdayPrice: wPrice,
        weekendPrice: wePrice,
      }
    );

    total += priceForOneRoom * qty;
  }

  return Math.round(total);
}
