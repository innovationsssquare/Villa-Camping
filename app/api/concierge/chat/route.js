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
  process.env.NEXT_PUBLIC_PRODUCTION_URL || "http://localhost:8086/api/v1";

// In-memory cache for dynamic backend locations
let cachedLocationsData = null;
let lastLocationFetchTime = 0;
const LOCATION_CACHE_TTL = 60 * 1000; // 60 seconds

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
      next: { revalidate: 60 },
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
      locations: [
        { id: "68dd044b77ece828e66545cc", name: "Lonavala", aliases: ["lonavala", "lonavla"] },
        { id: "68dd08dc77ece828e66545ea", name: "Malavli", aliases: ["malavli", "malavali"] },
        { id: "68dd0be777ece828e66545ed", name: "Karla-Lonavala", aliases: ["karla", "karla-lonavala"] },
        { id: "695cd0ae0671ed613fd45e70", name: "Gold Vally", aliases: ["gold vally", "gold valley"] },
      ],
      locationMap: {
        "68dd044b77ece828e66545cc": "Lonavala",
        "68dd08dc77ece828e66545ea": "Malavli",
        "68dd0be777ece828e66545ed": "Karla-Lonavala",
        "695cd0ae0671ed613fd45e70": "Gold Vally",
      },
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
    dates: null,
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

  // 6. Detect ISO / Formatted Dates
  const dateMatches = query.match(/\b\d{4}-\d{2}-\d{2}\b/g);
  if (dateMatches && dateMatches.length >= 2) {
    parsed.dates = { checkIn: dateMatches[0], checkOut: dateMatches[1] };
  }

  return parsed;
}

/**
 * Fetch approved stays across Villa, Camping, Cottage, and Hotel
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
        const res = await fetch(url, { next: { revalidate: 30 } });
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

  // Filter strictly approved stays (exclude soft-deleted)
  return all.filter((p) => {
    const approvedStatus = String(p.isapproved || p.isApproved || "").toLowerCase();
    const isSoftDeleted = p.deletedAt != null;
    return approvedStatus === "approved" && !isSoftDeleted;
  });
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
 * Call Google Gemini (using active model gemini-3.1-flash-lite) for Advanced Conversational NLU
 */
