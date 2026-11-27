import { Suspense } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import ProductListing from "@/components/Productcomponets/Product-listing";
import { BaseUrl } from "@/lib/API/Baseurl";
import { KNOWN_CATEGORY_IDS, getCategoryRouteName } from "@/lib/categoryUtils";
import {
  LONAVALA_FILTER_TABS,
  LONAVALA_MICRO_LOCATIONS,
  getSiteUrl,
} from "@/lib/lonavalaSeo";

export async function DynamicCollectionSchema({
  title,
  description,
  url,
  categoryId,
  search,
  priceMin,
  priceMax,
}) {
  const siteUrl = getSiteUrl();
  let items = [];

  try {
    const params = new URLSearchParams({ page: "1", limit: "12" });
    if (categoryId) params.set("categoryId", categoryId);
    if (search) params.set("search", search);
    if (priceMin != null && priceMin > 0) params.set("priceMin", String(priceMin));
    if (priceMax != null && priceMax > 0) params.set("priceMax", String(priceMax));

    const res = await fetch(`${BaseUrl}/User/properties/available?${params.toString()}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const json = await res.json();
      const raw = json?.data || json?.properties || [];
      if (Array.isArray(raw)) {
        items = raw
          .filter((item) => item && item._id && item.isLive !== false)
          .slice(0, 12);
      }
    }
  } catch (e) {}

  const listElements = items.map((item, idx) => {
    const routeCat = getCategoryRouteName(item);
    const itemUrl = `${siteUrl}/view-${routeCat}/${item._id}`;
    const img = Array.isArray(item.images) && item.images[0] ? item.images[0] : null;
    return {
      "@type": "ListItem",
      position: idx + 1,
      url: itemUrl,
      name:
        item.name ||
        item.hotelName ||
        item.cottageName ||
        item.campingName ||
        `${routeCat} ${item._id}`,
      ...(img && /^https?:\/\//i.test(img) ? { image: img } : {}),
    };
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    ...(listElements.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: listElements.length,
            itemListElement: listElements,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
    />
  );
}

export function LonavalaBudgetNav({ activeSlug = "" }) {
  const currentKey = activeSlug || "all";

  return (
    <nav
      aria-label="Lonavala villa budget and type filters"
      className="bg-white/95 border-b border-neutral-200/80"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Link href="/" className="hover:text-[#ff6900] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/villas-in-lonavala"
              className="hover:text-[#ff6900] transition-colors font-medium text-neutral-700"
            >
              Villas in Lonavala
            </Link>
            {currentKey !== "all" && (
              <>
                <span>/</span>
                <span className="font-semibold text-[#ff6900] capitalize">
                  {currentKey.replace(/-/g, " ")}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {LONAVALA_FILTER_TABS.map((tab) => {
              const isActive = tab.key === currentKey;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? "bg-[#ff6900] text-white border-[#ff6900] shadow-xs"
                      : "bg-neutral-50 hover:bg-orange-50 text-neutral-700 hover:text-[#ff6900] border-neutral-200"
                  }`}
                >
                  {tab.shortLabel}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function LonavalaSeoSection({ config }) {
  if (!config) return null;

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${config.path}`;

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Villas in Lonavala",
      item: `${siteUrl}/villas-in-lonavala`,
    },
  ];

  if (config.slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: config.h1,
      item: pageUrl,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const faqJsonLd =
    Array.isArray(config.faqs) && config.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: config.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <section className="bg-white border-t border-neutral-200/80 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Suspense fallback={null}>
        <DynamicCollectionSchema
          title={config.h1}
          description={config.description}
          url={pageUrl}
          categoryId={KNOWN_CATEGORY_IDS.VILLA}
          search={config.searchQuery}
          priceMin={config.priceMin}
          priceMax={config.priceMax}
        />
      </Suspense>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Guide + Key Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-neutral-50/90 border border-neutral-200/80 rounded-2xl p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ff6900] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lonavala Stay Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
              {config.editorialTitle}
            </h2>
            <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
              {config.editorialParagraphs?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="bg-orange-50/50 border border-orange-200/70 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Explore by Budget in Lonavala
              </h3>
              <div className="flex flex-wrap gap-2">
                {LONAVALA_FILTER_TABS.map((tab) => (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      (config.slug || "all") === tab.key
                        ? "bg-[#ff6900] text-white border-[#ff6900]"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-[#ff6900] hover:text-[#ff6900]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-orange-200/60 space-y-2 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% verified villas & direct host pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff6900] shrink-0" />
                <span>Lonavala, Malavli, Tungarli, Khandala & Pawna Lake</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        {Array.isArray(config.faqs) && config.faqs.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions — {config.h1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {config.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  open={idx < 2}
                  className="group bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-4 open:bg-white open:shadow-xs transition-all"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-sm text-neutral-900">
                    <span>{faq.question}</span>
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Popular Lonavala Neighborhoods & Landmarks */}
        <div className="pt-4 border-t border-neutral-200/80 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800 mr-1">Popular Areas in Lonavala:</span>
            {LONAVALA_MICRO_LOCATIONS.map((loc, i) => (
              <span key={loc.name} className="inline-flex items-center gap-2">
                {i > 0 && <span>•</span>}
                <Link
                  href={`/villas-in-lonavala?search=${encodeURIComponent(loc.query)}`}
                  className="hover:text-[#ff6900] underline-offset-2 hover:underline"
                >
                  Villas in {loc.name}
                </Link>
              </span>
            ))}
          </div>

          {/* Quick Related Links */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800 mr-1">Popular Searches:</span>
            <Link href="/villas-in-lonavala" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Villas & Holiday Homes in Lonavala
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/under-5k" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Villa Under 5K in Lonavala
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/under-10k" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Villa Under 10K in Lonavala
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/under-15k" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Villa Under 15K in Lonavala
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/private-pool" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Private Pool Bungalows Lonavala
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/for-groups" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Group Farmhouses & Offsite Villas
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/pet-friendly" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Pet-Friendly Villas Lonavala
            </Link>
            <span>•</span>
            <Link href="/villas-in-lonavala/near-pawna-lake" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Villas Near Pawna Lake
            </Link>
            <span>•</span>
            <Link href="/category/camping" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Pawna Lake Camping
            </Link>
            <span>•</span>
            <Link href="/category/cottage" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Cottages & Farm Stays
            </Link>
            <span>•</span>
            <Link href="/category/hotel" className="hover:text-[#ff6900] underline-offset-2 hover:underline">
              Resorts in Lonavala
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LonavalaLandingView({ config }) {
  return (
    <div className="pt-22 md:pt-36 bg-neutral-50/60 min-h-screen">
      <LonavalaBudgetNav activeSlug={config.slug} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListing
          categorySlug="villa"
          initialSearch={config.searchQuery}
          initialPriceMin={config.priceMin}
          initialPriceMax={config.priceMax}
          initialPriceRangeId={config.priceRangeId}
          headingTitle={config.h1}
          headingSubtitle={config.subtitle}
          seoBadge={config.badge}
        />
      </Suspense>
      <LonavalaSeoSection config={config} />
    </div>
  );
}
