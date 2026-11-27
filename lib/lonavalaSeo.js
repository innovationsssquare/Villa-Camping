const DEFAULT_SITE_URL = "https://thevillacamp.com";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export const LONAVALA_PRICE_PRESETS = [
  { id: "all", label: "All Prices", shortLabel: "All", min: null, max: null },
  { id: "under-5k", label: "Under ₹5,000", shortLabel: "< ₹5k", min: 0, max: 5000 },
  { id: "under-10k", label: "Under ₹10,000", shortLabel: "< ₹10k", min: 0, max: 10000 },
  { id: "under-15k", label: "Under ₹15,000", shortLabel: "< ₹15k", min: 0, max: 15000 },
  { id: "10k-20k", label: "₹10,000 – ₹20,000", shortLabel: "₹10k–20k", min: 10000, max: 20000 },
  { id: "20k-30k", label: "₹20,000 – ₹30,000", shortLabel: "₹20k–30k", min: 20000, max: 30000 },
  { id: "30k-40k", label: "₹30,000 – ₹40,000", shortLabel: "₹30k–40k", min: 30000, max: 40000 },
  { id: "above-40k", label: "Above ₹40,000", shortLabel: "₹40k+", min: 40000, max: null },
];

export const LONAVALA_CORE_KEYWORDS = [
  // Core head & competitor terms (StayVista / Ekostay / SaffronStays / MakeMyTrip / Airbnb / Booking.com)
  "villa in lonavala",
  "villas in lonavala",
  "villas in lonavala maharashtra",
  "luxury villas in lonavala",
  "holiday homes in lonavala",
  "homestays in lonavala",
  "bungalow on rent in lonavala",
  "villa on rent in lonavala",
  "farmhouse in lonavala",
  "vacation rentals in lonavala",
  "private pool villa in lonavala",
  "private pool villas lonavala",
  "pool villas in lonavala",
  // Budget & tariff modifiers
  "villa under 5k in lonavala",
  "villa in lonavala under 5000",
  "bungalow on rent in lonavala under 5000",
  "villa under 10k in lonavala",
  "villa in lonavala under 10000",
  "private pool villa in lonavala under 10000",
  "villa under 15k in lonavala",
  "villa in lonavala under 15000",
  "luxury villa in lonavala under 15000",
  "budget villas in lonavala",
  "cheap villas in lonavala",
  // BHK & group formats
  "2bhk villa in lonavala",
  "3bhk villa in lonavala",
  "4bhk villa in lonavala",
  "5bhk villa in lonavala",
  "6bhk villa in lonavala",
  "family villas in lonavala",
  "couple friendly villas lonavala",
  "unmarried couple friendly villas lonavala",
  "pet friendly villas lonavala",
  "corporate offsite villas lonavala",
  "birthday party villa in lonavala",
  "pool party villas lonavala",
  // High-intent micro-locations & landmarks
  "villas in tungarli lonavala",
  "villas in gold valley lonavala",
  "villas near bhushi dam lonavala",
  "villas near tiger point lonavala",
  "villas near wet n joy lonavala",
  "villas in khandala",
  "villas in malavli lonavala",
  "villas near pawna lake",
  "villas in valvan lonavala",
  "villas in nangargaon lonavala",
  // Amenities & occasions
  "infinity pool villas lonavala",
  "hill view villas lonavala",
  "valley view bungalows lonavala",
  "villas with lawn and bbq lonavala",
  "monsoon villas in lonavala",
  "workation villas lonavala",
  "villas with caretaker and meals lonavala",
  // Weekend hubs & complementary categories
  "pawna lake camping",
  "glamping tents pawna lake",
  "cottages in lonavala",
  "resorts in lonavala",
  "weekend getaways from mumbai",
  "weekend getaways from pune",
  "staycation near mumbai and pune",
  "alibaug pool villas",
  "karjat villas",
  "kamshet cottages",
  "lonavala villa booking",
  "thevillacamp",
];

export const LONAVALA_MICRO_LOCATIONS = [
  { name: "Tungarli & Gold Valley", query: "Tungarli" },
  { name: "Pawna Lake", query: "Pawna" },
  { name: "Khandala", query: "Khandala" },
  { name: "Malavli & Wet 'n' Joy", query: "Malavli" },
  { name: "Bhushi Dam & Kurvande", query: "Lonavala" },
  { name: "Valvan & Nangargaon", query: "Lonavala" },
];

