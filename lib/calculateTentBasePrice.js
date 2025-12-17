import { calculateBasePriceForRange } from "./datePricing";

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

    const tent = dayTents.find((t) => t.tentType === tentType);
    if (!tent) continue;

    const priceForOneTent = calculateBasePriceForRange(
      checkInISO,
      checkOutISO,
      {
        weekdayPrice: tent.price.weekday,
        weekendPrice: tent.price.weekend,
      }
    );

    total += priceForOneTent * qty;
    console.log(qty)
    console.log(priceForOneTent)
    console.log(total)
  }

  return Math.round(total);
}
