/**
 * Computes a dynamic, realistic rating and review count for any property/stay.
 *
 * 1. If property has genuine database rating (property.averageRating or property.rating > 0), uses that.
 * 2. If property has reviews in property.reviews, computes genuine average and count.
 * 3. Otherwise, generates a deterministic, realistic rating (e.g. 4.7, 4.8, 4.9, 4.85) and
 *    review count (e.g. 18 to 72) seeded by the property's unique ID/name.
 *
 * This ensures every single property card displays its OWN distinct dynamic rating,
 * eliminating duplicate static numbers like "4.9 (24)" across all cards.
 */
export function getPropertyRating(property) {
  if (!property) {
    return {
      rating: "4.8",
      ratingNumber: 4.8,
      reviewCount: 24,
      formattedText: "4.8 (24)",
    };
  }

  // 1. Genuine averageRating or rating from MongoDB
  const avg = Number(property.averageRating ?? property.rating);
  if (!isNaN(avg) && avg > 0) {
    const rawCount = Number(
      property.totalReviews ??
        property.reviewCount ??
        (Array.isArray(property.reviews) ? property.reviews.length : 0)
    );
    const reviews = rawCount > 0 ? rawCount : getDeterministicReviews(property);
    return {
      rating: avg.toFixed(1),
      ratingNumber: avg,
      reviewCount: reviews,
      formattedText: `${avg.toFixed(1)} (${reviews})`,
    };
  }

  // 2. Compute from reviews array if present
  if (Array.isArray(property.reviews) && property.reviews.length > 0) {
    const valid = property.reviews.filter((r) => Number(r?.rating) > 0);
    if (valid.length > 0) {
      const calculatedAvg =
        valid.reduce((sum, r) => sum + Number(r.rating), 0) / valid.length;
      return {
        rating: calculatedAvg.toFixed(1),
        ratingNumber: calculatedAvg,
        reviewCount: valid.length,
        formattedText: `${calculatedAvg.toFixed(1)} (${valid.length})`,
      };
    }
  }

  // 3. Deterministic realistic rating based on property unique seed
  const seed = String(
    property._id || property.id || property.name || property.title || "stay"
  );
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Curated premium ratings: 4.6 to 4.9
  const ratingTiers = [
    4.8, 4.9, 4.7, 4.9, 4.8, 4.6, 4.9, 4.7, 4.8, 4.9, 4.8, 4.7, 4.9, 4.8, 4.9
  ];
  const baseRating = ratingTiers[absHash % ratingTiers.length];
  const finalRating = Math.min(4.9, Math.max(4.6, baseRating));

  // Dynamic review count: 14 to 88
  const reviewCount = 14 + (absHash % 75);

  return {
    rating: finalRating.toFixed(1),
    ratingNumber: finalRating,
    reviewCount,
    formattedText: `${finalRating.toFixed(1)} (${reviewCount})`,
  };
}

function getDeterministicReviews(property) {
  const seed = String(property?._id || property?.id || property?.name || "reviews");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return 14 + (Math.abs(hash) % 75);
}

export default getPropertyRating;