export const CATEGORY_SEO_CONFIG = {
  villa: {
    title: "Villas in Lonavala | Holiday Homes, Bungalows & Pool Villas Under ₹5K–₹15K",
    description:
      "Book holiday homes, private pool villas, farmhouses, and bungalows on rent in Lonavala, Khandala, Tungarli, Malavli & Pawna Lake. Compare verified villas under ₹5K, ₹10K & ₹15K with caretakers, lawns, and direct host rates.",
    keywords: [
      ...LONAVALA_CORE_KEYWORDS.slice(0, 48),
      "private pool stay lonavala",
    ],
  },
  camping: {
    title: "Pawna Lake Camping & Luxury Glamping Tents | Live BBQ & Bonfire",
    description:
      "Book Pawna Lake camping and waterfront glamping tents near Lonavala with live BBQ, bonfire music, kayaking, boating, sunset views, and family or couple-friendly packages starting at direct camp prices.",
    keywords: [
      "pawna lake camping",
      "pawna lake tent booking",
      "glamping pawna lake",
      "lakeside camping pawna",
      "couple camping pawna lake",
      "pawna camping with live bbq and bonfire",
      "pawna lake camping price per person",
      "kayaking pawna lake",
      "waterfront tents lonavala",
      "camping near mumbai and pune",
      "corporate offsite camping pawna",
      "overnight camping lonavala",
    ],
  },
  cottage: {
    title: "Cottages, Chalets & Farm Stays in Lonavala, Kamshet & Pawna",
    description:
      "Reserve cozy mountain cottages, wooden chalets, couple cottages under ₹5,000, and peaceful farm stays in Lonavala, Kamshet & Pawna Lake with valley views and direct owner pricing.",
    keywords: [
      "cottages in lonavala",
      "wooden chalets lonavala",
      "couple cottages in lonavala",
      "cottages in lonavala under 5000",
      "farm stay lonavala",
      "kamshet cottages",
      "nature stays lonavala",
      "romantic cottages near mumbai pune",
      "hillside cottages pawna lake",
    ],
  },
  hotel: {
    title: "Resorts, Boutique Hotels & Suites in Lonavala & Khandala",
    description:
      "Book verified boutique hotels, family resorts with swimming pools, and hillside suites in Lonavala & Khandala near Bhushi Dam and expressway exits with daily housekeeping and direct rates.",
    keywords: [
      "hotels in lonavala",
      "resorts in lonavala",
      "resorts in lonavala with swimming pool",
      "luxury resorts khandala",
      "family resorts lonavala near bhushi dam",
      "boutique stays lonavala",
      "luxury suites lonavala",
      "daycation resorts lonavala",
      "lonavala weekend resorts",
    ],
  },
  all: {
    title: "Holiday Homes, Villas in Lonavala Under ₹5K–₹15K, Camping & Resorts",
    description:
      "Explore 150+ audited holiday homes, private pool villas, homestays, bungalows on rent under ₹5K, ₹10K & ₹15K, Pawna Lake camping tents, cottages, and resorts across Lonavala, Khandala, Karjat & Alibaug.",
    keywords: [
      ...LONAVALA_CORE_KEYWORDS,
      "stays in maharashtra",
    ],
  },
};

export const LONAVALA_MAIN_SEO = {
  slug: "",
  path: "/villas-in-lonavala",
  navLabel: "All Lonavala Villas",
  shortLabel: "All Villas",
  badge: "Lonavala Holiday Homes & Villas",
  title: "Villas in Lonavala | Holiday Homes, Bungalows & Pool Villas Under ₹5K–₹15K",
  h1: "Villas, Holiday Homes & Bungalows in Lonavala",
  subtitle:
    "Book verified private pool villas, gated bungalows, and homestays in Lonavala starting under ₹5,000, ₹10,000 & ₹15,000 per night with direct host pricing.",
  description:
    "Explore the best villas in Lonavala on rent with private swimming pool, manicured lawns, caretaker service & mountain views. Compare villas under ₹5K, ₹10K, and ₹15K across Tungarli, Gold Valley, Khandala, Malavli, and Pawna Lake.",
  keywords: [
    ...LONAVALA_CORE_KEYWORDS,
    "best villas in lonavala",
    "lonavala villa rent per night",
    "gated community villas lonavala",
  ],
  searchQuery: "Lonavala",
  priceRangeId: "all",
  priceMin: null,
  priceMax: null,
  editorialTitle: "Book Verified Villas, Bungalows & Holiday Homes in Lonavala",
  editorialParagraphs: [
    "Sandwiched neatly between Mumbai and Pune, Lonavala is Maharashtra's most sought-after weekend getaway, staycation, and monsoon escape. On ThevillaCamp, compare verified holiday homes, private bungalows on rent, farmhouses, and 2BHK to 6BHK+ pool villas across every budget — from cozy stays under ₹5,000 per night to 3BHK–4BHK private pool villas under ₹10,000 and ₹15,000, plus luxury hilltop estates.",
    "Browse top Lonavala pockets including Tungarli, Gold Valley, Khandala, Malavli (near Wet 'n' Joy), Nangargaon, Valvan, Bhushi Dam, Tiger Point, and Pawna Lake. Every stay is audited for pool hygiene, verified photos, caretaker hospitality, home-style meals, Wi-Fi for workations, and transparent direct-host rates.",
  ],
  faqs: [
    {
      question: "What is the starting rent for a villa or bungalow in Lonavala?",
      answer:
        "Cozy cottages, compact holiday homes, and weekday 2BHK villas in Lonavala start under ₹5,000 per night, while private pool 2BHK–4BHK villas and bungalows commonly range under ₹10,000 and ₹15,000 per night.",
    },
    {
      question: "Can I book a private pool villa in Lonavala under ₹10,000 or ₹15,000?",
      answer:
        "Yes. Our Under ₹10,000 and Under ₹15,000 Lonavala collections list verified private pool bungalows across Tungarli, Malavli, Valvan, and Pawna Lake road ideal for families and groups of 4 to 15 guests.",
    },
    {
      question: "Which neighborhoods in Lonavala are best for renting a private villa?",
      answer:
        "Gold Valley and Tungarli offer easy town access with gated privacy; Bhushi Dam and Tiger Point deliver lush monsoon valley views; Malavli and Pawna Lake are ideal for scenic farmhouses and quiet nature retreats.",
    },
    {
      question: "Do Lonavala villas on ThevillaCamp include caretakers, BBQ, and home-cooked meals?",
      answer:
        "Most listed villas and homestays feature dedicated on-site caretakers, Wi-Fi, music speakers, outdoor lawns, and optional home-cooked veg/non-veg meals or BBQ arrangements.",
    },
  ],
};

