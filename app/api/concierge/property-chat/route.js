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
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8086/api/v1";

/**
 * Synthesize rich spaces if a property listing doesn't have an explicit spaces array
 */
function synthesizeSpaces(property, category = "Villa") {
  if (Array.isArray(property.spaces) && property.spaces.length > 0) {
    return property.spaces.map((s, idx) => {
      let badge = "ROOM";
      const nameLower = (s.name || "").toLowerCase();
      const descLower = (s.description || "").toLowerCase();
      const combined = `${nameLower} ${descLower}`;

      if (combined.includes("king")) badge = "KING-SIZED BED";
      else if (combined.includes("queen")) badge = "QUEEN-SIZED BED";
      else if (combined.includes("double")) badge = "DOUBLE BED";
      else if (combined.includes("living")) badge = "LIVING & LOUNGE";
      else if (combined.includes("pool")) badge = "PRIVATE POOL";
      else if (combined.includes("lawn") || combined.includes("garden")) badge = "OUTDOOR LAWN";
      else if (combined.includes("terrace") || combined.includes("balcony")) badge = "SCENIC BALCONY";
      else if (combined.includes("kitchen") || combined.includes("dining")) badge = "DINING & KITCHEN";
      else if (nameLower.includes("bedroom") || nameLower.includes("room")) badge = "KING-SIZED BED";

      const detailsList = Array.isArray(s.details) && s.details.length > 0
        ? s.details
        : [
            `Located on the ${idx === 0 ? "ground" : "first"} floor`,
            "Equipped with AC, high-speed Wi-Fi, and plush bedding",
            "Attached ensuite bathroom with modern amenities"
          ];

      return {
        id: s._id || `space-${idx}`,
        name: s.name || `Bedroom ${idx + 1}`,
        image: s.image || (property.images && property.images[idx % property.images.length]) || "/placeholder.svg",
        badge: badge,
        description: s.description || `Comfortable and spacious living space designed for ultimate relaxation.`,
        details: detailsList,
      };
    });
  }

  // Synthesis from bhkType, rooms, and images
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : ["/placeholder.svg"];

  const synthesized = [];
  const bhkMatch = (property.bhkType || "").match(/(\d+)\s*BHK/i);
  const roomCount = property.rooms || (bhkMatch ? parseInt(bhkMatch[1], 10) : 2);

  // Generate Bedrooms
  for (let i = 1; i <= Math.max(1, roomCount); i++) {
    synthesized.push({
      id: `synth-bed-${i}`,
      name: `Bedroom ${i}`,
      image: images[(i - 1) % images.length],
      badge: i === 1 ? "KING-SIZED BED" : "QUEEN-SIZED BED",
      description: `Spacious master bedroom located on the ${i === 1 ? "ground" : "upper"} level with panoramic views.`,
      details: [
        `This bedroom is on the ${i === 1 ? "ground" : "first"} floor.`,
        `Includes an AC, Wi-Fi, and premium linens.`,
        `Attached ensuite washroom with 24/7 hot water.`,
      ],
    });
  }

  // Generate Living Room / Common Area
  if (images.length > 1) {
    synthesized.push({
      id: "synth-living",
      name: "Living & Lounge Area",
      image: images[images.length > roomCount ? roomCount : 0],
      badge: "LIVING AREA",
      description: "Airy open-plan living room with plush sofas, ambient lighting, and music setup.",
      details: [
        "Spacious seating area accommodating all guests.",
        "Includes flat-screen TV, high-speed Wi-Fi, and indoor games.",
        "Seamless connectivity to the dining and outdoor deck.",
      ],
    });
  }

  // Generate Private Pool / Lawn if available in amenities
  const amenitiesStr = (property.amenities || []).join(" ").toLowerCase();
  if (amenitiesStr.includes("pool") || (property.greatFor || []).some(g => g.toLowerCase().includes("pool"))) {
    synthesized.push({
      id: "synth-pool",
      name: "Private Swimming Pool",
      image: images[images.length - 1],
      badge: "PRIVATE POOL",
      description: "Crystal-clear private swimming pool surrounded by a sundeck and loungers.",
      details: [
        "Exclusive private pool access for your group.",
        "Equipped with loungers, pool towels, and evening lighting.",
        "Regularly sanitized and maintained daily.",
      ],
    });
  } else if (amenitiesStr.includes("lawn") || amenitiesStr.includes("garden")) {
    synthesized.push({
      id: "synth-lawn",
      name: "Lawn & Outdoor Garden",
      image: images[images.length - 1],
      badge: "OUTDOOR LAWN",
      description: "Lush green manicured lawn perfect for morning tea, sunset strolls, or family games.",
      details: [
        "Spacious open-air green area with mountain views.",
        "Ideal for celebrations, evening bonfires, and barbecue.",
        "Pet-friendly outdoor open space.",
      ],
    });
  }

  return synthesized;
}

