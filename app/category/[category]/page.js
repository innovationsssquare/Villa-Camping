import ProductListing from "@/components/Productcomponets/Product-listing";
import React, { Suspense } from "react";

// Incremental Static Regeneration: revalidate category pages once every 60 seconds
export const revalidate = 60;

const CATEGORY_SEO_DATA = {
  villa: {
    title: "Luxury Private Pool Villas in Lonavala & Pawna",
    description:
      "Explore and book handpicked private pool villas in Lonavala, Malavli, and Western Ghats. Verified caretakers, sparkling pools, mountain views, and direct host rates.",
    keywords: [
      "luxury villas in lonavala",
      "private pool villas lonavala",
      "villas in malavli",
      "family villas lonavala",
      "lonavala villa booking",
      "private pool stay lonavala",
    ],
  },
  camping: {
    title: "Pawna Lake Camping & Waterfront Glamping Tents",
    description:
      "Experience serene lakeside camping and glamping at Pawna Lake. Includes live barbecue, bonfire music, kayaking, sunset views, and sanitized restrooms.",
    keywords: [
      "pawna lake camping",
      "glamping pawna lake",
      "lakeside tents lonavala",
      "camping in maharashtra",
      "water sports pawna lake",
      "pawna tent stay",
    ],
  },
  cottage: {
    title: "Charming Mountain Cottages & Wooden Chalets in Lonavala",
    description:
      "Escape to cozy rustic cottages and valley-view wooden chalets across Lonavala and Kamshet. Perfect for peaceful couple getaways and nature retreats.",
    keywords: [
      "cottages in lonavala",
      "wooden chalets lonavala",
      "kamshet cottages",
      "nature stays lonavala",
      "romantic cottages lonavala",
    ],
  },
  hotel: {
    title: "Handpicked Boutique Resort Hotels & Suites in Lonavala",
    description:
      "Reserve verified boutique hotels and premium suites in Lonavala with swimming pools, curated dining, daily housekeeping, and signature hospitality.",
    keywords: [
      "hotels in lonavala",
      "resorts in lonavala",
      "boutique stays lonavala",
      "luxury suites lonavala",
      "lonavala weekend resorts",
    ],
  },
  all: {
    title: "All Stays & Getaways in Lonavala, Pawna & Maharashtra",
    description:
      "Discover 150+ audited private pool villas, lakeside camping, cottages, and boutique stays across Maharashtra. Book direct with 24/7 concierge support.",
    keywords: [
      "villas in lonavala",
      "stays in pawna lake",
      "getaways from mumbai",
      "getaways from pune",
      "thevillacamp",
    ],
  },
};

export async function generateMetadata({ params }) {
  const { category } = await params;
  const slug = (category || "all").toLowerCase();
  const info = CATEGORY_SEO_DATA[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Stays in Lonavala & Pawna`,
    description: `Discover verified ${slug} accommodations in Lonavala and Pawna Lake on ThevillaCamp.`,
    keywords: [`${slug} lonavala`, "thevillacamp"],
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";
  const canonicalUrl = `${siteUrl}/category/${slug}`;

  let ogImage = "/og-default.jpg";
  if (slug === "villa") ogImage = "/Aboutusasset/Villabanner.jpg";
  else if (slug === "camping") ogImage = "/Aboutusasset/Campbanner.jpg";
  else if (slug === "cottage") ogImage = "/Aboutusasset/Cottagebanner.jpg";
  else if (slug === "hotel") ogImage = "/Aboutusasset/Hotelbanner.jpg";

  return {
    title: info.title,
    description: info.description,
    keywords: info.keywords,
    openGraph: {
      title: `${info.title} | ThevillaCamp`,
      description: info.description,
      url: canonicalUrl,
      siteName: "ThevillaCamp",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: info.title,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${info.title} | ThevillaCamp`,
      description: info.description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const page = async ({ params }) => {
  const resolvedParams = await params;
  const slug = (resolvedParams?.category || "all").toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        item: `${siteUrl}/category/${slug}`,
      },
    ],
  };

  return (
    <div className="pt-22 md:pt-36 bg-neutral-50/60 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListing categorySlug={resolvedParams.category} />
      </Suspense>
    </div>
  );
};

export default page;
