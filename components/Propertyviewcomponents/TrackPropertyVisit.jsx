"use client";

import { useEffect } from "react";
import { saveRecentlyVisited } from "@/lib/recentlyVisited";

export default function TrackPropertyVisit({ property, category }) {
  useEffect(() => {
    if (
      property &&
      (property._id || property.id) &&
      (!property.isapproved || property.isapproved === "approved") &&
      property.isLive !== false
    ) {
      saveRecentlyVisited(property, category);
    }
  }, [property, category]);

  return null;
}
