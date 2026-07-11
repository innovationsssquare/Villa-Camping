import { calculateBasePriceForRange } from "./datePricing.js";

/**
 * selectedTents = { Single: { quantity: 2 }, Couple: { quantity: 1 } }
 * dayTents = dayDetails.data.tents
 */
export function calculateCampingTentTotal(
  selectedTents = {},
  dayTents = [],
  checkInISO,
  checkOutISO
) {
  if (!checkInISO || !checkOutISO) return 0;

  let total = 0;

  for (const [tentType, data] of Object.entries(selectedTents)) {
    const qty = Number(data?.quantity || 0);
    if (qty <= 0) continue;

    const tent = dayTents?.find((t) => t.tentType === tentType);
    const wPrice = tent ? tent.price?.weekday : (data?.weekdayPrice || 0);
    const wePrice = tent ? (tent.price?.weekend ?? tent.price?.weekday) : (data?.weekendPrice ?? data?.weekdayPrice ?? 0);

    const priceForOneTent = calculateBasePriceForRange(
      checkInISO,
      checkOutISO,
      {
        weekdayPrice: wPrice,
        weekendPrice: wePrice,
      }
    );

    total += priceForOneTent * qty;
  }

  return Math.round(total);
}
