import assert from "node:assert";
import { isWeekendInIndia, calculateBasePriceForRange } from "../lib/datePricing.js";
import { calculateCampingTentTotal } from "../lib/calculateTentBasePrice.js";
import { calculateCottageTotal } from "../lib/calculateCottageBasePrice.js";
import { calculateHotelTotal } from "../lib/calculateHotelBasePrice.js";
import { calculateBookingPrice } from "../lib/bookingUtils.js";

console.log("==========================================");
console.log("RUNNING BOOKING PRICING & TAX TEST CASES");
console.log("==========================================\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

// ----------------------------------------------------
// Test 1: isWeekendInIndia
// ----------------------------------------------------
test("isWeekendInIndia detects Sat & Sun in IST time zone", () => {
  // 2026-07-08 is Wednesday
  assert.strictEqual(isWeekendInIndia("2026-07-08"), false);
  // 2026-07-11 is Saturday
  assert.strictEqual(isWeekendInIndia("2026-07-11"), true);
  // 2026-07-12 is Sunday
  assert.strictEqual(isWeekendInIndia("2026-07-12"), true);
  // 2026-07-13 is Monday
  assert.strictEqual(isWeekendInIndia("2026-07-13"), false);
});

// ----------------------------------------------------
// Test 2: calculateBasePriceForRange
// ----------------------------------------------------
test("calculateBasePriceForRange correctly aggregates weekday/weekend prices", () => {
  const pricing = { weekdayPrice: 1000, weekendPrice: 1500 };
  
  // Wed to Fri (2 nights: Wed night, Thu night) -> All Weekdays -> 2 * 1000 = 2000
  const weekdayTotal = calculateBasePriceForRange("2026-07-08", "2026-07-10", pricing);
  assert.strictEqual(weekdayTotal, 2000);

  // Fri to Sun (2 nights: Fri night [weekday], Sat night [weekend]) -> 1000 + 1500 = 2500
  const mixedTotal = calculateBasePriceForRange("2026-07-10", "2026-07-12", pricing);
  assert.strictEqual(mixedTotal, 2500);

  // Sat to Mon (2 nights: Sat night [weekend], Sun night [weekend]) -> 1500 + 1500 = 3000
  const weekendTotal = calculateBasePriceForRange("2026-07-11", "2026-07-13", pricing);
  assert.strictEqual(weekendTotal, 3000);
});

// ----------------------------------------------------
// Test 3: calculateCampingTentTotal (with and without dayTents fallback)
// ----------------------------------------------------
test("calculateCampingTentTotal correctly aggregates with Redux fallback and Day details", () => {
  const selectedTents = {
    "Dome Tent": { quantity: 2, weekdayPrice: 1200, weekendPrice: 1800 },
    "Safari Tent": { quantity: 1, weekdayPrice: 2000, weekendPrice: 2500 }
  };

  // Mixed date range: Fri to Sun (1 weekday, 1 weekend night)
  // Dome Tent rate: 1200 + 1800 = 3000 per tent * 2 = 6000
  // Safari Tent rate: 2000 + 2500 = 4500 per tent * 1 = 4500
  // Total: 6000 + 4500 = 10500
  
  // Test case A: Fallback mode (dayTents is empty)
  const totalFallback = calculateCampingTentTotal(selectedTents, [], "2026-07-10", "2026-07-12");
  assert.strictEqual(totalFallback, 10500);

  // Test case B: Using day details availability rates
  const dayTents = [
    { tentType: "Dome Tent", price: { weekday: 1000, weekend: 1500 } },
    { tentType: "Safari Tent", price: { weekday: 1800, weekend: 2200 } }
  ];
  // Dome Tent rate: 1000 + 1500 = 2500 per tent * 2 = 5000
  // Safari Tent rate: 1800 + 2200 = 4000 per tent * 1 = 4000
  // Total: 9000
  const totalWithDayDetails = calculateCampingTentTotal(selectedTents, dayTents, "2026-07-10", "2026-07-12");
  assert.strictEqual(totalWithDayDetails, 9000);
});

// ----------------------------------------------------
// Test 4: calculateCottageTotal
// ----------------------------------------------------
test("calculateCottageTotal correctly calculates mixed night rates", () => {
  const selectedCottages = {
    "Wooden Cottage": { quantity: 1, weekdayPrice: 3000, weekendPrice: 4000 }
  };
  
  // Mixed range: Friday to Sunday (1 weekday, 1 weekend night) -> 3000 + 4000 = 7000
  const totalCottage = calculateCottageTotal(selectedCottages, [], "2026-07-10", "2026-07-12");
  assert.strictEqual(totalCottage, 7000);
});

// ----------------------------------------------------
// Test 5: calculateHotelTotal
// ----------------------------------------------------
test("calculateHotelTotal correctly calculates mixed room rates", () => {
  const selectedRooms = {
    "Deluxe Room": { quantity: 2, weekdayPrice: 1500, weekendPrice: 2000 }
  };

  // Mixed range: Friday to Sunday (1 weekday, 1 weekend night) -> (1500 + 2000) * 2 = 7000
  const totalHotel = calculateHotelTotal(selectedRooms, [], "2026-07-10", "2026-07-12");
  assert.strictEqual(totalHotel, 7000);
});

// ----------------------------------------------------
// Test 6: calculateBookingPrice (coupon discount & 18% GST tax calculation)
// ----------------------------------------------------
test("calculateBookingPrice computes coupon code discounts and 18% GST accurately", () => {
  // Case A: 1 night of a Villa at ₹10,000, no coupon.
  // Base: 10,000
  // Discount: 0
  // Tax (18% of 10,000): 1800
  // Final Total: 11,800
  const priceNoCoupon = calculateBookingPrice(10000, 1, null);
  assert.strictEqual(priceNoCoupon.basePrice, 10000);
  assert.strictEqual(priceNoCoupon.discountAmount, 0);
  assert.strictEqual(priceNoCoupon.taxAmount, 1800);
  assert.strictEqual(priceNoCoupon.finalTotal, 11800);

  // Case B: 1 night of a Villa at ₹10,000, with a fixed discount coupon of ₹2,000.
  // Base: 10,000
  // Discount: 2,000
  // Tax (18% of 8,000): 1440
  // Final Total: 9,440
  const couponFixed = { discountType: "fixed", discountValue: 2000 };
  const priceFixedCoupon = calculateBookingPrice(10000, 1, couponFixed);
  assert.strictEqual(priceFixedCoupon.basePrice, 10000);
  assert.strictEqual(priceFixedCoupon.discountAmount, 2000);
  assert.strictEqual(priceFixedCoupon.taxAmount, 1440);
  assert.strictEqual(priceFixedCoupon.finalTotal, 9440);

  // Case C: 1 night of a Villa at ₹10,000, with a percentage coupon of 15% (max discount ₹1000).
  // Base: 10,000
  // Raw Discount: 1,500 -> capped at max discount of 1,000
  // Tax (18% of 9,000): 1620
  // Final Total: 10,620
  const couponPercentage = { discountType: "percentage", discountValue: 15, maxDiscount: 1000 };
  const pricePercentageCoupon = calculateBookingPrice(10000, 1, couponPercentage);
  assert.strictEqual(pricePercentageCoupon.basePrice, 10000);
  assert.strictEqual(pricePercentageCoupon.discountAmount, 1000);
  assert.strictEqual(pricePercentageCoupon.taxAmount, 1620);
  assert.strictEqual(pricePercentageCoupon.finalTotal, 10620);
});

console.log("\n==========================================");
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==========================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
