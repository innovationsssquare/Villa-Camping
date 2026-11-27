import { KNOWN_CATEGORY_IDS } from "@/lib/categoryUtils";
import { getPropertyRating } from "@/lib/ratingUtils";
import { buildPropertySeoMeta, getSiteUrl } from "@/lib/lonavalaSeo";

export default function JsonLd({ villa, category = "Villa" }) {
  if (!villa) return null;

  const siteUrl = getSiteUrl();

  let routePrefix = "view-Villa";
  let categorySlug = "villa";
  let categoryName = "Villas";
  let categoryLabel = "Villa";
  let schemaTypes = ["LodgingBusiness", "VacationRental"];

  const rawCategoryId = String(villa?.category?._id || villa?.category || "");
  const catStr = `${villa?.category?.name || ""} ${villa?.category?.slug || ""} ${
    typeof villa?.category === "string" ? villa.category : ""
  } ${category || ""}`.toLowerCase();

  if (
    rawCategoryId === KNOWN_CATEGORY_IDS.CAMPING ||
    catStr.includes("camp")
  ) {
    routePrefix = "view-Camping";
    categorySlug = "camping";
    categoryName = "Camping & Glamping";
    categoryLabel = "Camping";
    schemaTypes = ["LodgingBusiness", "Campground"];
  } else if (
    rawCategoryId === KNOWN_CATEGORY_IDS.COTTAGE ||
    catStr.includes("cottage")
  ) {
    routePrefix = "view-Cottage";
    categorySlug = "cottage";
    categoryName = "Cottages";
    categoryLabel = "Cottage";
    schemaTypes = ["LodgingBusiness", "BedAndBreakfast"];
  } else if (
    rawCategoryId === KNOWN_CATEGORY_IDS.HOTEL ||
    catStr.includes("hotel")
  ) {
    routePrefix = "view-Hotel";
    categorySlug = "hotel";
    categoryName = "Hotels";
    categoryLabel = "Hotel";
    schemaTypes = ["LodgingBusiness", "Hotel"];
  }

  const seoMeta = buildPropertySeoMeta(villa, categoryLabel);
  const { facts } = seoMeta;
  const { ratingNumber, reviewCount } = getPropertyRating(villa);

  const propertyUrl = `${siteUrl}/${routePrefix}/${villa._id}`;
  const categoryUrl = `${siteUrl}/category/${categorySlug}`;

  const amenityFeatures = facts.amenityNames.slice(0, 18).map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  }));

  const effectivePrice = facts.effectivePrice ?? 4999;
  const priceBracket =
    Number(effectivePrice) <= 5000
      ? "₹"
      : Number(effectivePrice) <= 15000
      ? "₹₹"
      : "₹₹₹";

  const imagesList =
    Array.isArray(villa.images) && villa.images.length > 0
      ? villa.images
          .slice(0, 8)
          .map((img) =>
            /^https?:\/\//i.test(img)
              ? img
              : `${siteUrl}${img.startsWith("/") ? "" : "/"}${img}`
          )
      : [`${siteUrl}/og-default.jpg`];

  const lat =
    villa?.address?.coordinates?.latitude ??
    (Array.isArray(villa?.address?.coordinates)
      ? villa.address.coordinates[1]
      : null);
  const lng =
    villa?.address?.coordinates?.longitude ??
    (Array.isArray(villa?.address?.coordinates)
      ? villa.address.coordinates[0]
      : null);

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": schemaTypes,
    "@id": propertyUrl,
    identifier: String(villa._id),
    name: facts.name,
    description: seoMeta.description,
    keywords: seoMeta.keywords.join(", "),
    url: propertyUrl,
    image: imagesList,
    address: {
      "@type": "PostalAddress",
      streetAddress: villa?.address?.addressLine || "",
      addressLocality: facts.city,
      addressRegion: facts.state,
      postalCode: villa?.address?.zip || "410401",
      addressCountry: "IN",
    },
    ...(lat != null &&
      lng != null && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: lat,
          longitude: lng,
        },
      }),
    checkinTime: "14:00",
    checkoutTime: "11:00",
    priceRange: priceBracket,
    currenciesAccepted: "INR",
    paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking",
    petsAllowed: facts.isPetFriendly,
    ...(facts.bedroomsCount && { numberOfRooms: facts.bedroomsCount }),
    ...(facts.capacity && {
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: facts.capacity,
      },
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingNumber,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      price: String(effectivePrice),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
      url: propertyUrl,
    },
    ...(amenityFeatures.length > 0 && { amenityFeature: amenityFeatures }),
  };

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
      name: categoryName,
      item: categoryUrl,
    },
  ];

  const isLonavalaVilla =
    categoryLabel === "Villa" &&
    facts.locationText.toLowerCase().includes("lonavala");

  if (isLonavalaVilla) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: "Villas in Lonavala",
      item: `${siteUrl}/villas-in-lonavala`,
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: facts.name,
    item: propertyUrl,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
