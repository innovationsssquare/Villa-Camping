import { calculateBasePriceForRange } from "./datePricing";

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

    const cottage = dayCottages.find(
      (c) => c.cottageType === cottageType
    );
    if (!cottage) continue;

    const priceForOneCottage = calculateBasePriceForRange(
      checkInISO,
      checkOutISO,
      {
        weekdayPrice: cottage?.price?.weekday,
        weekendPrice: cottage?.price?.weekend,
      }
    );

    total += priceForOneCottage * qty;
  }

  return Math.round(total);
}