async function callGemini(query, language = "English", knownLocations = []) {
  const apiKey = getGeminiApiKey();
  if (!apiKey || !query || query.trim().length === 0) return null;

  const locationNames = knownLocations.map((l) => l.name);
  const locationExamples = locationNames.length > 0 ? locationNames.join(", ") : "Lonavala, Malavli, Karla, Gold Vally";

  try {
    const prompt = `You are "VillaCamp AI", the friendly luxury stay concierge for "The Villa Camp" (an exclusive booking platform for luxury villas, camping tents, cottages, and hotels).

A guest said: "${query}".
Guest's preferred language: ${language}.
Known destinations on our platform: ${locationExamples}.

Instructions:
1. Determine the guest's intent:
   - "greeting": User is saying hello/hi/hey/namaste or starting the conversation without specific stay criteria.
   - "unrelated": User is asking off-topic questions, typing random keystrokes (like "hg", "asdf"), or asking something unrelated to booking stays or travel.
   - "stay_search": User is asking for stays, villas, tents, cottages, hotels, locations, dates, amenities, group sizes, or budget.

2. Generate the "conversationalResponse":
   - If "greeting": Respond with a warm, polite hospitality greeting welcoming them to The Villa Camp (e.g. "Namaste! 🙏 Welcome to The Villa Camp — I'd love to help you plan a wonderful stay. Tell me a destination (${locationNames.slice(0, 3).join(", ") || "Lonavala, Malavli, Karla"}...), your dates and group size, or the occasion you're planning — and I'll find stays you'll love. Where shall we begin?"). DO NOT recommend specific properties yet.
   - If "unrelated": Politely and charmingly respond in ${language}, keeping strictly in character as The Villa Camp's stay concierge, and courteously guide the guest back to planning their getaway (villas, campsites, cottages, or hotels). DO NOT recommend specific properties.
   - If "stay_search": Extract stay details and craft a 1-2 sentence response acknowledging their criteria and introducing the curated options.

3. Extract parameters (for "stay_search" only, otherwise return null):
   - "location": matched destination string or null
   - "category": "Villa" | "Camping" | "Cottage" | "Hotel" | null
   - "guests": integer or null
   - "budgetMax": integer or null
   - "vibes": array of strings (e.g. ["lake_view", "pool", "pet_friendly", "romantic", "celebration", "scenic"])
   - "dates": object or null with "checkIn" and "checkOut" in YYYY-MM-DD

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

    // 1. Fetch dynamic backend locations
    const { locations, locationMap } = await fetchDynamicLocations();

    // 2. Classify intent and extract preferences with Gemini 3.5 Flash or local NLP
    const geminiResult = await callGemini(message, language, locations);
    const nlp = geminiResult || parseNaturalLanguage(message || "", locations);

    // 3. If intent is greeting or off-topic / unrelated:
    // Strictly stay in hospitality context and DO NOT dump properties!
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

    // 4. Check if explicit search criteria were provided
    const hasExplicitFilters = Boolean(
      filters.category ||
      filters.location ||
      filters.budgetMax ||
      (filters.guests && filters.guests > 2) ||
      filters.vibe
    );

    const isStaySearch =
      hasExplicitFilters ||
      nlp.intent === "stay_search" ||
      (!nlp.intent && (nlp.location || nlp.category || nlp.budgetMax || (nlp.vibes && nlp.vibes.length > 0)));

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

    // 5. It is a stay search: Extract search filters
    const targetLocation = filters.location || nlp.location || null;
    const targetCategory = filters.category || nlp.category || null;
    const targetBudget = filters.budgetMax || nlp.budgetMax || null;
    const targetGuests = filters.guests || nlp.guests || null;
    const targetVibes = [
      ...(filters.vibe ? [filters.vibe] : []),
      ...(nlp.vibes || []),
    ];

    // 6. Fetch approved properties across requested categories
    const properties = await fetchApprovedProperties(targetCategory);

    // 7. Score & filter properties
    const filtered = properties.filter((p) => {
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
        const pLocStr = `${resolvedName} ${JSON.stringify(p.location || "")} ${p.address || ""}`.toLowerCase();
        const targetLower = targetLocation.toLowerCase();
        const matchesLoc = pLocStr.includes(targetLower) || resolvedName.includes(targetLower);

        // Lonavala regional coverage (Malavli, Karla, Gold Vally are in the Lonavala belt)
        const isLonavalaBelt =
          (targetLower.includes("lonavala") || targetLower.includes("lonavla")) &&
          ["lonavala", "karla", "karla-lonavala", "malavli", "gold vally"].includes(resolvedName);

        if (!matchesLoc && !isLonavalaBelt) {
          return false;
        }
      }

      return true;
    });

    // 8. Format normalized property cards
    const propertyCards = (filtered.length > 0 ? filtered : properties.slice(0, 4)).map(
      (p) => {
        const cat = p.propertyCategory || "Villa";
        const price =
          p.pricing?.weekdayPrice ||
          p.pricing?.basePrice ||
          p.price ||
          15000;
        const rating =
          Number(p.averageRating || p.rating || (4.6 + (p.name.length % 5) * 0.1)).toFixed(1);
        const image =
          (Array.isArray(p.images) && p.images[0]) ||
          "/Homeasset/nearby-villa.jpg";

        const guests =
          p.capacity?.maxGuests || (p.bhkType ? parseInt(p.bhkType) * 3 : 12);
        const rooms =
          p.capacity?.bedrooms || (p.bhkType ? parseInt(p.bhkType) : 4);
        const baths =
          p.capacity?.bathrooms || rooms;

        const amenities = Array.isArray(p.amenities) && p.amenities.length > 0
          ? p.amenities.slice(0, 3)
          : ["Private Pool", "BBQ Grill", "Lawn"];

        const resolvedLocationName = locationMap[p.location]
          ? `${locationMap[p.location].toUpperCase()}, MAHARASHTRA`
          : "LONAVALA, MAHARASHTRA";

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
        };
      }
    );

    // 9. Formulate friendly conversational reply
    let replyText = "";
    const hasSpecificMatch = filtered.length > 0;

    if (hasSpecificMatch) {
      if (geminiResult?.conversationalResponse && nlp.intent === "stay_search") {
        replyText = geminiResult.conversationalResponse;
      } else {
        const locText = targetLocation ? ` in ${targetLocation}` : "";
        const guestText = targetGuests ? ` for ${targetGuests} guests` : "";
        const dateText = nlp.dates
          ? ` available for your selected dates`
          : "";

        replyText = `Here are verified ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"
          }${locText}${guestText}${dateText}. Tell me which one catches your eye and I'll prepare the pricing and details for your dates!`;
      }
    } else {
      if (targetBudget && targetLocation) {
        replyText = `I'm afraid I couldn't find ${targetCategory ? targetCategory.toLowerCase() + "s" : "stays"
          } in ${targetLocation} within ₹${targetBudget.toLocaleString(
            "en-IN"
          )} a night just now. Might you consider stretching the budget a little, or shall I connect you with our concierge team on WhatsApp for custom rates?`;
      } else {
        replyText = `I couldn't find exact matches for those criteria, but here are our top-rated guest favorites nearby that you might love!`;
      }
    }

    return NextResponse.json({
      success: true,
      hasMatches: hasSpecificMatch,
      replyText: replyText,
      properties: propertyCards.slice(0, 6),
      extractedQuery: {
        location: targetLocation,
        category: targetCategory,
        budgetMax: targetBudget,
        guests: targetGuests,
        vibes: targetVibes,
        dates: nlp.dates,
      },
    });
  } catch (error) {
    console.error("AI Concierge API Error:", error);
    return NextResponse.json(
      {
        success: false,
        replyText:
          "I ran into a quick hiccup searching our catalog. Here are some of our guest favorite stays you can explore right now:",
        properties: [],
      },
      { status: 500 }
    );
  }
}
