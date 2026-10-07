/**
 * Client-Side Storage Manager for Recently Visited Properties
 * Optimized for zero latency (0ms), offline support, anonymous guest browsing,
 * and automatic self-healing/pruning against deleted or dropped database items.
 */

import { BaseUrl } from "@/lib/API/Baseurl";
import { KNOWN_CATEGORY_IDS } from "@/lib/categoryUtils";

const STORAGE_KEY = "thevillacamp_recently_visited_v2";
const LEGACY_STORAGE_KEY = "thevillacamp_recently_visited";
const MAX_RECENT_ITEMS = 6;
export const RECENTLY_VISITED_EVENT = "thevillacamp_recently_visited_updated";

/**
 * Retrieve raw list of recently visited properties from localStorage
 * @returns {Array} Array of property objects
 */
export function getRecentlyVisited() {
  if (typeof window === "undefined") return [];
  try {
    // Check v2 storage first
    let raw = localStorage.getItem(STORAGE_KEY);
    
    // One-time cleanup: Check and migrate or discard legacy key
    if (!raw && localStorage.getItem(LEGACY_STORAGE_KEY)) {
      try {
        const legacyParsed = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "[]");
        // Only keep if items have valid 24-char ObjectId and realistic data
        const sanitized = Array.isArray(legacyParsed)
          ? legacyParsed.filter(
              (item) =>
                item &&
                typeof (item._id || item.id) === "string" &&
                (item._id || item.id).length === 24
            )
          : [];
        if (sanitized.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          raw = JSON.stringify(sanitized);
        }
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }

    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        (item._id || item.id) &&
        item.isapproved !== "pending" &&
        item.isapproved !== "rejected" &&
        item.isLive !== false
    );
  } catch (err) {
    console.warn("Failed to retrieve recently visited properties:", err);
    return [];
  }
}

/**
 * Validate recently visited properties against the live database and prune deleted stays
 * Ensures that if the database was dropped or a property was removed, it vanishes immediately.
 * @returns {Promise<Array>} List of verified, active properties
 */
export async function validateAndPruneRecentlyVisited() {
  if (typeof window === "undefined") return [];
  const currentList = getRecentlyVisited();
  if (currentList.length === 0) return [];

  try {
    // Verify each property against live database in parallel
    const verificationResults = await Promise.all(
      currentList.map(async (item) => {
        const propId = String(item._id || item.id || "").trim();
        // MongoDB ObjectIds are 24 hex characters
        if (!propId || propId.length !== 24) return null;

        try {
          const cat = item.categoryName || item.propertyType || "Villa";
          const catId = KNOWN_CATEGORY_IDS[cat.toUpperCase()] || cat;
          
          const res = await fetch(`${BaseUrl}/User/property/${catId}/${propId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });

          if (!res.ok) return null;
          const json = await res.json();
          if (!json?.success || !json?.data) return null;

          const liveData = json.data;
          // Refresh item with fresh live attributes from database
          return {
            ...item,
            _id: String(liveData._id || propId),
            id: String(liveData._id || propId),
            name: liveData.name || liveData.title || item.name,
            images:
              Array.isArray(liveData.images) && liveData.images.length > 0
                ? liveData.images
                : item.images,
            pricing: liveData.pricing || item.pricing,
            isapproved: liveData.isapproved || "approved",
            isLive: liveData.isLive !== false,
          };
        } catch {
          return null; // Network or 404 error => drop deleted/unreachable stay
        }
      })
    );

    const verifiedList = verificationResults.filter(Boolean);

    // If any stale or dropped properties were pruned, update localStorage immediately
    if (verifiedList.length !== currentList.length) {
      if (verifiedList.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedList));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
      window.dispatchEvent(new Event(RECENTLY_VISITED_EVENT));
    }

    return verifiedList;
  } catch (err) {
    console.warn("Validation of recently visited properties failed:", err);
    return currentList;
  }
}

/**
 * Save or bump a visited property to the top of recent history
 * @param {Object} property Property data object
 * @param {string} [categoryName] Category name (e.g. 'Villa', 'Camping', 'Cottage', 'Hotel')
 */
export function saveRecentlyVisited(property, categoryName = "") {
  if (typeof window === "undefined" || !property) return;
  if (property.isapproved && property.isapproved !== "approved") return;
  if (property.isLive === false) return;

  try {
    const propertyId = String(property._id || property.id || "").trim();
    if (!propertyId || propertyId.length !== 24) return;

    const resolvedCategory =
      categoryName ||
      property.categoryName ||
      property.category?.name ||
      property.category?.slug ||
      property.propertyType ||
      property.type ||
      "Villa";

    const normalizedCategory =
      resolvedCategory.charAt(0).toUpperCase() +
      resolvedCategory.slice(1).toLowerCase();

    const entry = {
      _id: propertyId,
      id: propertyId,
      name: property.name || property.title || "Scenic Stay",
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
      isapproved: property.isapproved || "approved",
      isLive: property.isLive !== false,
      visitedAt: Date.now(),
    };

    const currentList = getRecentlyVisited();
    const filtered = currentList.filter(
      (item) => String(item._id || item.id) !== propertyId
    );

    const updated = [entry, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

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
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.dispatchEvent(new Event(RECENTLY_VISITED_EVENT));
  } catch (err) {
    console.warn("Failed to clear recently visited properties:", err);
  }
}
