export const getDisplayPrice = (pricing) => {
  if (!pricing) return 0;

  // Get current date in Indian timezone
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const day = now.getDay(); 
  // 0 = Sunday, 6 = Saturday

  const isWeekend = day === 0 || day === 6;

  return isWeekend
    ? pricing.weekendPrice
    : pricing.weekdayPrice;
};