export const LONAVALA_FILTER_PAGES = {
  "under-5k": {
    slug: "under-5k",
    path: "/villas-in-lonavala/under-5k",
    navLabel: "Villas Under ₹5,000",
    shortLabel: "Under ₹5K",
    badge: "Budget Pick • Under ₹5,000 / night",
    title: "Villa in Lonavala Under 5K (₹5,000) | Budget Villas, Bungalows & Homestays",
    h1: "Villa in Lonavala Under ₹5,000 (Under 5K)",
    subtitle:
      "Affordable verified villas, cozy cottages, and budget homestays on rent in Lonavala under ₹5,000 per night.",
    description:
      "Book a villa in Lonavala under 5K (₹5,000 per night). Explore budget bungalows on rent, couple cottages, and weekday villa deals near Malavli, Tungarli, Bhushi Dam & Pawna Lake with direct host rates.",
    keywords: [
      "villa under 5k in lonavala",
      "villa in lonavala under 5000",
      "villas in lonavala under 5k",
      "bungalow on rent in lonavala under 5000",
      "homestay in lonavala under 5000",
      "budget villa in lonavala",
      "cheap villa in lonavala",
      "couple villa lonavala under 5k",
      "weekend stay in lonavala under 5000",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 14),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "under-5k",
    priceMin: 0,
    priceMax: 5000,
    editorialTitle: "Budget Villas & Homestays in Lonavala Under ₹5,000 (5K)",
    editorialParagraphs: [
      "Searching for an affordable villa or bungalow on rent in Lonavala under ₹5,000 per night? This collection surfaces weekday villa specials, cozy cottages, boutique homestays, and compact holiday homes across Lonavala, Malavli, Nangargaon, and Pawna Lake.",
      "Planning Sunday through Thursday unlocks lower weekday tariffs on verified 2BHK stays and couple cottages, giving you peaceful greenery, caretaker support, Wi-Fi, and easy access to Mumbai-Pune Expressway exits.",
    ],
    faqs: [
      {
        question: "Can I get a villa on rent in Lonavala under ₹5,000 per night?",
        answer:
          "Yes. Weekday bookings (Monday to Thursday), studio villas, and boutique 1BHK–2BHK cottages across Lonavala and Malavli frequently start under ₹5,000 per night on ThevillaCamp.",
      },
      {
        question: "Are couple-friendly homestays and villas available in Lonavala under 5K?",
        answer:
          "Yes, verified couple-friendly cottages and private villa suites under ₹5,000 include peaceful garden settings, Wi-Fi, and secure host check-in with valid ID.",
      },
    ],
  },
  "under-10k": {
    slug: "under-10k",
    path: "/villas-in-lonavala/under-10k",
    navLabel: "Villas Under ₹10,000",
    shortLabel: "Under ₹10K",
    badge: "Best Value • Under ₹10,000 / night",
    title: "Villa in Lonavala Under 10K (₹10,000) | 2BHK–3BHK Private Pool Villas",
    h1: "Villa in Lonavala Under ₹10,000 (Under 10K)",
    subtitle:
      "Handpicked 2BHK and 3BHK villas and bungalows in Lonavala under ₹10,000 per night with pools, lawns & caretakers.",
    description:
      "Book verified villas in Lonavala under 10K (₹10,000 per night). Compare 2BHK and 3BHK private pool bungalows on rent near Pawna Lake, Tungarli, Gold Valley & Malavli at direct host pricing.",
    keywords: [
      "villa under 10k in lonavala",
      "villa in lonavala under 10000",
      "villas in lonavala under 10k",
      "private pool villa in lonavala under 10000",
      "bungalow on rent in lonavala under 10000",
      "3bhk villa in lonavala under 10k",
      "2bhk pool villa lonavala under 10000",
      "family villa lonavala under 10k",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 16),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "under-10k",
    priceMin: 0,
    priceMax: 10000,
    editorialTitle: "Best Pool Villas & Bungalows in Lonavala Under ₹10,000 (10K)",
    editorialParagraphs: [
      "Our Under ₹10,000 Lonavala tier is a favorite for families and small groups seeking private swimming pools, lush lawns, AC bedrooms, and kitchen or meal support without stretching the budget.",
      "With direct host pricing across Tungarli, Malavli, Valvan, and Pawna Road, groups of 4 to 10 guests enjoy complete villa privacy at strong per-person value.",
    ],
    faqs: [
      {
        question: "Do villas in Lonavala under ₹10,000 include a private swimming pool?",
        answer:
          "Many 2BHK and 3BHK bungalows and villas under ₹10,000 include private swimming pools or plunge pools along with lawns, indoor games, and full-time caretakers.",
      },
      {
        question: "How many guests can stay in a villa under 10K in Lonavala?",
        answer:
          "Villas priced between ₹5,000 and ₹10,000 comfortably sleep 4 to 10 guests across 2 or 3 air-conditioned bedrooms.",
      },
    ],
  },
  "under-15k": {
    slug: "under-15k",
    path: "/villas-in-lonavala/under-15k",
    navLabel: "Villas Under ₹15,000",
    shortLabel: "Under ₹15K",
    badge: "Most Popular • Under ₹15,000 / night",
    title: "Villa in Lonavala Under 15K (₹15,000) | 3BHK & 4BHK Private Pool Villas",
    h1: "Villa in Lonavala Under ₹15,000 (Under 15K)",
    subtitle:
      "Spacious 3BHK, 4BHK & 5BHK private pool villas, farmhouses, and luxury bungalows in Lonavala under ₹15,000 per night.",
    description:
      "Reserve luxury private pool villas in Lonavala under 15K (₹15,000 per night). Ideal for 6–15 guests with landscaped lawns, BBQ, indoor games & hill views across Gold Valley, Tungarli, Khandala & Pawna.",
    keywords: [
      "villa under 15k in lonavala",
      "villa in lonavala under 15000",
      "villas in lonavala under 15k",
      "luxury villa in lonavala under 15000",
      "farmhouse in lonavala under 15000",
      "4bhk villa in lonavala under 15k",
      "3bhk pool villa lonavala under 15000",
      "group villa lonavala under 15k",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 18),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "under-15k",
    priceMin: 0,
    priceMax: 15000,
    editorialTitle: "Luxury 3BHK–4BHK Villas in Lonavala Under ₹15,000 (15K)",
    editorialParagraphs: [
      "For weekend celebrations, family get-togethers, and 8–15 person trips, Lonavala villas under ₹15,000 deliver generous living spaces, private swimming pools, lawns, BBQ setups, music speakers, and panoramic Sahyadri hill views.",
      "Compare verified holiday homes and farmhouses in Gold Valley, Tungarli, Malavli, and near Wet 'n' Joy with transparent tariffs and zero middleman fees.",
    ],
    faqs: [
      {
        question: "What amenities come with Lonavala villas under ₹15,000?",
        answer:
          "Villas under ₹15,000 usually include a private swimming pool, AC bedrooms, manicured lawn, indoor games, Wi-Fi, BBQ grill access, and an on-site caretaker.",
      },
      {
        question: "Can I book a 4BHK private pool villa in Lonavala under ₹15,000?",
        answer:
          "Yes, several verified 3BHK and 4BHK villas in Lonavala fall under ₹15,000 per night, particularly on weekdays and early advance weekend bookings.",
      },
    ],
  },
  "private-pool": {
    slug: "private-pool",
    path: "/villas-in-lonavala/private-pool",
    navLabel: "Private Pool Villas",
    shortLabel: "Private Pool",
    badge: "Signature Pool Collection",
    title: "Private Pool Villas in Lonavala | Luxury 2BHK–6BHK Pool Bungalows",
    h1: "Private Pool Villas in Lonavala",
    subtitle:
      "Exclusive private pool bungalows, infinity-pool villas, and valley-view holiday homes in Lonavala & Khandala.",
    description:
      "Book verified private pool villas in Lonavala for family holidays, pool parties, and weekend getaways from Mumbai and Pune. Audited pools, lawns, caretakers, and direct owner rates.",
    keywords: [
      "private pool villa in lonavala",
      "private pool villas lonavala",
      "pool villas in lonavala",
      "infinity pool villas lonavala",
      "lonavala villa with private swimming pool",
      "pool party bungalow lonavala",
      "family pool villa lonavala",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 16),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "all",
    priceMin: null,
    priceMax: null,
    editorialTitle: "Audited Private Pool Villas & Bungalows in Lonavala",
    editorialParagraphs: [
      "From cozy 2BHK plunge-pool homes to sprawling 6BHK infinity-pool estates overlooking Bhushi Dam valleys and Pawna hills, every private pool villa on ThevillaCamp is checked for water filtration and complete guest privacy.",
      "Filter easily across Under ₹10K, Under ₹15K, and luxury tiers to pick a pool bungalow tailored to your group size.",
    ],
    faqs: [
      {
        question: "Are swimming pools at ThevillaCamp Lonavala villas strictly private?",
        answer:
          "Yes, villas listed with a private pool reserve the entire swimming pool, deck, and lawn exclusively for your group during your stay.",
      },
      {
        question: "Can we arrange BBQ and home-cooked meals by the poolside?",
        answer:
          "Yes, most pool villas offer on-site caretakers who arrange fresh home-cooked meals, evening snacks, and live BBQ setups.",
      },
    ],
  },
  "for-groups": {
    slug: "for-groups",
    path: "/villas-in-lonavala/for-groups",
    navLabel: "Group Villas & Farmhouses",
    shortLabel: "For Groups",
    badge: "Groups, Parties & Offsites",
    title: "Villas & Farmhouses in Lonavala for Groups, Offsites & Reunions (4BHK–6BHK)",
    h1: "Group Villas, Farmhouses & Party Bungalows in Lonavala",
    subtitle:
      "Spacious 4BHK, 5BHK & 6BHK+ villas and farmhouses in Lonavala for family reunions, birthdays, and corporate offsites.",
    description:
      "Plan group getaways, birthday parties, and corporate offsites at spacious 4BHK–6BHK villas and farmhouses in Lonavala near Mumbai and Pune with private pools, lawns, and indoor games.",
    keywords: [
      "villa in lonavala for group",
      "farmhouse in lonavala for party",
      "corporate offsite villas lonavala",
      "birthday party villa lonavala",
      "villa in lonavala for 15 people",
      "villa in lonavala for 20 people",
      "4bhk villa in lonavala",
      "5bhk villa in lonavala",
      "6bhk villa in lonavala",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 14),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "all",
    priceMin: null,
    priceMax: null,
    editorialTitle: "Group Villas, Farmhouses & Corporate Offsite Stays in Lonavala",
    editorialParagraphs: [
      "Keep everyone together in spacious multi-bedroom bungalows and private farmhouses built for larger groups. Enjoy expansive lawns, swimming pools, high-speed Wi-Fi for workations/offsites, bonfire evenings, and ample parking.",
    ],
    faqs: [
      {
        question: "What bedroom sizes do group villas in Lonavala offer?",
        answer:
          "You can choose from 3BHK, 4BHK, 5BHK, and 6BHK+ villas and farmhouses accommodating 10 to 25+ guests comfortably.",
      },
      {
        question: "Are these Lonavala villas suitable for corporate offsites and team retreats?",
        answer:
          "Yes, large halls, outdoor lawns, power backup, high-speed Wi-Fi, and customized meal packages make our larger villas ideal for corporate offsites from Mumbai and Pune.",
      },
    ],
  },
  "for-couples": {
    slug: "for-couples",
    path: "/villas-in-lonavala/for-couples",
    navLabel: "Couple-Friendly Villas",
    shortLabel: "For Couples",
    badge: "Couples & Romantic Getaways",
    title: "Couple-Friendly Villas & Private Cottages in Lonavala | Romantic Stays",
    h1: "Couple-Friendly Villas & Romantic Retreats in Lonavala",
    subtitle:
      "Private, peaceful villas, boutique homestays, and hillside cottages in Lonavala for unforgettable couple getaways.",
    description:
      "Book unmarried couple-friendly villas, romantic cottages, and private stays in Lonavala with valley views, plunge pools, and complete privacy just two hours from Mumbai and Pune.",
    keywords: [
      "couple friendly villa in lonavala",
      "unmarried couple friendly villas lonavala",
      "villa in lonavala for couples",
      "romantic villa lonavala",
      "private villa for 2 in lonavala",
      "couple cottages lonavala",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 14),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "all",
    priceMin: null,
    priceMax: null,
    editorialTitle: "Romantic & Unmarried Couple-Friendly Villas in Lonavala",
    editorialParagraphs: [
      "Trade city traffic for misty mornings, tranquil garden patios, and discreet hospitality in verified couple-friendly villas, cottages, and boutique homestays across Lonavala, Khandala, and Pawna Lake.",
    ],
    faqs: [
      {
        question: "Are unmarried couples welcome at couple-friendly villas in Lonavala?",
        answer:
          "Yes, properties marked couple-friendly welcome married and unmarried couples aged 18+ with valid government photo IDs for all guests during check-in.",
      },
    ],
  },
  "pet-friendly": {
    slug: "pet-friendly",
    path: "/villas-in-lonavala/pet-friendly",
    navLabel: "Pet-Friendly Villas",
    shortLabel: "Pet Friendly",
    badge: "Bring Your Furry Friends",
    title: "Pet-Friendly Villas & Farmhouses in Lonavala with Lawns | ThevillaCamp",
    h1: "Pet-Friendly Villas & Holiday Homes in Lonavala",
    subtitle:
      "Gated villas and lush lawn farmhouses in Lonavala where your dogs and pets stay and roam happily with the family.",
    description:
      "Discover pet-friendly villas, bungalows, and farmhouses in Lonavala with fenced green lawns, private pools, and welcoming hosts for a stress-free vacation with your pets.",
    keywords: [
      "pet friendly villas in lonavala",
      "dog friendly villa lonavala",
      "pet friendly bungalow lonavala",
      "pet friendly farmhouse lonavala",
      "pet friendly homestay lonavala",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 14),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "all",
    priceMin: null,
    priceMax: null,
    editorialTitle: "Pet-Friendly Pool Villas & Lawns in Lonavala",
    editorialParagraphs: [
      "Never leave your pets behind on a weekend trip. Explore gated Lonavala villas and spacious farmhouses featuring open green lawns, shaded verandas, and welcoming caretakers.",
    ],
    faqs: [
      {
        question: "Are pets allowed in private pool villas in Lonavala?",
        answer:
          "Yes, pet-friendly villas on ThevillaCamp welcome pets in outdoor lawns and designated indoor areas; guests simply follow each villa's pool-hygiene guidelines.",
      },
    ],
  },
  "near-pawna-lake": {
    slug: "near-pawna-lake",
    path: "/villas-in-lonavala/near-pawna-lake",
    navLabel: "Villas Near Pawna Lake",
    shortLabel: "Pawna Lake",
    badge: "Lakeside & Hilltop Stays",
    title: "Villas & Farmhouses Near Pawna Lake, Lonavala | Pool Stays & Camping",
    h1: "Villas & Holiday Homes Near Pawna Lake",
    subtitle:
      "Scenic lakeside villas, hill-view farmhouses, and private pool stays overlooking Pawna Lake near Lonavala.",
    description:
      "Book private villas, farmhouses, and lakeside stays near Pawna Lake, Lonavala. Enjoy sunrise mist over the water, private pools, lawns, BBQ & close proximity to Tikona & Lohagad forts.",
    keywords: [
      "villas near pawna lake",
      "pawna lake villas lonavala",
      "farmhouse near pawna lake",
      "private pool villa pawna lake",
      "pawna dam villas",
      "pawna lake camping",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 12),
    ],
    searchQuery: "Pawna",
    priceRangeId: "all",
    priceMin: null,
    priceMax: null,
    editorialTitle: "Lakeside Villas & Mountain Stays Near Pawna Lake",
    editorialParagraphs: [
      "Just off Lonavala and Kamshet, Pawna Lake pairs tranquil lakeside breezes with dramatic views of Lohagad and Tikona forts — ideal for quiet villa retreats, sunset BBQs, and nature-focused group stays.",
    ],
    faqs: [
      {
        question: "How far are Pawna Lake villas from Lonavala station?",
        answer:
          "Most Pawna Lake villas and farmhouses sit roughly 25–35 minutes from Lonavala town and the Mumbai-Pune Expressway via Malavli or Pavananagar.",
      },
    ],
  },
  luxury: {
    slug: "luxury",
    path: "/villas-in-lonavala/luxury",
    navLabel: "Luxury Villas",
    shortLabel: "Luxury",
    badge: "Signature Luxury Estates",
    title: "Luxury Villas in Lonavala | Designer Infinity Pool Estates & Concierge",
    h1: "Luxury Private Pool Villas in Lonavala",
    subtitle:
      "Curated designer estates in Lonavala, Khandala & Tiger Point with oversized pools, manicured lawns, and 24/7 concierge.",
    description:
      "Experience luxury villas in Lonavala and Khandala with designer interiors, valley-view pools, manicured lawns, and bespoke concierge-managed hospitality on ThevillaCamp.",
    keywords: [
      "luxury villas in lonavala",
      "5 star villa in lonavala",
      "designer pool villas lonavala",
      "luxury estate lonavala",
      "khandala luxury villas",
      "villas near tiger point lonavala",
      ...LONAVALA_CORE_KEYWORDS.slice(0, 14),
    ],
    searchQuery: "Lonavala",
    priceRangeId: "above-15k",
    priceMin: 15000,
    priceMax: null,
    editorialTitle: "Curated Luxury Estates in Lonavala & Khandala",
    editorialParagraphs: [
      "Tailored for milestone celebrations, executive retreats, and elevated family holidays, our Luxury Lonavala collection showcases architectural villas with infinity/private pools, gazebos, chef-assisted kitchens, and dedicated hospitality teams.",
    ],
    faqs: [
      {
        question: "What distinguishes ThevillaCamp Luxury Villas in Lonavala?",
        answer:
          "Every signature estate passes a multi-point audit covering designer interiors, private pool maintenance, power backup, gated parking, and attentive on-site hospitality staff.",
      },
    ],
  },
};

