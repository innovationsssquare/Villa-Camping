import Link from "next/link";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { extractPropertyFacts } from "@/lib/lonavalaSeo";

const CATEGORY_HUB_MAP = {
  Villa: { href: "/category/villa", label: "All Villas" },
  Camping: { href: "/category/camping", label: "Pawna Lake Camping" },
  Cottage: { href: "/category/cottage", label: "Cottages & Chalets" },
  Hotel: { href: "/category/hotel", label: "Hotels & Resorts" },
};

export default function PropertySeoSummary({ property, categoryLabel = "Villa" }) {
  if (!property) return null;

  const facts = extractPropertyFacts(property, categoryLabel);
  const hub = CATEGORY_HUB_MAP[categoryLabel] || CATEGORY_HUB_MAP.Villa;
  const isLonavala =
    facts.city.toLowerCase().includes("lonavala") ||
    facts.locationText.toLowerCase().includes("lonavala") ||
    facts.locationText.toLowerCase().includes("pawna") ||
    facts.locationText.toLowerCase().includes("khandala") ||
    facts.locationText.toLowerCase().includes("malavli");

  const highlights = [
    facts.bhkLabel,
    facts.capacity ? `Up to ${facts.capacity} Guests` : null,
    facts.hasPool ? "Private Pool" : null,
    facts.hasLawn ? "Lawn & Garden" : null,
    facts.hasWifi ? "Wi-Fi" : null,
    facts.hasBbq ? "BBQ Grill" : null,
    facts.hasBonfire ? "Bonfire" : null,
    facts.isPetFriendly ? "Pet-Friendly" : null,
    facts.isCoupleFriendly ? "Couple-Friendly" : null,
  ].filter(Boolean);

  return (
    <section
      aria-label={`${facts.name} highlights and related stays`}
      className="bg-neutral-50 border-t border-neutral-200/80 py-8 sm:py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Server-rendered Breadcrumb Links */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
        >
          <Link href="/" className="hover:text-[#ff6900] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={hub.href} className="hover:text-[#ff6900] transition-colors">
            {hub.label}
          </Link>
          {categoryLabel === "Villa" && isLonavala && (
            <>
              <span>/</span>
              <Link
                href="/villas-in-lonavala"
                className="hover:text-[#ff6900] transition-colors"
              >
                Villas in Lonavala
              </Link>
            </>
          )}
          {facts.budgetRoute && categoryLabel === "Villa" && isLonavala && (
            <>
              <span>/</span>
              <Link
                href={facts.budgetRoute}
                className="hover:text-[#ff6900] transition-colors"
              >
                {facts.budgetPhrase}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="font-semibold text-neutral-800">{facts.name}</span>
        </nav>

        {/* Rich SSR Summary */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              {facts.name} — {facts.bhkLabel ? `${facts.bhkLabel} ` : ""}
              {categoryLabel} in {facts.locationText}
            </h2>
            {facts.effectivePrice && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6900] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                Starting ₹{Number(facts.effectivePrice).toLocaleString("en-IN")}/night
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Book {facts.name} in {facts.locationText}, {facts.state} directly on ThevillaCamp
            with verified photography, caretaker assistance, and transparent host rates.
            {highlights.length > 0
              ? ` Highlights include ${highlights.join(", ")}.`
              : ""}
            {property?.shortDescription ? ` ${property.shortDescription}` : ""}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-700">
            <span className="inline-flex items-center gap-1 font-semibold text-neutral-800 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
              Explore Similar Stays:
            </span>
            <Link
              href={hub.href}
              className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] border border-neutral-200 transition-colors"
            >
              {hub.label}
            </Link>
            <Link
              href="/villas-in-lonavala"
              className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] border border-neutral-200 transition-colors"
            >
              Villas in Lonavala
            </Link>
            {facts.budgetRoute && (
              <Link
                href={facts.budgetRoute}
                className="px-3 py-1 rounded-full bg-orange-50 text-[#ff6900] hover:bg-[#ff6900] hover:text-white border border-orange-200 transition-colors font-semibold"
              >
                Lonavala Villas {facts.budgetPhrase}
              </Link>
            )}
            <Link
              href="/villas-in-lonavala/under-5k"
              className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] border border-neutral-200 transition-colors"
            >
              Under ₹5K
            </Link>
            <Link
              href="/villas-in-lonavala/under-10k"
              className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] border border-neutral-200 transition-colors"
            >
              Under ₹10K
            </Link>
            <Link
              href="/villas-in-lonavala/under-15k"
              className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] border border-neutral-200 transition-colors"
            >
              Under ₹15K
            </Link>
            {facts.area && (
              <Link
                href={`/villas-in-lonavala?search=${encodeURIComponent(facts.area)}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] border border-neutral-200 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                Stays in {facts.area}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Audited property • Instant direct confirmation • 24/7 concierge support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
