/**
 * Client-Side Storage Manager for Recently Visited Properties
 * Optimized for zero latency (0ms), offline support, and anonymous guest browsing.
 */

const STORAGE_KEY = "thevillacamp_recently_visited";
const MAX_RECENT_ITEMS = 5;
export const RECENTLY_VISITED_EVENT = "thevillacamp_recently_visited_updated";

/**
 * Retrieve list of recently visited properties from localStorage
 * @returns {Array} Array of property objects
 */
export function getRecentlyVisited() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to retrieve recently visited properties:", err);
    return [];
  }
}

/**
 * Save or bump a visited property to the top of recent history
 * @param {Object} property Property data object
 * @param {string} [categoryName] Category name (e.g. 'Villa', 'Camping', 'Cottage', 'Hotel')
 */
export function saveRecentlyVisited(property, categoryName = "") {
  if (typeof window === "undefined" || !property) return;
  try {
    const propertyId = property._id || property.id;
    if (!propertyId) return;

    const resolvedCategory =
      categoryName ||
      property.categoryName ||
      property.category?.name ||
      property.category?.slug ||
      property.propertyType ||
      property.type ||
      "Villa";

    // Standardize category name capitalization for reliable tab matching
    const normalizedCategory =
      resolvedCategory.charAt(0).toUpperCase() +
      resolvedCategory.slice(1).toLowerCase();

    // Standardized snapshot structure matching Weekendcard expectations
    const entry = {
      _id: String(propertyId),
      id: String(propertyId),
      name: property.name || property.title || "Luxury Stay",
      images:
        Array.isArray(property.images) && property.images.length > 0
          ? property.images
          : property.image
            ? [property.image]
            : property.coverImage
              ? [property.coverImage]
              : ["/placeholder.svg"],
      pricing: property.pricing || {
        weekdayPrice: property.weekdayPrice || property.price || 0,
        weekendPrice: property.weekendPrice || property.price || 0,
      },
      address: {
        city: property.address?.city || property.city || "Lonavala",
        state: property.address?.state || "Maharashtra",
        area: property.address?.area || "",
      },
      rating: property.rating ? String(property.rating) : "5.0",
      tags: property.tags || ["Recent"],
      categoryName: normalizedCategory,
      propertyType: normalizedCategory,
      category: normalizedCategory,
      visitedAt: Date.now(),
    };

    const currentList = getRecentlyVisited();
    // Filter out previous visit if already present to bring it to the front
    const filtered = currentList.filter(
      (item) => String(item._id || item.id) !== String(propertyId)
    );

    const updated = [entry, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Notify any mounted components (like the homepage Recently Visited carousel)
    window.dispatchEvent(new Event(RECENTLY_VISITED_EVENT));
  } catch (err) {
    console.warn("Failed to save recently visited property:", err);
  }
}

/**
 * Clear all recently visited history
 */
export function clearRecentlyVisited() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(RECENTLY_VISITED_EVENT));
  } catch (err) {
    console.warn("Failed to clear recently visited properties:", err);
  }
}