/**
 * Intelligent Rule-based Intent Classifier for Property-Specific Questions
 */
function classifyPropertyIntent(query = "") {
  const q = query.toLowerCase().trim();

  // 1. Spaces & Rooms
  if (
    q.includes("space") ||
    q.includes("spaces") ||
    q.includes("room") ||
    q.includes("rooms") ||
    q.includes("bedroom") ||
    q.includes("bedrooms") ||
    q.includes("bed") ||
    q.includes("beds") ||
    q.includes("living room") ||
    q.includes("how many bhk") ||
    q.includes("bhk")
  ) {
    return "spaces";
  }

  // 2. Amenities & Offers
  if (
    q.includes("offer") ||
    q.includes("offers") ||
    q.includes("amenity") ||
    q.includes("amenities") ||
    q.includes("facility") ||
    q.includes("facilities") ||
    q.includes("pool") ||
    q.includes("wifi") ||
    q.includes("ac") ||
    q.includes("air condition") ||
    q.includes("parking") ||
    q.includes("generator") ||
    q.includes("power backup") ||
    q.includes("tv")
  ) {
    return "amenities";
  }

  // 3. House Rules & Timings
  if (
    q.includes("rule") ||
    q.includes("rules") ||
    q.includes("policy") ||
    q.includes("policies") ||
    q.includes("check in") ||
    q.includes("check-in") ||
    q.includes("check out") ||
    q.includes("check-out") ||
    q.includes("timing") ||
    q.includes("timings") ||
    q.includes("deposit") ||
    q.includes("security deposit") ||
    q.includes("smoke") ||
    q.includes("smoking") ||
    q.includes("alcohol") ||
    q.includes("music") ||
    q.includes("party")
  ) {
    return "rules";
  }

  // 4. Meals & Food
  if (
    q.includes("meal") ||
    q.includes("meals") ||
    q.includes("food") ||
    q.includes("cook") ||
    q.includes("chef") ||
    q.includes("kitchen") ||
    q.includes("breakfast") ||
    q.includes("lunch") ||
    q.includes("dinner") ||
    q.includes("dining") ||
    q.includes("veg") ||
    q.includes("non-veg")
  ) {
    return "meals";
  }

  // 5. Pricing & Booking
  if (
    q.includes("price") ||
    q.includes("pricing") ||
    q.includes("cost") ||
    q.includes("rate") ||
    q.includes("tariff") ||
    q.includes("book") ||
    q.includes("booking") ||
    q.includes("how much")
  ) {
    return "pricing";
  }

  // 6. Pets
  if (
    q.includes("pet") ||
    q.includes("pets") ||
    q.includes("dog") ||
    q.includes("dogs") ||
    q.includes("cat")
  ) {
    return "pets";
  }

  // 7. Location & Distance
  if (
    q.includes("location") ||
    q.includes("where is") ||
    q.includes("how far") ||
    q.includes("distance") ||
    q.includes("station") ||
    q.includes("reach") ||
    q.includes("address")
  ) {
    return "location";
  }

  return "general";
}

