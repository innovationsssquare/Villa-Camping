import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m);
      if (match && match[1]) {
        process.env.GEMINI_API_KEY = match[1].trim();
        return process.env.GEMINI_API_KEY;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_PRODUCTION_URL ||
  "http://localhost:8086/api/v1";

// In-memory cache for dynamic backend locations
let cachedLocationsData = null;
let lastLocationFetchTime = 0;
const LOCATION_CACHE_TTL = 10 * 1000; // 10 seconds

/**
 * Fetch dynamic locations directly from backend /Location/get/locations
 */
async function fetchDynamicLocations() {
  const now = Date.now();
  if (cachedLocationsData && now - lastLocationFetchTime < LOCATION_CACHE_TTL) {
    return cachedLocationsData;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/Location/get/locations`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const rawLocations = Array.isArray(json.data) ? json.data : [];

      const locations = rawLocations.map((loc) => {
        const name = (loc.name || "").trim();
        const slug = (loc.slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();
        const aliases = new Set();
        if (name) aliases.add(name.toLowerCase());
        if (slug) aliases.add(slug.toLowerCase());

        if (name.includes("-")) {
          name.split("-").forEach((part) => {
            const p = part.trim().toLowerCase();
            if (p.length > 2) aliases.add(p);
          });
        }
        if (name.includes(" ")) {
          aliases.add(name.toLowerCase().replace(/\s+/g, ""));
        }
        return {
          id: String(loc._id),
          name: name,
          aliases: Array.from(aliases),
        };
      });

      const locationMap = {};
      rawLocations.forEach((loc) => {
        locationMap[String(loc._id)] = loc.name;
      });

      cachedLocationsData = { locations, locationMap };
      lastLocationFetchTime = now;
      return cachedLocationsData;
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic locations from backend:", err.message);
  }

  if (!cachedLocationsData) {
    cachedLocationsData = {
      locations: [],
      locationMap: {},
    };
  }

  return cachedLocationsData;
}

// Supported vibes / tags
const VIBE_TAGS = {
  lake_view: ["lake", "water", "river", "pawna"],
  pet_friendly: ["pet", "pets", "dog", "dogs"],
  best_rated: ["best", "top", "rated", "luxury", "star"],
  celebration: ["party", "celebration", "birthday", "group"],
  romantic: ["romantic", "couple", "honeymoon", "intimate"],
  scenic: ["scenic", "view", "mountain", "hill", "views"],
  pool: ["pool", "swimming", "swim", "plunge"],
};

const MONTHS_MAP = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
  apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
  aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

/**
 * Robust date parser supporting ISO, '07 Oct to 08 Oct', '7 to 8 oct', 'oct 7 to oct 8', etc.
 */
function parseQueryDates(text) {
  if (!text) return null;
  const q = text.toLowerCase();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const pad = (n) => String(n).padStart(2, "0");

  // 1. ISO format: YYYY-MM-DD to YYYY-MM-DD
  const isoMatches = q.match(/\b(\d{4}-\d{2}-\d{2})\b/g);
  if (isoMatches && isoMatches.length >= 2) {
    return { checkIn: isoMatches[0], checkOut: isoMatches[1] };
  }

  // 2. Pattern: DD Mon (YYYY)? to/till/- DD Mon (YYYY)?
  const monPattern = /\b(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})(?:\s+(\d{4}))?\s*(?:to|till|until|-)\s*(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})(?:\s+(\d{4}))?\b/i;
  const m1 = q.match(monPattern);
  if (m1) {
    const d1 = parseInt(m1[1], 10);
    const mon1 = MONTHS_MAP[m1[2].toLowerCase()];
    let y1 = m1[3] ? parseInt(m1[3], 10) : currentYear;

    const d2 = parseInt(m1[4], 10);
    const mon2 = MONTHS_MAP[m1[5].toLowerCase()];
    let y2 = m1[6] ? parseInt(m1[6], 10) : (m1[3] ? parseInt(m1[3], 10) : currentYear);

    if (mon1 !== undefined && mon2 !== undefined) {
      if (!m1[3] && (mon1 < currentMonth || (mon1 === currentMonth && d1 < currentDay))) {
        y1 += 1;
        y2 += 1;
      }
      return {
        checkIn: `${y1}-${pad(mon1 + 1)}-${pad(d1)}`,
        checkOut: `${y2}-${pad(mon2 + 1)}-${pad(d2)}`,
      };
    }
  }

  // 3. Pattern: DD to DD Mon (YYYY)? e.g. "07 to 08 Oct" or "7-8 october"
  const sameMonthPattern = /\b(\d{1,2})(?:st|nd|rd|th)?\s*(?:to|till|until|-)\s*(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})(?:\s+(\d{4}))?\b/i;
  const m2 = q.match(sameMonthPattern);
  if (m2) {
    const d1 = parseInt(m2[1], 10);
    const d2 = parseInt(m2[2], 10);
    const mon = MONTHS_MAP[m2[3].toLowerCase()];
    let y = m2[4] ? parseInt(m2[4], 10) : currentYear;
    if (mon !== undefined) {
      if (!m2[4] && (mon < currentMonth || (mon === currentMonth && d1 < currentDay))) {
        y += 1;
      }
      return {
        checkIn: `${y}-${pad(mon + 1)}-${pad(d1)}`,
        checkOut: `${y}-${pad(mon + 1)}-${pad(d2)}`,
      };
    }
  }

  // 4. Pattern: Mon DD to Mon DD e.g. "oct 7 to oct 8"
  const monFirstPattern = /\b([a-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\s*(?:to|till|until|-)\s*([a-z]{3,9})?\s*(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/i;
  const m3 = q.match(monFirstPattern);
  if (m3) {
    const mon1 = MONTHS_MAP[m3[1].toLowerCase()];
    const d1 = parseInt(m3[2], 10);
    let y1 = m3[3] ? parseInt(m3[3], 10) : currentYear;

    const mon2 = m3[4] ? MONTHS_MAP[m3[4].toLowerCase()] : mon1;
    const d2 = parseInt(m3[5], 10);
    let y2 = m3[6] ? parseInt(m3[6], 10) : y1;

    if (mon1 !== undefined && mon2 !== undefined) {
      if (!m3[3] && (mon1 < currentMonth || (mon1 === currentMonth && d1 < currentDay))) {
        y1 += 1;
        y2 += 1;
      }
      return {
        checkIn: `${y1}-${pad(mon1 + 1)}-${pad(d1)}`,
        checkOut: `${y2}-${pad(mon2 + 1)}-${pad(d2)}`,
      };
    }
  }

  return null;
}

function formatDateRange(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "";
  try {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const opts = { day: "2-digit", month: "short" };
    return `${d1.toLocaleDateString("en-US", opts)} – ${d2.toLocaleDateString("en-US", opts)}`;
  } catch {
    return `${checkIn} to ${checkOut}`;
  }
}

/**
 * Intelligent Rule-based NLP Query Parser (Zero external API cost fallback)
 */
function parseNaturalLanguage(text = "", knownLocations = []) {
  const query = (text || "").trim().toLowerCase();
  const locationNames = knownLocations.map((l) => l.name);
  const sampleLocs = locationNames.slice(0, 3).join(", ") || "Lonavala, Malavli, Karla";

  // Check 1: Greetings (Namaste, Hi, Hello, Hey)
  const greetingWords = ["hi", "hello", "hey", "namaste", "namaskar", "hii", "heyy", "good morning", "good evening", "greetings", "hola", "yo"];
  if (greetingWords.includes(query) || /^(hi+|hey+|hello+|namaste)\b/i.test(query)) {
    return {
      intent: "greeting",
      conversationalResponse: `Namaste! 🙏 Welcome to The Villa Camp — I'd love to help you plan a wonderful stay. Tell me a destination (${sampleLocs}...), your dates and group size, or the occasion you're planning — and I'll find stays you'll love. Where shall we begin?`,
      location: null,
      category: null,
      guests: null,
      budgetMax: null,
      vibes: [],
      dates: null,
    };
  }

  // Check 2: Stay keywords vs Off-topic / Gibberish (e.g. "hg", "123", "joke")
  const stayKeywords = [
    "villa", "villas", "camp", "camping", "tent", "tents", "cottage", "cottages", "hotel", "hotels",
    "stay", "stays", "resort", "resorts", "pool", "lake", "night", "nights", "room", "rooms",
    "book", "booking", "budget", "price", "guest", "guests", "people", "adult", "adults", "bhk",
    "view", "pet", "couple", "family", "party", "luxury"
  ];
  const hasStayKeyword = stayKeywords.some((kw) => query.includes(kw));
  const hasLocationMatch = knownLocations.some((loc) =>
    loc.aliases.some((alias) => query.includes(alias))
  );

  if (!hasStayKeyword && !hasLocationMatch && query.length < 7) {
    return {
      intent: "unrelated",
      conversationalResponse: `It would be my pleasure to help you plan your getaway with The Villa Camp! Tell me what kind of stay you're dreaming of — whether a private pool villa, lakeside campsite, cozy cottage, or luxury hotel — and where you'd like to travel. Where shall we begin?`,
      location: null,
      category: null,
      guests: null,
      budgetMax: null,
      vibes: [],
      dates: null,
    };
  }

  const parsed = {
    intent: "stay_search",
    location: null,
    category: null,
    guests: null,
    budgetMax: null,
    vibes: [],
    dates: parseQueryDates(text),
    conversationalResponse: null,
  };

  // 1. Detect Location using dynamic knownLocations
  for (const loc of knownLocations) {
    if (loc.aliases.some((alias) => query.includes(alias))) {
      parsed.location = loc.name;
      break;
    }
  }

  // 2. Detect Category
  if (query.includes("camp") || query.includes("tent")) {
    parsed.category = "Camping";
  } else if (query.includes("cottage")) {
    parsed.category = "Cottage";
  } else if (query.includes("hotel") || query.includes("resort")) {
    parsed.category = "Hotel";
  } else if (query.includes("villa") || query.includes("stay") || query.includes("home")) {
    parsed.category = "Villa";
  }

  // 3. Detect Guests
  const guestsMatch =
    query.match(/(\d+)\s*(?:adults?|guests?|people|persons?|pax)/) ||
    query.match(/for\s*(\d+)/);
  if (guestsMatch) {
    parsed.guests = parseInt(guestsMatch[1], 10);
  }

  // 4. Detect Budget (e.g. under 10000, under 15k, budget 20000)
  const kBudgetMatch = query.match(/(?:under|below|within|max|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*k/);
  if (kBudgetMatch) {
    parsed.budgetMax = parseInt(kBudgetMatch[1], 10) * 1000;
  } else {
    const rawBudgetMatch = query.match(
      /(?:under|below|within|max|budget)\s*(?:₹|rs\.?|inr)?\s*(\d{4,6})/
    );
    if (rawBudgetMatch) {
      parsed.budgetMax = parseInt(rawBudgetMatch[1], 10);
    }
  }

  // 5. Detect Vibes
  for (const [vibeKey, keywords] of Object.entries(VIBE_TAGS)) {
    if (keywords.some((kw) => query.includes(kw))) {
      parsed.vibes.push(vibeKey);
    }
  }

  // 6. Dates already parsed with parseQueryDates
  if (!parsed.dates) {
    const dateMatches = query.match(/\b\d{4}-\d{2}-\d{2}\b/g);
    if (dateMatches && dateMatches.length >= 2) {
      parsed.dates = { checkIn: dateMatches[0], checkOut: dateMatches[1] };
    }
  }

  return parsed;
}

/**
 * Format property into normalized card structure
 */
function formatPropertyCard(p, locationMap = {}) {
  const cat = p.propertyCategory || "Villa";
  const price =
    p.pricing?.weekdayPrice ||
    p.pricing?.basePrice ||
    p.price ||
    12000;
  const rating = Number(p.averageRating || p.rating || 4.8).toFixed(1);
  const image =
    (Array.isArray(p.images) && p.images[0]) ||
    "/Homeasset/nearby-villa.jpg";

  const guests =
    p.capacity?.maxGuests || (p.bhkType ? parseInt(p.bhkType) * 3 : 10);
  const rooms =
    p.capacity?.bedrooms || (p.bhkType ? parseInt(p.bhkType) : 3);
  const baths =
    p.capacity?.bathrooms || rooms;

  const amenities =
    Array.isArray(p.amenities) && p.amenities.length > 0
      ? p.amenities.slice(0, 3)
      : ["Private Pool", "BBQ Grill", "Lawn"];

  const rawLoc = locationMap[p.location] || p.address?.city || p.address?.area || "Lonavala";
  const resolvedLocationName = `${rawLoc.trim().toUpperCase()}, MAHARASHTRA`;

  return {
    id: p._id,
    name: p.name || p.title || "Luxury Stay",
    category: cat,
    link: `/view-${cat}/${p._id}`,
    rating: rating,
    location: resolvedLocationName,
    price: price,
    image: image,
    guests: guests,
    rooms: rooms,
    baths: baths,
    amenities: amenities,
    isPromoted: Boolean(p.isPromoted),
    isMostBooked: (p.totalBookingsCount || 0) >= 2,
    customBadge: p.customBadge || "",
  };
}

/**
 * Fetch approved stays live from MongoDB (no stale cache)
 */
async function fetchApprovedProperties(category) {
  const endpoints = [];
  if (!category || category === "Villa") {
    endpoints.push({ cat: "Villa", url: `${BACKEND_URL}/Villa/get/villas` });
  }
  if (!category || category === "Camping") {
    endpoints.push({ cat: "Camping", url: `${BACKEND_URL}/Camping/get/campings` });
  }
  if (!category || category === "Cottage") {
    endpoints.push({ cat: "Cottage", url: `${BACKEND_URL}/Cottage/get/cottages` });
  }
  if (!category || category === "Hotel") {
    endpoints.push({ cat: "Hotel", url: `${BACKEND_URL}/Hotel/get/hotels` });
  }

  const results = await Promise.allSettled(
    endpoints.map(async ({ cat, url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        return items.map((item) => ({ ...item, propertyCategory: cat }));
      } catch {
        return [];
      }
    })
  );

  const all = [];
  results.forEach((r) => {
    if (r.status === "fulfilled" && Array.isArray(r.value)) {
      all.push(...r.value);
    }
  });

  // Filter strictly approved & live stays (exclude soft-deleted or removed)
  return all.filter((p) => {
    const approvedStatus = String(p.isapproved || p.isApproved || "").toLowerCase();
    const isSoftDeleted = p.deletedAt != null || p.status === "deleted";
    return approvedStatus === "approved" && !isSoftDeleted && p.isLive !== false;
  });
}

/**
 * Check live stay availability against backend MongoDB / Booking collection
 */
async function checkStayAvailability(propertyId, category, checkIn, checkOut) {
  if (!propertyId || !checkIn || !checkOut) return true;
  try {
    const res = await fetch(`${BACKEND_URL}/User/check-availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, category, checkIn, checkOut }),
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return json.available === true;
    }

    // Fallback to /User/villa/check-availability
    const villaRes = await fetch(`${BACKEND_URL}/User/villa/check-availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, checkIn, checkOut }),
      cache: "no-store",
    });
    if (villaRes.ok) {
      const vJson = await villaRes.json();
      return vJson.available === true;
    }
  } catch (err) {
    console.warn("checkStayAvailability warning:", err.message);
  }
  return false;
}

export async function GET() {
  const { locations } = await fetchDynamicLocations();
  return NextResponse.json({
    success: true,
    mascot: {
      name: "VillaCamp AI",
      tagline: "Your Personal Stay Concierge",
      avatar: "/assets/ai-concierge-mascot.png",
    },
    locations: locations.map((l) => l.name),
    quickVibes: [
      { id: "lake_view", label: "Lake view", icon: "Waves" },
      { id: "pet_friendly", label: "Pet friendly", icon: "PawPrint" },
      { id: "best_rated", label: "Best rated", icon: "Star" },
      { id: "celebration", label: "Celebration homes", icon: "Gift" },
      { id: "romantic", label: "Romantic getaways", icon: "Heart" },
      { id: "scenic", label: "Impeccable views", icon: "Mountain" },
      { id: "pool", label: "Private pool", icon: "Sparkles" },
    ],
    languages: [
      { code: "en", name: "English" },
      { code: "hi", name: "हिन्दी" },
      { code: "mr", name: "मराठी" },
      { code: "gu", name: "ગુજરાતી" },
      { code: "ta", name: "தமிழ்" },
      { code: "kn", name: "ಕನ್ನಡ" },
      { code: "pa", name: "ਪੰਜਾਬੀ" },
      { code: "bn", name: "বাংলা" },
      { code: "te", name: "తెలుగు" },
      { code: "ml", name: "മലയാളം" },
    ],
  });
}

/**
 * Call Google Gemini (using active model gemini-3.1-flash-lite) grounded in real active database catalog
 */
async function callGemini(query, language = "English", knownLocations = [], catalogSummary = "") {
  const apiKey = getGeminiApiKey();
  if (!apiKey || !query || query.trim().length === 0) return null;

  const locationNames = knownLocations.map((l) => l.name);
  const locationExamples = locationNames.length > 0 ? locationNames.join(", ") : "Lonavala, Malavli, Karla, Gold Vally";

  const todayIST = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const todayISO = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // YYYY-MM-DD

  try {
    const prompt = `You are "VillaCamp AI", the friendly luxury stay concierge for "The Villa Camp" (an exclusive booking platform for luxury villas, camping tents, cottages, and hotels).

A guest said: "${query}".
Guest's preferred language: ${language}.
Current Date in India (IST): ${todayIST} (${todayISO}).
Known destinations on our platform: ${locationExamples}.

Live Database Catalog Ground Truth & Availability:
${catalogSummary || "Active database catalog is live."}

Instructions:
1. Determine the guest's intent:
   - "greeting": User is saying hello/hi/hey/namaste or starting the conversation without specific stay criteria.
   - "unrelated": User is asking off-topic questions, typing random keystrokes (like "hg", "asdf"), or asking something unrelated to booking stays or travel.
   - "stay_search": User is asking for stays, villas, tents, cottages, hotels, locations, dates, amenities, group sizes, or budget.

2. Generate the "conversationalResponse":
   - If "greeting": Respond with a warm, polite hospitality greeting welcoming them to The Villa Camp. DO NOT recommend specific properties yet.
   - If "unrelated": Politely and charmingly respond in ${language}, keeping strictly in character as The Villa Camp's stay concierge, and courteously guide the guest back to planning their getaway. DO NOT recommend specific properties.
   - If "stay_search":
     * If properties are listed as "ALREADY BOOKED / UNAVAILABLE" for the guest's requested dates: Politely inform the guest that the property is already booked for those dates. Suggest alternative dates or invite them to connect with our concierge team on WhatsApp (+91 86691 86483). DO NOT claim or pretend the property is available for those dates.
     * If the database catalog has 0 properties or NO matching properties exist: Politely inform the guest that no properties are currently available in the database for those criteria, and invite them to check back soon or connect with our concierge team on WhatsApp (+91 86691 86483). DO NOT fabricate, invent, or name deleted properties.
     * If matching properties exist and are CONFIRMED AVAILABLE: Acknowledge their criteria and warmly introduce the options in 1-2 sentences.

3. Extract parameters (for "stay_search" only, otherwise return null):
   - "location": matched destination string or null
   - "category": "Villa" | "Camping" | "Cottage" | "Hotel" | null
   - "guests": integer or null
   - "budgetMax": integer or null
   - "vibes": array of strings (e.g. ["lake_view", "pool", "pet_friendly", "romantic", "celebration", "scenic"])
   - "dates": object or null with "checkIn" and "checkOut" in YYYY-MM-DD. Relative to today's date (${todayISO}), compute exact dates.

Return strictly a valid JSON object matching:
{
  "intent": "greeting" | "unrelated" | "stay_search",
  "location": string or null,
  "category": string or null,
  "guests": number or null,
  "budgetMax": number or null,
  "vibes": string[],
  "dates": { "checkIn": string, "checkOut": string } | null,
  "conversationalResponse": string
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("Gemini API returned status", res.status, errText.slice(0, 100));
      return null;
    }
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;
    return JSON.parse(rawText);
  } catch (err) {
    console.warn("Gemini call fell back to local NLP:", err.message);
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, filters = {}, language = "English" } = body;

    // 1. Fetch dynamic backend locations (live)
    const { locations, locationMap } = await fetchDynamicLocations();

    // 2. Fetch live catalog across all categories for real database ground truth
    const allCatalogProperties = await fetchApprovedProperties();

    // 3. Early date extraction (from filters or natural language query)
    const earlyDates =
      filters.dates ||
      (filters.checkIn && filters.checkOut
        ? { checkIn: filters.checkIn, checkOut: filters.checkOut }
        : null) ||
      parseQueryDates(message);

    // 4. Pre-check live availability if dates are known
    const availabilityMap = {};
    if (earlyDates?.checkIn && earlyDates?.checkOut) {
      await Promise.all(
        allCatalogProperties.map(async (p) => {
          const isAvail = await checkStayAvailability(
            p._id,
            p.propertyCategory || "Villa",
            earlyDates.checkIn,
            earlyDates.checkOut
          );
          availabilityMap[String(p._id)] = isAvail;
        })
      );
    }

    // 5. Construct ground truth catalog summary with live availability status
    let catalogSummary = "";
    if (allCatalogProperties.length === 0) {
      catalogSummary = "Active properties in database: NONE (0 properties in database)";
    } else if (earlyDates?.checkIn && earlyDates?.checkOut) {
      const availableList = allCatalogProperties.filter((p) => availabilityMap[String(p._id)] === true);
      const bookedList = allCatalogProperties.filter((p) => availabilityMap[String(p._id)] === false);
      catalogSummary = `Guest requested dates: ${earlyDates.checkIn} to ${earlyDates.checkOut}.
Live Availability:
- CONFIRMED AVAILABLE (${availableList.length}): ${availableList.map((p) => `${p.name} (${p.propertyCategory || "Villa"} in ${locationMap[p.location] || p.address?.city || "Lonavala"})`).join(", ") || "NONE"}
- ALREADY BOOKED / UNAVAILABLE (${bookedList.length}): ${bookedList.map((p) => `${p.name} (${p.propertyCategory || "Villa"} in ${locationMap[p.location] || p.address?.city || "Lonavala"})`).join(", ") || "NONE"}`;
    } else {
      catalogSummary = `Active properties in database (${allCatalogProperties.length}): ${allCatalogProperties.map((p) => `${p.name} (${p.propertyCategory || "Villa"} in ${locationMap[p.location] || p.address?.city || "Lonavala"})`).slice(0, 8).join(", ")}`;
    }

    // 6. Classify intent and extract preferences with Gemini or local NLP
    const geminiResult = await callGemini(message, language, locations, catalogSummary);
    const nlp = geminiResult || parseNaturalLanguage(message || "", locations);

    // Resolve final target dates (merging earlyDates and nlp.dates)
    const targetDates = earlyDates || nlp.dates || null;

    // If Gemini detected dates that were not checked yet, run availability check for them
    if (!earlyDates && targetDates?.checkIn && targetDates?.checkOut) {
      await Promise.all(
        allCatalogProperties.map(async (p) => {
          const isAvail = await checkStayAvailability(
            p._id,
            p.propertyCategory || "Villa",
            targetDates.checkIn,
            targetDates.checkOut
          );
          availabilityMap[String(p._id)] = isAvail;
        })
      );
    }

    // 7. If intent is greeting or off-topic / unrelated:
    const isGreeting = nlp.intent === "greeting";
    const isUnrelated = nlp.intent === "unrelated";
    const hasSearchLocation = Boolean(filters.location || nlp.location);

    if (isGreeting || (isUnrelated && !hasSearchLocation)) {
      const sampleLocs = locations.slice(0, 3).map((l) => l.name).join(", ") || "Lonavala, Malavli, Karla";
      const defaultGreeting = `Namaste! 🙏 Welcome to The Villa Camp — I'd love to help you plan a wonderful stay. Tell me a destination (${sampleLocs}...), your dates and group size, or the occasion you're planning — and I'll find stays you'll love. Where shall we begin?`;
      const defaultUnrelated = `It would be my pleasure to help you plan your getaway with The Villa Camp! Tell me what kind of stay you're looking for — whether a private pool villa, scenic campsite, cozy cottage, or boutique hotel — and where you'd like to travel. Where shall we begin?`;

      return NextResponse.json({
        success: true,
        intent: nlp.intent || "greeting",
        hasMatches: false,
        replyText:
          nlp.conversationalResponse ||
          (nlp.intent === "unrelated" ? defaultUnrelated : defaultGreeting),
        properties: [],
        extractedQuery: {
          location: null,
          category: null,
          budgetMax: null,
          guests: null,
          vibes: [],
          dates: null,
        },
      });
    }

    // 8. Check if search criteria were provided
    const hasExplicitFilters = Boolean(
      filters.category ||
      filters.location ||
      filters.budgetMax ||
      (filters.guests && filters.guests > 2) ||
      filters.vibe ||
      targetDates
    );

    const isStaySearch =
      hasExplicitFilters ||
      nlp.intent === "stay_search" ||
      (!nlp.intent && (nlp.location || nlp.category || nlp.budgetMax || (nlp.vibes && nlp.vibes.length > 0) || targetDates));

    if (!isStaySearch) {
      const sampleLocs = locations.slice(0, 3).map((l) => l.name).join(", ") || "Lonavala, Malavli, Karla";
      const defaultGreeting = `Namaste! 🙏 Welcome to The Villa Camp — I'd love to help you plan a wonderful stay. Tell me a destination (${sampleLocs}...), your dates and group size, or the occasion you're planning — and I'll find stays you'll love. Where shall we begin?`;

      return NextResponse.json({
        success: true,
        intent: "greeting",
        hasMatches: false,
        replyText: defaultGreeting,
        properties: [],
        extractedQuery: {
          location: null,
          category: null,
          budgetMax: null,
          guests: null,
          vibes: [],
          dates: null,
        },
      });
    }

    // 9. Extract search filters
    const targetLocation = filters.location || nlp.location || null;
    const targetCategory = filters.category || nlp.category || null;
    const targetBudget = filters.budgetMax || nlp.budgetMax || null;
    const targetGuests = filters.guests || nlp.guests || null;
    const targetVibes = [
      ...(filters.vibe ? [filters.vibe] : []),
      ...(nlp.vibes || []),
    ];

    // Filter properties for the requested category
    const categoryProperties = targetCategory
      ? allCatalogProperties.filter(
          (p) => (p.propertyCategory || "Villa").toLowerCase() === targetCategory.toLowerCase()
        )
      : allCatalogProperties;

    // SCENARIO 1: Entire catalog is empty OR requested category has 0 properties in the database
    if (categoryProperties.length === 0) {
      let emptyMessage = "";
      if (allCatalogProperties.length === 0) {
        emptyMessage = `We currently do not have any verified stays available in our database at the moment. Our collection is regularly updated with new exclusive properties — please check back shortly, or connect directly with our 24/7 concierge team on WhatsApp (+91 86691 86483) for customized bookings!`;
      } else if (targetCategory) {
        const availableCategories = Array.from(
          new Set(allCatalogProperties.map((p) => p.propertyCategory || "Villa"))
        );
        emptyMessage = `We currently do not have any active ${targetCategory.toLowerCase()} listings in our database. However, we do have verified ${availableCategories.join(" and ")} available! Would you like to explore those, or connect with our concierge team on WhatsApp (+91 86691 86483)?`;
      } else {
        emptyMessage = `We couldn't find any stays in our database at the moment. Feel free to connect directly with our concierge team on WhatsApp (+91 86691 86483) for personal assistance!`;
      }

      return NextResponse.json({
        success: true,
        hasMatches: false,
        replyText: emptyMessage,
        properties: [],
        extractedQuery: {
          location: targetLocation,
          category: targetCategory,
          budgetMax: targetBudget,
          guests: targetGuests,
          vibes: targetVibes,
          dates: targetDates,
        },
      });
    }

    // 10. Filter available category properties by criteria (budget, guests, location)
    const filtered = categoryProperties.filter((p) => {
      // Price ceiling filter
      const price =
        p.pricing?.weekdayPrice ||
        p.pricing?.basePrice ||
        p.price ||
        0;
      if (targetBudget && price > targetBudget) {
        return false;
      }

      // Guest capacity filter
      const maxGuests =
        p.capacity?.maxGuests ||
        p.maxGuests ||
        (p.bhkType ? parseInt(p.bhkType) * 3 : 10);
      if (targetGuests && maxGuests < targetGuests) {
        return false;
      }

      // Location match (if provided)
      if (targetLocation) {
        const resolvedName = (locationMap[p.location] || "").toLowerCase();
        const pLocStr = `${resolvedName} ${JSON.stringify(p.location || "")} ${JSON.stringify(p.address || "")}`.toLowerCase();
        const targetLower = targetLocation.toLowerCase();
        const matchesLoc = pLocStr.includes(targetLower) || resolvedName.includes(targetLower);

        // Lonavala regional coverage (Malavli, Karla, Gold Vally, Kusegaon)
        const isLonavalaBelt =
          (targetLower.includes("lonavala") || targetLower.includes("lonavla")) &&
          ["lonavala", "karla", "karla-lonavala", "malavli", "gold vally", "kusegaon"].some((term) =>
            pLocStr.includes(term) || resolvedName.includes(term)
          );

        if (!matchesLoc && !isLonavalaBelt) {
          return false;
        }
      }

      return true;
    });

    // SCENARIO 2A: Properties exist in DB, but NONE match the user's filters (budget, location, or guests)
    if (filtered.length === 0) {
      let replyText = "";
      let fallbackProperties = [];

      if (targetBudget) {
        const minPrice = Math.min(
          ...categoryProperties
            .map((p) => p.pricing?.weekdayPrice || p.pricing?.basePrice || p.price || 0)
            .filter((pr) => pr > 0)
        );
        replyText = `I couldn't find any ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"}${targetLocation ? ` in ${targetLocation}` : ""} under ₹${targetBudget.toLocaleString("en-IN")}/night. Stays in our verified collection start from ₹${minPrice.toLocaleString("en-IN")}/night. Here are our available verified options in the database:`;
        fallbackProperties = categoryProperties.slice(0, 4);
      } else if (targetLocation) {
        const availableLocs = Array.from(
          new Set(
            categoryProperties
              .map((p) => locationMap[p.location] || p.address?.city || p.location?.name)
              .filter(Boolean)
          )
        );
        replyText = `We currently don't have active ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"} in ${targetLocation}. Our verified properties are situated in ${availableLocs.join(", ") || "Lonavala"}. Here are the stays currently available in our collection:`;
        fallbackProperties = categoryProperties.slice(0, 4);
      } else if (targetGuests) {
        const maxCapacity = Math.max(
          ...categoryProperties.map((p) => p.capacity?.maxGuests || p.maxGuests || 0)
        );
        replyText = `None of our current listings can accommodate ${targetGuests} guests in a single property (our maximum capacity is ${maxCapacity} guests). However, our concierge team can arrange adjacent stays or split reservations. Feel free to contact our concierge team on WhatsApp (+91 86691 86483)!`;
        fallbackProperties = [];
      } else {
        replyText = `I couldn't find exact matches for those criteria in our current database, but here are our available verified stays you can explore:`;
        fallbackProperties = categoryProperties.slice(0, 4);
      }

      const propertyCards = fallbackProperties.map((p) => formatPropertyCard(p, locationMap));

      return NextResponse.json({
        success: true,
        hasMatches: false,
        replyText,
        properties: propertyCards,
        extractedQuery: {
          location: targetLocation,
          category: targetCategory,
          budgetMax: targetBudget,
          guests: targetGuests,
          vibes: targetVibes,
          dates: targetDates,
        },
      });
    }

    // SCENARIO 2B: Criteria matched, but verify LIVE AVAILABILITY for requested dates
    if (targetDates?.checkIn && targetDates?.checkOut) {
      const availableForDates = filtered.filter((p) => availabilityMap[String(p._id)] === true);
      const bookedForDates = filtered.filter((p) => availabilityMap[String(p._id)] === false);

      if (availableForDates.length === 0) {
        const dateStr = formatDateRange(targetDates.checkIn, targetDates.checkOut);
        let replyText = "";
        if (bookedForDates.length > 0) {
          const bookedNames = bookedForDates.map((p) => p.name).join(", ");
          replyText = `I checked our live reservation system for ${dateStr}, and unfortunately ${bookedNames} is already booked for those dates.\n\nWould you like to explore alternative dates (such as next weekend or mid-week), or connect directly with our 24/7 concierge team on WhatsApp (+91 86691 86483) for customized arrangements?`;
        } else {
          replyText = `We don't have any verified ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"} available for ${dateStr}. Please consider checking alternative dates, or message our concierge team on WhatsApp (+91 86691 86483)!`;
        }

        return NextResponse.json({
          success: true,
          hasMatches: false,
          replyText,
          properties: [],
          extractedQuery: {
            location: targetLocation,
            category: targetCategory,
            budgetMax: targetBudget,
            guests: targetGuests,
            vibes: targetVibes,
            dates: targetDates,
          },
        });
      }

      // Properties confirmed available for the dates!
      const propertyCards = availableForDates.map((p) => formatPropertyCard(p, locationMap));
      const dateStr = formatDateRange(targetDates.checkIn, targetDates.checkOut);
      let replyText = "";
      if (
        geminiResult?.conversationalResponse &&
        nlp.intent === "stay_search" &&
        !geminiResult.conversationalResponse.includes("favorites nearby") &&
        !geminiResult.conversationalResponse.toLowerCase().includes("booked")
      ) {
        replyText = geminiResult.conversationalResponse;
      } else {
        const locText = targetLocation ? ` in ${targetLocation}` : "";
        const guestText = targetGuests ? ` for ${targetGuests} guests` : "";
        replyText = `Good news! Here are verified ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"}${locText}${guestText} confirmed available for ${dateStr}:`;
      }

      return NextResponse.json({
        success: true,
        hasMatches: true,
        replyText,
        properties: propertyCards.slice(0, 6),
        extractedQuery: {
          location: targetLocation,
          category: targetCategory,
          budgetMax: targetBudget,
          guests: targetGuests,
          vibes: targetVibes,
          dates: targetDates,
        },
      });
    }

    // SCENARIO 3: Matches found in active database (no specific dates queried)
    const propertyCards = filtered.map((p) => formatPropertyCard(p, locationMap));

    let replyText = "";
    if (
      geminiResult?.conversationalResponse &&
      nlp.intent === "stay_search" &&
      !geminiResult.conversationalResponse.includes("favorites nearby")
    ) {
      replyText = geminiResult.conversationalResponse;
    } else {
      const locText = targetLocation ? ` in ${targetLocation}` : "";
      const guestText = targetGuests ? ` for ${targetGuests} guests` : "";
      replyText = `Here are verified ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"}${locText}${guestText}. Tell me which one catches your eye and I'll prepare the pricing and details for your dates!`;
    }

    return NextResponse.json({
      success: true,
      hasMatches: true,
      replyText,
      properties: propertyCards.slice(0, 6),
      extractedQuery: {
        location: targetLocation,
        category: targetCategory,
        budgetMax: targetBudget,
        guests: targetGuests,
        vibes: targetVibes,
        dates: targetDates,
      },
    });
  } catch (error) {
    console.error("AI Concierge API Error:", error);
    return NextResponse.json(
      {
        success: false,
        replyText:
          "I ran into a quick hiccup searching our live catalog. Please feel free to explore our collection or connect with our concierge team on WhatsApp (+91 86691 86483)!",
        properties: [],
      },
      { status: 500 }
    );
  }
}
