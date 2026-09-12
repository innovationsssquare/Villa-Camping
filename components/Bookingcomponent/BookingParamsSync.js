"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setCheckin,
  setCheckout,
  setSelectedGuest,
  setSelectedCategory,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { KNOWN_CATEGORY_IDS } from "@/lib/categoryUtils";

export default function BookingParamsSync() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  // 1. Ensure categories are available globally
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchAllCategories());
    }
  }, [categories, dispatch]);

  // 2. Synchronize dates & guest parameters from URL into Redux
  useEffect(() => {
    if (!searchParams) return;
    const checkin = searchParams.get("checkin") || searchParams.get("checkIn");
    const checkout = searchParams.get("checkout") || searchParams.get("checkOut");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");

    if (checkin) dispatch(setCheckin(checkin));
    if (checkout) dispatch(setCheckout(checkout));
    if (adults || children) {
      dispatch(
        setSelectedGuest({
          adults: Number(adults) || 1,
          childrenn: Number(children) || 0,
        })
      );
    }
  }, [searchParams, dispatch]);

  // 3. Synchronize category from URL route if present
  useEffect(() => {
    if (!pathname) return;
    const p = pathname.toLowerCase();
    let detectedSlug = null;

    if (p.startsWith("/category/")) {
      detectedSlug = p.replace("/category/", "").split("?")[0].split("/")[0];
    } else if (p.startsWith("/view-camping")) {
      detectedSlug = "camping";
    } else if (p.startsWith("/view-cottage")) {
      detectedSlug = "cottage";
    } else if (p.startsWith("/view-hotel")) {
      detectedSlug = "hotel";
    } else if (p.startsWith("/view-villa")) {
      detectedSlug = "villa";
    }

    if (detectedSlug && detectedSlug !== "all") {
      let matchedId = null;
      let matchedName = null;

      const upper = detectedSlug.toUpperCase();
      if (KNOWN_CATEGORY_IDS[upper]) {
        matchedId = KNOWN_CATEGORY_IDS[upper];
        matchedName =
          detectedSlug.charAt(0).toUpperCase() + detectedSlug.slice(1);
      }

      if (categories && categories.length > 0) {
        const matched = categories.find(
          (c) =>
            c.slug?.toLowerCase() === detectedSlug ||
            c.name?.toLowerCase() === detectedSlug
        );
        if (matched) {
          matchedId = matched._id;
          matchedName = matched.name;
        }
      }

      if (matchedId) {
        dispatch(setSelectedCategory(matchedId));
        if (matchedName) dispatch(setSelectedCategoryname(matchedName));
      }
    }
  }, [pathname, categories, dispatch]);

  return null;
}