/**
 * Call Gemini 3.1 Flash Lite to answer property-specific questions grounded in property data
 */
async function callPropertyGemini(query, property, language = "English") {
  const apiKey = getGeminiApiKey();
  if (!apiKey || !query || query.trim().length === 0) return null;

  try {
    const propertySummary = {
      name: property.name,
      bhkType: property.bhkType,
      rooms: property.rooms,
      baths: property.baths,
      maxCapacity: property.maxCapacity,
      location: property.location?.name || property.address?.city || property.address?.area || "Lonavala",
      address: property.address,
      pricing: property.pricing,
      checkInTime: property.checkInTime || "1:00 PM",
      checkOutTime: property.checkOutTime || "11:00 AM",
      securityDeposit: property.securityDeposit || 3000,
      amenities: (property.amenities || []).slice(0, 20),
      houseRules: property.houseRules || [],
      foodOptions: property.foodOptions,
      kitchenPolicy: property.kitchenPolicy || [],
      greatFor: property.greatFor || [],
    };

    const prompt = `You are "VillaCamp AI", the dedicated private stay concierge for "${property.name}" on The Villa Camp platform.

Guest Query: "${query}"
Preferred Language: ${language}

Property Ground Truth:
${JSON.stringify(propertySummary, null, 2)}

Instructions:
1. Formulate a polite, warm, concise hospitality response directly answering the guest's question.
2. Ground your answer strictly in the property's provided details. If details like early check-in or specific bespoke services are subject to availability, advise them courteously and mention our concierge team can confirm.
3. Keep the response around 2 to 3 sentences maximum, elegant, friendly, and helpful.
4. Detect the primary intent: "spaces", "amenities", "rules", "meals", "pricing", "pets", "location", or "general".

Return strictly a JSON object:
{
  "intent": "spaces" | "amenities" | "rules" | "meals" | "pricing" | "pets" | "location" | "general",
  "replyText": "your response here"
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.warn("Property Gemini call fell back to local NLP:", err.message);
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      propertyId,
      category = "Villa",
      message = "",
      propertyData = null,
      language = "English",
    } = body;

    let property = propertyData;

    // If property data was not passed in body, fetch from backend
    if (!property && propertyId) {
      try {
        const catUrl =
          category.toLowerCase() === "villa"
            ? `${BACKEND_URL}/Villa/get/villa/${propertyId}`
            : category.toLowerCase() === "camping"
            ? `${BACKEND_URL}/Camping/get/camping/${propertyId}`
            : category.toLowerCase() === "cottage"
            ? `${BACKEND_URL}/Cottage/get/cottage/${propertyId}`
            : `${BACKEND_URL}/Hotel/get/hotel/${propertyId}`;

        const res = await fetch(catUrl, { next: { revalidate: 60 } });
        if (res.ok) {
          const json = await res.json();
          property = json.data;
        }
      } catch (err) {
        console.warn("Failed to fetch property for concierge:", err.message);
      }
    }

    if (!property) {
      return NextResponse.json({
        success: false,
        replyText: "I'm having a little trouble retrieving the details for this stay. Please refresh the page or ask our concierge team directly!",
        spaces: [],
        amenities: [],
        rules: [],
      });
    }

    const query = (message || "").trim();
    const geminiResult = await callPropertyGemini(query, property, language);
    const intent = geminiResult?.intent || classifyPropertyIntent(query);

    const spaces = synthesizeSpaces(property, category);
    const amenities = Array.isArray(property.amenities) ? property.amenities : [];
    const checkIn = property.checkInTime || "1:00 PM";
    const checkOut = property.checkOutTime || "11:00 AM";
    const deposit = property.securityDeposit || 3000;
    const rules = Array.isArray(property.houseRules) && property.houseRules.length > 0
      ? property.houseRules
      : [
          `Check-in is at ${checkIn} and check-out is at ${checkOut}.`,
          `A refundable security deposit of ₹${deposit.toLocaleString("en-IN")} is collected at check-in.`,
          "Quiet hours are observed after 10:00 PM for outdoor music in accordance with local regulations.",
          "Smoking is strictly prohibited in indoor bedrooms; designated outdoor smoking zones are available.",
        ];

    const foodAvailable = property.foodOptions?.available || ["Breakfast", "Lunch", "Dinner"];
    const adultMealPrice = property.foodOptions?.adultPrice || 0;
    const childMealPrice = property.foodOptions?.childPrice || 0;
    const foodNote = property.foodOptions?.note || "Fresh home-style meals prepared by local cooks upon prior request.";

    let activeTab = null;
    let replyText = geminiResult?.replyText || "";

    if (intent === "spaces" || query.toLowerCase().includes("space")) {
      activeTab = "spaces";
      if (!replyText) {
        replyText = `Here are the spaces in ${property.name}. You can explore the bedrooms, living areas, and outdoor spots below:`;
      }
    } else if (intent === "amenities" || query.toLowerCase().includes("offer")) {
      activeTab = "amenities";
      if (!replyText) {
        replyText = `${property.name} is thoughtfully curated with premium amenities to ensure an unforgettable stay:`;
      }
    } else if (intent === "rules") {
      activeTab = "rules";
      if (!replyText) {
        replyText = `Check-in is from ${checkIn} and check-out is by ${checkOut}. Here are the essential house rules:`;
      }
    } else if (intent === "meals") {
      activeTab = "meals";
      if (!replyText) {
        const priceInfo = adultMealPrice > 0 ? `Meal packages are available starting at ₹${adultMealPrice} per adult per day. ` : "";
        replyText = `Delicious meals (${foodAvailable.join(", ")}) can be arranged. ${priceInfo}${foodNote}`;
      }
    } else if (intent === "pricing") {
      const weekday = property.pricing?.weekdayPrice ? `₹${property.pricing.weekdayPrice.toLocaleString("en-IN")}` : "our standard rate";
      const weekend = property.pricing?.weekendPrice ? `₹${property.pricing.weekendPrice.toLocaleString("en-IN")}` : "weekend rates";
      if (!replyText) {
        replyText = `Rates for ${property.name} start at ${weekday} per night on weekdays and ${weekend} on weekends. You can select your exact travel dates in the booking widget to view total pricing!`;
      }
    } else if (intent === "pets") {
      const isPetFriendly = (property.greatFor || []).some(g => g.toLowerCase().includes("pet")) ||
        (property.amenities || []).some(a => a.toLowerCase().includes("pet"));
      if (!replyText) {
        replyText = isPetFriendly
          ? `Good news! ${property.name} welcomes pets! 🐾 We love furry companions, but do request keeping them off indoor beds and sofas.`
          : `Currently, pets are not allowed inside ${property.name} to maintain strict hypoallergenic standards for all guests.`;
      }
    } else if (!replyText) {
      replyText = `I'd love to help! You can ask me anything about the spaces, amenities, meal plans, house rules, or pricing for ${property.name}.`;
    }

    return NextResponse.json({
      success: true,
      propertyName: property.name,
      category: category,
      intent: intent,
      activeTab: activeTab,
      replyText: replyText,
      spaces: spaces,
      amenities: amenities,
      rules: rules,
      timings: {
        checkIn: checkIn,
        checkOut: checkOut,
        securityDeposit: deposit,
      },
      meals: {
        available: foodAvailable,
        adultPrice: adultMealPrice,
        childPrice: childMealPrice,
        note: foodNote,
      },
      quickPills: [
        "The spaces",
        `What this ${category.toLowerCase()} offers`,
        "House rules",
        "Meals & dining",
        "Check-in timings",
      ],
    });
  } catch (err) {
    console.error("Property Concierge API Error:", err);
    return NextResponse.json(
      {
        success: false,
        replyText: "I encountered a brief hiccup loading property details. Please try asking again!",
        spaces: [],
      },
      { status: 500 }
    );
  }
}
