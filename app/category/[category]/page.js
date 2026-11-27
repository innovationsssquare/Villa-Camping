import ProductListing from "@/components/Productcomponets/Product-listing";
import {
  DynamicCollectionSchema,
  LonavalaBudgetNav,
} from "@/components/Seo/LonavalaSeoSection";
import { KNOWN_CATEGORY_IDS } from "@/lib/categoryUtils";
import { CATEGORY_SEO_CONFIG, getSiteUrl } from "@/lib/lonavalaSeo";
import React, { Suspense } from "react";

// Incremental Static Regeneration: revalidate category pages once every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { category } = await params;
  const slug = (category || "all").toLowerCase();
  const info = CATEGORY_SEO_CONFIG[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Stays in Lonavala & Pawna`,
    description: `Discover verified ${slug} accommodations in Lonavala and Pawna Lake on ThevillaCamp.`,
    keywords: [`${slug} lonavala`, "holiday homes lonavala", "thevillacamp"],
  };

  const siteUrl = getSiteUrl();
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
  const siteUrl = getSiteUrl();
  const info = CATEGORY_SEO_CONFIG[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Stays in Lonavala & Pawna`,
    description: `Discover verified ${slug} accommodations in Lonavala and Pawna Lake on ThevillaCamp.`,
  };
  const categoryId = KNOWN_CATEGORY_IDS[slug.toUpperCase()] || null;
  const canonicalUrl = `${siteUrl}/category/${slug}`;

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
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="pt-22 md:pt-36 bg-neutral-50/60 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={null}>
        <DynamicCollectionSchema
          title={info.title}
          description={info.description}
          url={canonicalUrl}
          categoryId={categoryId}
        />
      </Suspense>
      {(slug === "villa" || slug === "all") && <LonavalaBudgetNav />}
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListing categorySlug={resolvedParams.category} />
      </Suspense>
    </div>
  );
};

export default page;
