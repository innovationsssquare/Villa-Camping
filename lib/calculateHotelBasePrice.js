import { calculateBasePriceForRange } from "./datePricing";

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

    const room = dayRooms.find(
      (c) => c.roomType === roomType
    );
    if (!room) continue;

    const priceForOneRoom = calculateBasePriceForRange(
      checkInISO,
      checkOutISO,
      {
        weekdayPrice: room?.price?.weekday,
        weekendPrice: room?.price?.weekend,
      }
    );

    total += priceForOneRoom * qty;
  }

  return Math.round(total);
}
