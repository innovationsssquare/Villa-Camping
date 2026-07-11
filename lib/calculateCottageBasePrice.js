import { calculateBasePriceForRange } from "./datePricing.js";

/**
 * selectedCottages = { Single: { quantity: 2 }, Family: { quantity: 1 } }
 * dayCottages = dayDetails.data.cottages OR cottage units array
 */
export function calculateCottageTotal(
  selectedCottages = {},
  dayCottages = [],
  checkInISO,
  checkOutISO
) {
  if (!checkInISO || !checkOutISO) return 0;

  let total = 0;

  for (const [cottageType, data] of Object.entries(selectedCottages)) {
    const qty = Number(data?.quantity || 0);
    if (qty <= 0) continue;

    const cottage = dayCottages?.find(
      (c) => c.cottageType === cottageType
    );
    const wPrice = cottage ? cottage.price?.weekday : (data?.weekdayPrice || 0);
    const wePrice = cottage ? (cottage.price?.weekend ?? cottage.price?.weekday) : (data?.weekendPrice ?? data?.weekdayPrice ?? 0);

    const priceForOneCottage = calculateBasePriceForRange(
      checkInISO,
      checkOutISO,
      {
        weekdayPrice: wPrice,
        weekendPrice: wePrice,
      }
    );

    total += priceForOneCottage * qty;
  }

  return Math.round(total);
}