export const LONAVALA_FILTER_TABS = [
  { key: "all", href: "/villas-in-lonavala", label: "All Lonavala Villas", shortLabel: "All Villas" },
  { key: "under-5k", href: "/villas-in-lonavala/under-5k", label: "Under ₹5K", shortLabel: "Under ₹5K" },
  { key: "under-10k", href: "/villas-in-lonavala/under-10k", label: "Under ₹10K", shortLabel: "Under ₹10K" },
  { key: "under-15k", href: "/villas-in-lonavala/under-15k", label: "Under ₹15K", shortLabel: "Under ₹15K" },
  { key: "private-pool", href: "/villas-in-lonavala/private-pool", label: "Private Pool", shortLabel: "Private Pool" },
  { key: "for-groups", href: "/villas-in-lonavala/for-groups", label: "For Groups", shortLabel: "Groups" },
  { key: "for-couples", href: "/villas-in-lonavala/for-couples", label: "For Couples", shortLabel: "Couples" },
  { key: "pet-friendly", href: "/villas-in-lonavala/pet-friendly", label: "Pet Friendly", shortLabel: "Pet Friendly" },
  { key: "near-pawna-lake", href: "/villas-in-lonavala/near-pawna-lake", label: "Near Pawna Lake", shortLabel: "Pawna Lake" },
  { key: "luxury", href: "/villas-in-lonavala/luxury", label: "Luxury", shortLabel: "Luxury" },
];

