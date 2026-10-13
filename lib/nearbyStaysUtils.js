import { BaseUrl } from "@/lib/API/Baseurl";

/**
 * Robust coordinate parsing supporting:
 * - [lat, lng] or [lng, lat]
 * - "lat, lng" or "lat lng"
 * - { lat, lng } or { latitude, longitude }
 */
export function parseCoordinates(coords) {
  if (!coords) return null;

  if (Array.isArray(coords)) {
    if (coords.length >= 2) {
      const a = Number(coords[0]);
      const b = Number(coords[1]);
      if (isNaN(a) || isNaN(b)) return null;

      // Longitude in India is ~68-98, Latitude is ~8-37
      if (a > 50 && b < 45) {
        return { lat: b, lng: a };
      }
      return { lat: a, lng: b };
    }
  } else if (typeof coords === "string") {
    const parts = coords.trim().split(/[\s,]+/);
    if (parts.length >= 2) {
      const a = Number(parts[0]);
      const b = Number(parts[1]);
      if (!isNaN(a) && !isNaN(b)) {
        if (a > 50 && b < 45) {
          return { lat: b, lng: a };
        }
        return { lat: a, lng: b };
      }
    }
  } else if (typeof coords === "object") {
    const lat = Number(coords.lat ?? coords.latitude);
    const lng = Number(coords.lng ?? coords.longitude ?? coords.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Calculate Great-Circle distance in kilometers between two coordinates
 */
export function calculateDistanceKm(coord1, coord2) {
  const p1 = parseCoordinates(coord1);
  const p2 = parseCoordinates(coord2);
  if (!p1 || !p2) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Format property object for consistent rendering with PropertyCard
 */
export function formatNearbyProperty(property, currentCoords = null) {
  if (!property) return null;

  const pCoords = parseCoordinates(property.coordinates);
  const distanceKm =
    currentCoords && pCoords ? calculateDistanceKm(currentCoords, pCoords) : null;

  return {
    ...property,
    _id: property._id || property.id,
    name: property.name || property.title || "Stay",
    rating:
      property.averageRating && Number(property.averageRating) > 0
        ? Number(property.averageRating)
        : property.rating && Number(property.rating) > 0
        ? Number(property.rating)
        : 4.9,
    tags:
      Array.isArray(property.tags) && property.tags.length > 0
        ? property.tags
        : ["Guest favourite", "Trending"],
    distanceKm,
  };
}

/**
 * Fetch and filter dynamic nearby stays from backend:
 * - Matches by location ObjectId, coordinate radius (default 50km), or city name
 * - Excludes current property
 * - Only includes approved and live stays
 * - Returns empty array [] if no stays exist (NO STATIC MOCK DATA)
 */
export async function fetchNearbyStays({
  currentProperty,
  propertyType = "Villa",
  maxRadiusKm = 50,
}) {
  if (!currentProperty) return [];

  const currentId = String(currentProperty._id || currentProperty.id || "");
  const currentLocationId = String(
    currentProperty.location?._id || currentProperty.location || ""
  );
  const currentCity = (currentProperty.address?.city || "").trim().toLowerCase();
  const currentCoords = parseCoordinates(currentProperty.coordinates);

  const cleanType = String(propertyType).toLowerCase();
  let endpoint = `${BaseUrl}/Villa/get/villas`;
  if (cleanType.includes("camp")) {
    endpoint = `${BaseUrl}/Camping/get/campings`;
  } else if (cleanType.includes("cottage")) {
    endpoint = `${BaseUrl}/Cottage/get/cottages`;
  } else if (cleanType.includes("hotel")) {
    endpoint = `${BaseUrl}/Hotel/get/hotels`;
  }

  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    const list =
      data?.data ||
      data?.properties ||
      (Array.isArray(data) ? data : []);

    // Filter out current property and ensure approved & live
    const otherStays = list.filter((p) => {
      const pId = String(p._id || p.id || "");
      const isCurrent = pId === currentId;
      const isApproved = p.isapproved === "approved";
      const isLive = p.isLive !== false;
      const isNotDeleted = !p.deletedAt;
      return !isCurrent && isApproved && isLive && isNotDeleted;
    });

    if (otherStays.length === 0) {
      return [];
    }

    // Match by location ID, coordinate distance, or city
    const matchedStays = otherStays.filter((p) => {
      const pLocationId = String(p.location?._id || p.location || "");
      const pCity = (p.address?.city || "").trim().toLowerCase();
      const pCoords = parseCoordinates(p.coordinates);

      const isLocationMatch =
        Boolean(currentLocationId) &&
        Boolean(pLocationId) &&
        currentLocationId === pLocationId;

      const isCityMatch =
        Boolean(currentCity) &&
        Boolean(pCity) &&
        (pCity.includes(currentCity.slice(0, 4)) ||
          currentCity.includes(pCity.slice(0, 4)));

      let isDistanceMatch = false;
      if (currentCoords && pCoords) {
        const dist = calculateDistanceKm(currentCoords, pCoords);
        if (dist !== null && dist <= maxRadiusKm) {
          isDistanceMatch = true;
        }
      }

      return isLocationMatch || isDistanceMatch || isCityMatch;
    });

    // Format properties and sort by coordinate distance if available
    const formatted = matchedStays.map((p) =>
      formatNearbyProperty(p, currentCoords)
    );

    formatted.sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.distanceKm !== null) return -1;
      if (b.distanceKm !== null) return 1;
      return (b.popularityScore || 0) - (a.popularityScore || 0);
    });

    return formatted.slice(0, 6);
  } catch (err) {
    console.error("Error fetching nearby stays from backend:", err);
    return [];
  }
}
