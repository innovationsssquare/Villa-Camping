import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Users,
  Award,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Compass,
  PhoneCall,
  Star,
  Flame,
  Waves,
  TreePine,
  Hotel,
} from "lucide-react";

export const metadata = {
  title: "About Us | ThevillaCamp - Luxury Villas & Lakeside Stays",
  description:
    "Discover the story of ThevillaCamp. Handpicked private pool villas, lakeside camping, rustic cottages, and boutique stays across Lonavala, Pawna Lake, and Maharashtra.",
};

const STATS = [
  { value: "150+", label: "Handpicked Stays", subtext: "Audited & Verified" },
  { value: "50,000+", label: "Happy Guests", subtext: "Memorable Getaways" },
  { value: "4.9 ★", label: "Average Rating", subtext: "Consistent Excellence" },
  { value: "24/7", label: "Concierge Care", subtext: "Dedicated Assistance" },
];

const CATEGORIES = [
  {
    title: "Luxury Pool Villas",
    subtitle: "Private Infinity Pools & Manicured Lawns",
    description:
      "Exclusive standalone villas featuring crystal-clear private pools, gazebo dining, outdoor barbecue decks, and dedicated on-site caretakers for families and celebrations.",
    image: "/Aboutusasset/Villabanner.jpg",
    link: "/category/villa",
    tag: "Most Popular",
    icon: Waves,
  },
  {
    title: "Pawna Lakeside Camping",
    subtitle: "Stargazing, Bonfires & Water Sports",
    description:
      "Waterfront camping and luxury glamping tents directly overlooking Pawna Lake. Enjoy live acoustic evenings, barbecue dinners, and sunrise kayaking.",
    image: "/Aboutusasset/Campbanner.jpg",
    link: "/category/camping",
    tag: "Adventure & Peace",
    icon: Flame,
  },
  {
    title: "Rustic Sahyadri Cottages",
    subtitle: "Cozy Mountain Chalets & Valley Views",
    description:
      "Charming wooden chalets and stone cottages nestled amidst misty hills and lush flora. Perfect for tranquil couple retreats and nature lovers.",
    image: "/Aboutusasset/Cottagebanner.jpg",
    link: "/category/cottage",
    tag: "Serene Retreats",
    icon: TreePine,
  },
  {
    title: "Boutique Resort Hotels",
    subtitle: "Curated Comfort & Fine Dining",
    description:
      "Handpicked boutique hotel rooms and premium suites offering exceptional room service, curated dining, and relaxing resort amenities.",
    image: "/Aboutusasset/Hotelbanner.jpg",
    link: "/category/hotel",
    tag: "Premium Hospitality",
    icon: Hotel,
  },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Personally Verified",
    description:
      "Every single property on our platform undergoes a rigorous 40-point quality check — from pool water filtration to bed linen hygiene and power backup.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated On-Site Hospitality",
    description:
      "Enjoy warm local care. Our vetted caretakers assist with luggage, prepare mouthwatering homecooked Maharashtrian meals, and arrange evening bonfires.",
  },
  {
    icon: Award,
    title: "Direct Host Pricing",
    description:
      "Zero hidden platform markups or surprise fees at checkout. We partner directly with property owners to offer the guaranteed best rates.",
  },
  {
    icon: Users,
    title: "Complete Seclusion & Privacy",
    description:
      "When you book a villa with us, the entire estate is reserved exclusively for your family or group. No shared spaces, no interruptions.",
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Ananya Deshmukh",
    city: "Mumbai",
    text: "We booked a 4BHK pool villa in Lonavala for my parents' 50th anniversary. The caretaker arranged a delicious barbecue, and the pool was pristine. ThevillaCamp truly exceeded our expectations!",
    stay: "Villa Euphoria, Lonavala",
    rating: 5,
  },
  {
    name: "Sameer & Riya Kulkarni",
    city: "Pune",
    text: "The Pawna Lake camping experience was magical. The tents were spacious and clean, the sunset over the water was breathtaking, and the acoustic music by the bonfire made our weekend unforgettable.",
    stay: "Lakeside Glamping, Pawna Lake",
    rating: 5,
  },
  {
    name: "Vikram Singhania",
    city: "Thane",
    text: "Seamless booking, exact photos matching the property, and quick support via WhatsApp. ThevillaCamp is now our go-to for all long weekend trips from Mumbai.",
    stay: "Hilltop Cottage, Malavli",
    rating: 5,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#ff6900] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>The ThevillaCamp Story</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
            Redefining Luxury Escapes &amp; Lakeside Stays
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            We curate Maharashtra’s finest private pool villas, Pawna Lake glamping retreats, and secluded mountain cottages — creating cherished moments nestled in nature.
          </p>

          {/* Key Metric Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-neutral-800 mt-1">{stat.label}</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Mission & Story */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900]">
                Our Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Born to Bridge the Gap Between Impersonal Hotels &amp; Chaotic Rentals
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Finding the perfect weekend holiday shouldn&apos;t feel like a gamble. Too often, travelers arrive at holiday homes only to find dirty pools, absent caretakers, or photos from a decade ago.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <strong>ThevillaCamp</strong> was founded with a singular purpose: to handpick, audit, and manage properties that meet uncompromising standards of cleanliness, safety, and scenic tranquility. Whether it&apos;s a grand celebration in a Lonavala estate or a peaceful campfire under the stars by Pawna Lake, we ensure every detail is tailored for perfection.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-neutral-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vetted Caretakers
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Generator Power Backup
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> High-Speed Wi-Fi
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fresh Cleaned Pools
                </span>
              </div>
            </div>

            {/* Featured Visual */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/Aboutusasset/Villabanner.jpg"
                alt="Luxury Villa Getaway"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-300">
                    Curated Signature Stay
                  </span>
                  <p className="text-lg font-bold mt-0.5">Private Pool Estates Across Lonavala</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Categories Showcase */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900]">
              Our Collection
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Stays Tailored to Every Mood
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              From high-energy family reunions to tranquil lakeside soul trips.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="group rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-neutral-900">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-neutral-900 shadow-xs">
                        {cat.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-orange-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-orange-200">{cat.subtitle}</span>
                      </div>
                      <h3 className="text-xl font-bold">{cat.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {cat.description}
                    </p>
                    <div>
                      <Link
                        href={cat.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 group-hover:text-[#ff6900] transition-colors"
                      >
                        <span>Explore {cat.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* The ThevillaCamp Difference (Core Pillars) */}
        <section className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-neutral-800">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                The ThevillaCamp Promise
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Setting gold standards for leisure getaways across Western Ghats.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3 backdrop-blur-xs"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#ff6900]/20 text-[#ff6900] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guest Reviews & Social Proof */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900]">
              Guest Experiences
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Loved by Discerning Travelers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Hear what our guests have to say about their stays.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="pt-2 border-t border-neutral-100">
                  <div className="font-bold text-xs text-neutral-900">{t.name}</div>
                  <div className="text-[11px] text-neutral-400">{t.city} • <span className="text-neutral-600 font-medium">{t.stay}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ready to Escape CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-neutral-800">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready for Your Next Unforgettable Getaway?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Explore our handpicked collection of luxury pool villas and lakeside tents, or talk to our 24/7 concierge for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/category/all"
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Browse All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all backdrop-blur-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact Concierge Desk</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