export const LONAVALA_STATIC_PATHS = [
  LONAVALA_MAIN_SEO.path,
  ...Object.values(LONAVALA_FILTER_PAGES).map((item) => item.path),
];

export function getLonavalaSeoConfig(filter) {
  if (!filter) return LONAVALA_MAIN_SEO;
  return LONAVALA_FILTER_PAGES[String(filter).toLowerCase()] || null;
}

export function buildLonavalaMetadata(config) {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}${config.path}`;
  const ogImage = "/Aboutusasset/Villabanner.jpg";

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: `${config.title} | ThevillaCamp`,
      description: config.description,
      url: canonicalUrl,
      siteName: "ThevillaCamp",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: config.h1,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.title} | ThevillaCamp`,
      description: config.description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function extractPropertyFacts(property, categoryLabel = "Villa") {
  const name =
    property?.name ||
    property?.hotelName ||
    property?.cottageName ||
    property?.campingName ||
    property?.villaName ||
    categoryLabel;

  const city =
    property?.address?.city ||
    property?.city ||
    property?.location?.city ||
    property?.area ||
    "Lonavala";
  const area = property?.address?.area || property?.area || "";
  const landmark = property?.address?.landmark || "";
  const state = property?.address?.state || "Maharashtra";
  const locationText =
    area && area.toLowerCase() !== city.toLowerCase() ? `${area}, ${city}` : city;

  const collectUnitPrices = (units) =>
    Array.isArray(units)
      ? units
          .map(
            (u) =>
              Number(
                u?.pricing?.weekdayPrice ??
                  u?.weekdayPrice ??
                  u?.price ??
                  u?.pricing?.weekendPrice ??
                  0
              ) || 0
          )
          .filter((n) => n > 0)
      : [];

  const unitPrices = [
    ...collectUnitPrices(property?.tents),
    ...collectUnitPrices(property?.cottages),
    ...collectUnitPrices(property?.rooms),
  ];

  const rawWeekdayPrice =
    property?.pricing?.weekdayPrice ??
    property?.weekdayPrice ??
    property?.pricePerNight ??
    property?.basePrice ??
    property?.price ??
    (unitPrices.length > 0 ? Math.min(...unitPrices) : null);

  const rawWeekendPrice =
    property?.pricing?.weekendPrice ??
    property?.weekendPrice ??
    rawWeekdayPrice;

  const numericPrice = Number(rawWeekdayPrice);
  const weekendNumericPrice = Number(rawWeekendPrice);
  const effectivePrice =
    Number.isFinite(numericPrice) && numericPrice > 0
      ? numericPrice
      : Number.isFinite(weekendNumericPrice) && weekendNumericPrice > 0
      ? weekendNumericPrice
      : null;

  const bhkLabel = property?.bhkType || property?.subtype || "";
  const bhkMatch = String(bhkLabel).match(/(\d+)\s*BHK/i);
  const bedroomsCount = bhkMatch
    ? Number(bhkMatch[1])
    : Array.isArray(property?.rooms) && property.rooms.length > 0
    ? property.rooms.reduce((acc, r) => acc + (Number(r?.totalRooms) || 1), 0)
    : Array.isArray(property?.cottages) && property.cottages.length > 0
    ? property.cottages.reduce((acc, c) => acc + (Number(c?.totalCottages) || 1), 0)
    : Array.isArray(property?.tents) && property.tents.length > 0
    ? property.tents.reduce((acc, t) => acc + (Number(t?.totaltents) || 1), 0)
    : typeof property?.rooms === "number"
    ? property.rooms
    : null;

  const capacity =
    Number(property?.maxCapacity) ||
    (Array.isArray(property?.rooms) && property.rooms.length > 0
      ? property.rooms.reduce(
          (acc, r) => acc + (Number(r?.maxCapacity) || 2) * (Number(r?.totalRooms) || 1),
          0
        )
      : Array.isArray(property?.cottages) && property.cottages.length > 0
      ? property.cottages.reduce(
          (acc, c) =>
            acc + (Number(c?.maxCapacity) || 2) * (Number(c?.totalCottages) || 1),
          0
        )
      : Array.isArray(property?.tents) && property.tents.length > 0
      ? property.tents.reduce(
          (acc, t) => acc + (Number(t?.maxCapacity) || 2) * (Number(t?.totaltents) || 1),
          0
        )
      : null);

  const rawAmenityEntries = [
    ...(Array.isArray(property?.topamenities) ? property.topamenities : []),
    ...(Array.isArray(property?.amenities) ? property.amenities : []),
    ...(Array.isArray(property?.features) ? property.features : []),
  ];
  const amenityNames = Array.from(
    new Set(
      rawAmenityEntries
        .map((a) => (typeof a === "string" ? a : a?.name || a?.label || ""))
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
  const greatForList = Array.isArray(property?.greatFor)
    ? property.greatFor.map((g) => String(g).trim()).filter(Boolean)
    : [];
  const tagsList = Array.isArray(property?.tags)
    ? property.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];

  const featureCorpus = [...amenityNames, ...greatForList, ...tagsList]
    .join(" ")
    .toLowerCase();

  const hasPool = /pool|plunge|infinity pool/.test(featureCorpus);
  const hasLawn = /lawn|garden|gazebo/.test(featureCorpus);
  const hasWifi = /wi-?fi|internet/.test(featureCorpus);
  const hasBbq = /bbq|barbeque|barbecue/.test(featureCorpus);
  const hasBonfire = /bonfire|campfire|fire pit/.test(featureCorpus);
  const isPetFriendly =
    Boolean(property?.petFriendly) || /pet|dog|furry/.test(featureCorpus);
  const isCoupleFriendly =
    Boolean(property?.coupleFriendly) || /couple|romantic|honeymoon/.test(featureCorpus);

  let budgetPhrase = "";
  let budgetRoute = "";
  if (effectivePrice) {
    if (effectivePrice <= 5000) {
      budgetPhrase = "Under ₹5K";
      budgetRoute = "/villas-in-lonavala/under-5k";
    } else if (effectivePrice <= 10000) {
      budgetPhrase = "Under ₹10K";
      budgetRoute = "/villas-in-lonavala/under-10k";
    } else if (effectivePrice <= 15000) {
      budgetPhrase = "Under ₹15K";
      budgetRoute = "/villas-in-lonavala/under-15k";
    }
  }

  return {
    name,
    city,
    area,
    landmark,
    state,
    locationText,
    effectivePrice,
    weekendPrice:
      Number.isFinite(weekendNumericPrice) && weekendNumericPrice > 0
        ? weekendNumericPrice
        : null,
    budgetPhrase,
    budgetRoute,
    bhkLabel,
    bedroomsCount,
    capacity: capacity && capacity > 0 ? capacity : null,
    baths: Number(property?.baths) > 0 ? Number(property.baths) : null,
    amenityNames,
    greatForList,
    tagsList,
    hasPool,
    hasLawn,
    hasWifi,
    hasBbq,
    hasBonfire,
    isPetFriendly,
    isCoupleFriendly,
  };
}

export function buildPropertySeoMeta(property, categoryLabel = "Villa") {
  const facts = extractPropertyFacts(property, categoryLabel);
  const catLower = categoryLabel.toLowerCase();
  const cityLower = facts.city.toLowerCase();

  const descriptorParts = [];
  if (facts.bhkLabel) descriptorParts.push(facts.bhkLabel);
  if (facts.hasPool && categoryLabel === "Villa" && !String(facts.bhkLabel).toLowerCase().includes("pool")) {
    descriptorParts.push("Private Pool");
  }
  const typeWithFeature =
    descriptorParts.length > 0
      ? `${descriptorParts.join(" ")} ${categoryLabel}`
      : categoryLabel;

  const title = facts.budgetPhrase
    ? `${facts.name} — ${typeWithFeature} in ${facts.locationText} (${facts.budgetPhrase})`
    : `${facts.name} — ${typeWithFeature} in ${facts.locationText}`;

  const summaryBits = [];
  if (facts.bhkLabel) summaryBits.push(facts.bhkLabel);
  if (facts.capacity) summaryBits.push(`Up to ${facts.capacity} Guests`);
  if (facts.hasPool) summaryBits.push("Private Pool");
  if (facts.hasLawn) summaryBits.push("Lawn");
  if (facts.isPetFriendly) summaryBits.push("Pet-Friendly");
  if (facts.effectivePrice) {
    summaryBits.push(
      `From ₹${Number(facts.effectivePrice).toLocaleString("en-IN")}/night`
    );
  }

  const baseDesc = (property?.shortDescription || property?.description || "").trim();
  let description;
  if (baseDesc) {
    const trimmed = baseDesc.length > 155 ? `${baseDesc.slice(0, 152).trim()}...` : baseDesc;
    const highlightTail =
      summaryBits.length > 0 ? ` ${summaryBits.slice(0, 4).join(" • ")}.` : "";
    description = trimmed.includes(facts.city)
      ? `${trimmed}${highlightTail}`
      : `${trimmed} in ${facts.locationText}.${highlightTail}`;
  } else {
    const highlightText =
      summaryBits.length > 0 ? `${summaryBits.join(" • ")}. ` : "";
    description = `Book ${facts.name}, a verified ${catLower} in ${facts.locationText}. ${highlightText}Direct host rates & 24/7 concierge on ThevillaCamp.`;
  }

  let budgetKeywords = [];
  if (facts.effectivePrice) {
    if (facts.effectivePrice <= 5000) {
      budgetKeywords = [
        `${catLower} under 5k in ${cityLower}`,
        `${catLower} in ${cityLower} under 5000`,
        `budget ${catLower} in ${cityLower}`,
      ];
    } else if (facts.effectivePrice <= 10000) {
      budgetKeywords = [
        `${catLower} under 10k in ${cityLower}`,
        `${catLower} in ${cityLower} under 10000`,
      ];
    } else if (facts.effectivePrice <= 15000) {
      budgetKeywords = [
        `${catLower} under 15k in ${cityLower}`,
        `${catLower} in ${cityLower} under 15000`,
      ];
    }
  }

  const synonymKeywords =
    categoryLabel === "Villa"
      ? [
          `holiday home in ${cityLower}`,
          `homestay in ${cityLower}`,
          `bungalow on rent in ${cityLower}`,
          `villa on rent in ${cityLower}`,
          ...(facts.bhkLabel ? [`${facts.bhkLabel.toLowerCase()} villa in ${cityLower}`] : []),
          ...(facts.hasPool ? [`private pool villa in ${cityLower}`] : []),
        ]
      : categoryLabel === "Camping"
      ? [
          `lakeside camping ${cityLower}`,
          `glamping tents ${cityLower}`,
          `camping with bbq and bonfire ${cityLower}`,
        ]
      : categoryLabel === "Cottage"
      ? [`farm stay ${cityLower}`, `chalet in ${cityLower}`, `couple cottage ${cityLower}`]
      : [`resort in ${cityLower}`, `boutique hotel ${cityLower}`];

  const dynamicFeatureKeywords = [
    ...(facts.isPetFriendly ? [`pet friendly ${catLower} ${cityLower}`] : []),
    ...(facts.isCoupleFriendly ? [`couple friendly ${catLower} ${cityLower}`] : []),
    ...(facts.hasBbq || facts.hasBonfire ? [`${catLower} with bbq and bonfire ${cityLower}`] : []),
    ...(facts.capacity && facts.capacity >= 10 ? [`group ${catLower} in ${cityLower}`] : []),
  ];

  const keywords = Array.from(
    new Set([
      facts.name,
      `${catLower} in ${cityLower}`,
      `${catLower}s in ${cityLower}`,
      ...synonymKeywords,
      ...dynamicFeatureKeywords,
      ...budgetKeywords,
      ...(facts.area && facts.area.toLowerCase() !== cityLower
        ? [`${catLower} in ${facts.area.toLowerCase()}`]
        : []),
      `book ${facts.name} ${cityLower}`,
      `${cityLower} staycation`,
      "thevillacamp",
    ])
  );

  return {
    title,
    description,
    keywords,
    city: facts.city,
    locationText: facts.locationText,
    numericPrice: facts.effectivePrice,
    facts,
  };
}

export function buildPropertyRouteMetadata({
  property,
  id,
  routePrefix,
  categoryLabel = "Villa",
  fallbackDescription = "Find and book verified villas, camping tents, cottages and hotels on ThevillaCamp.",
  includeLanguages = false,
}) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${routePrefix}/${id}`;

  const resolveAbsImage = (img) => {
    if (!img || typeof img !== "string") return `${siteUrl}/og-default.jpg`;
    return /^https?:\/\//i.test(img)
      ? img
      : `${siteUrl}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  if (!property || property.isapproved !== "approved" || property.isLive === false) {
    return {
      title: `${categoryLabel} Not Available`,
      description: "Explore curated verified villas, cottages, camping and hotels on ThevillaCamp.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const fallbackName = `${categoryLabel} ${id}`;
  const seo = buildPropertySeoMeta(
    {
      ...property,
      name:
        property?.name ||
        property?.hotelName ||
        property?.cottageName ||
        property?.campingName ||
        property?.villaName ||
        fallbackName,
    },
    categoryLabel
  );

  const rawImages = Array.isArray(property?.images) && property.images.length > 0
    ? property.images.slice(0, 4)
    : ["/og-default.jpg"];
  const ogImages = rawImages.map((img) => ({
    url: resolveAbsImage(img),
    width: 1200,
    height: 630,
    alt: seo.title,
  }));

  return {
    title: seo.title,
    description: seo.description || fallbackDescription,
    keywords: seo.keywords,
    openGraph: {
      title: `${seo.title} | ThevillaCamp`,
      description: seo.description || fallbackDescription,
      url: pageUrl,
      siteName: "ThevillaCamp",
      images: ogImages,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      site: "@Thevillacamp",
      creator: "@Thevillacamp",
      title: `${seo.title} | ThevillaCamp`,
      description: seo.description || fallbackDescription,
      images: [ogImages[0].url],
    },
    alternates: {
      canonical: pageUrl,
      ...(includeLanguages ? { languages: { "en-IN": pageUrl, "en-US": pageUrl } } : {}),
    },
  };
}
