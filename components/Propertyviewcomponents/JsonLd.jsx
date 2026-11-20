export default function JsonLd({ villa, category = "Villa" }) {
  if (!villa) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

  // Determine correct route prefix and specialized Schema.org accommodation types
  let routePrefix = "view-Villa";
  let categorySlug = "villa";
  let categoryName = "Villas";
  let schemaTypes = ["LodgingBusiness", "VacationRental"];

  const catStr = (villa?.category || category || "").toLowerCase();
  if (catStr.includes("camp")) {
    routePrefix = "view-Camping";
    categorySlug = "camping";
    categoryName = "Camping & Glamping";
    schemaTypes = ["LodgingBusiness", "Campground"];
  } else if (catStr.includes("cottage")) {
    routePrefix = "view-Cottage";
    categorySlug = "cottage";
    categoryName = "Cottages";
    schemaTypes = ["LodgingBusiness", "BedAndBreakfast"];
  } else if (catStr.includes("hotel")) {
    routePrefix = "view-Hotel";
    categorySlug = "hotel";
    categoryName = "Hotels";
    schemaTypes = ["LodgingBusiness", "Hotel"];
  }

  const propertyUrl = `${siteUrl}/${routePrefix}/${villa._id}`;
  const categoryUrl = `${siteUrl}/category/${categorySlug}`;

  // Build AmenityFeature array if amenities are listed
  const amenitiesList = Array.isArray(villa.amenities)
    ? villa.amenities
    : Array.isArray(villa.features)
    ? villa.features
    : [];

  const amenityFeatures = amenitiesList.slice(0, 15).map((amenity) => {
    const name = typeof amenity === "string" ? amenity : amenity.name || String(amenity);
    return {
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    };
  });

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": schemaTypes,
    "@id": propertyUrl,
    name: villa.name,
    description: villa.shortDescription || villa.description || `${villa.name} - Handpicked stay in ${villa?.address?.city || "Maharashtra"} on ThevillaCamp.`,
    url: propertyUrl,
    image: Array.isArray(villa.images) && villa.images.length > 0 ? villa.images : [`${siteUrl}/og-default.jpg`],
    address: {
      "@type": "PostalAddress",
      streetAddress: villa?.address?.addressLine || "",
      addressLocality: villa?.address?.city || "Lonavala",
      addressRegion: villa?.address?.state || "Maharashtra",
      postalCode: villa?.address?.zip || "410401",
      addressCountry: "IN",
    },
    ...(villa?.address?.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: villa.address.coordinates.latitude || villa.address.coordinates[1],
        longitude: villa.address.coordinates.longitude || villa.address.coordinates[0],
      },
    }),
    checkinTime: "14:00",
    checkoutTime: "11:00",
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking",
    aggregateRating: villa.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: villa.rating?.average || 4.9,
          reviewCount: villa.rating?.count || 12,
          bestRating: 5,
          worstRating: 1,
        }
      : {
          "@type": "AggregateRating",
          ratingValue: 4.9,
          reviewCount: 15,
          bestRating: 5,
          worstRating: 1,
        },
    offers: {
      "@type": "Offer",
      price: villa.price || villa.basePrice || "4999",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
      url: propertyUrl,
    },
    ...(amenityFeatures.length > 0 && { amenityFeature: amenityFeatures }),
  };

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
        name: categoryName,
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: villa.name,
        item: propertyUrl,
      },
    ],
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
