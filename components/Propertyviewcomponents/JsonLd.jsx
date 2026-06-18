export default function JsonLd({ villa }) {
  if (!villa) return null;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: villa.name,
    description: villa.description || villa.shortDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: villa?.address?.addressLine || '',
      addressLocality: villa?.address?.city || '',
      addressRegion: villa?.address?.state || '',
      postalCode: villa?.address?.zip || '',
    },
    image: villa.images || [],
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thevillacamp.com'}/view-Villa/${villa._id}`,
    aggregateRating: villa.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: villa.rating?.average || 5,
          reviewCount: villa.rating?.count || 0,
        }
      : undefined,
    offers: villa.price
      ? {
          '@type': 'Offer',
          price: villa.price,
          priceCurrency: 'INR',
        }
      : undefined,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  );
}
