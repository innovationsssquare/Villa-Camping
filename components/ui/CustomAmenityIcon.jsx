import React from "react";

/**
 * CustomAmenityIcon: A bespoke collection of luxury SVG icons matching
 * the VillaCamp premium website theme (Charcoal outline + Champagne Gold accent).
 */
export default function CustomAmenityIcon({ name, className = "w-6 h-6" }) {
  const normalized = name?.toLowerCase()?.trim() || "";

  // Luxury Gold Accent Color
  const gold = "#C5A880";

  // WiFi
  if (normalized.includes("wifi")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill={gold} />
        <path d="M5 12C8.86599 8.13401 15.134 8.13401 19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 15.5C10.433 13.567 13.567 13.567 15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M1.5 8.5C7.29899 2.70101 16.701 2.70101 22.5 8.5" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // AC / Air Conditioning
  if (normalized.includes("ac") || normalized.includes("air conditioning")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="5" y1="9" x2="19" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 17C8 19.5 9.5 21 12 21C14.5 21 16 19.5 16 17" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <path d="M11 17L11 19" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 17L13 19" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        <rect x="18" y="10" width="2" height="1.5" rx="0.5" fill={gold} />
      </svg>
    );
  }

  // Swimming Pool
  if (normalized.includes("pool") || normalized.includes("swimming")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L16 11M16 11C16 12.5 17.5 13.5 19 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 2L8 11M8 11C8 9.5 6.5 8.5 5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 17C3.5 15.5 5.5 15.5 7 17C8.5 18.5 10.5 18.5 12 17C13.5 15.5 15.5 15.5 17 17C18.5 18.5 20.5 18.5 22 17" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 20.5C3.5 19 5.5 19 7 20.5C8.5 22 10.5 22 12 20.5C13.5 19 15.5 19 17 20.5C18.5 22 20.5 22 22 20.5" stroke={gold} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }

  // Parking
  if (normalized.includes("parking")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 17L9 7L13.5 7C15.433 7 17 8.567 17 10.5C17 12.433 15.433 14 13.5 14L9 14" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="13.5" cy="10.5" r="1.5" fill={gold} />
      </svg>
    );
  }

  // TV / LED / Screen
  if (normalized.includes("tv") || normalized.includes("led") || normalized.includes("screen")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 20H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="13" r="1" fill={gold} />
      </svg>
    );
  }

  // Kitchen / Cooking / Refrigerator / Microwave / Oven
  if (
    normalized.includes("kitchen") ||
    normalized.includes("refrigerator") ||
    normalized.includes("microwave") ||
    normalized.includes("oven") ||
    normalized.includes("cooking")
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7.5H9" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <path d="M7 16.5H9" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="7.5" r="1" fill={gold} />
      </svg>
    );
  }

  // Washing Machine
  if (normalized.includes("washing") || normalized.includes("washer")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="2.5" fill={gold} />
        <line x1="7" y1="6.5" x2="9" y2="6.5" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="6.5" x2="17" y2="6.5" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Balcony / Terrace / Patio
  if (normalized.includes("balcony") || normalized.includes("terrace") || normalized.includes("patio")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 14V21H21V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="14" x2="7" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <line x1="17" y1="14" x2="17" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="7" r="3" fill={gold} />
        <path d="M6 8C7.5 9 10 9 12 8C14 7 16.5 7 18 8" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Security / CCTV / Fire Extinguisher
  if (normalized.includes("security") || normalized.includes("cctv") || normalized.includes("extinguisher") || normalized.includes("shield")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 11L11 13L15 9" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Garden / Trees / Outdoor / Sunset Point
  if (normalized.includes("garden") || normalized.includes("trees") || normalized.includes("outdoor") || normalized.includes("sunset")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C8 3 6 6 6 10C6 14 10 16 12 16C14 16 18 14 18 10C18 6 16 3 12 3Z" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="16" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="2.5" fill={gold} />
      </svg>
    );
  }

  // Water Supply / Aquagaurd / Hot Water / Shower / Droplet
  if (
    normalized.includes("water") ||
    normalized.includes("aquagaurd") ||
    normalized.includes("droplet") ||
    normalized.includes("shower")
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 18C14.2091 18 16 16.2091 16 14C16 12.5 15 11 12 9C9 11 8 12.5 8 14C8 16.2091 9.79086 18 12 18Z" fill={gold} />
      </svg>
    );
  }

  // Power Backup / Battery / Smart Lighting / Lightbulb
  if (normalized.includes("power") || normalized.includes("battery") || normalized.includes("lighting") || normalized.includes("lightbulb")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="7" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 10L10 14H14L12 18" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Heating / Heater / Geyser / Snowflake
  if (normalized.includes("heating") || normalized.includes("heater") || normalized.includes("geyser") || normalized.includes("snowflake")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 12L19 5M12 12L5 19M12 12L19 19M12 12L5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.5" fill={gold} />
      </svg>
    );
  }

  // Dining Area / Table / Chairs / BBQ Grill / Meal / Breakfast
  if (
    normalized.includes("dining") ||
    normalized.includes("table") ||
    normalized.includes("chairs") ||
    normalized.includes("grill") ||
    normalized.includes("breakfast")
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8H21M6 8V21M18 8V21M10 8V15M14 8V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="4" r="1.5" fill={gold} />
        <path d="M8 4.5H16" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Default Fallback Icon (Elegant Diamond/Star)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z" fill={gold} />
    </svg>
  );
}
