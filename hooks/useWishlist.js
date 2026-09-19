"use client";

import { useEffect, useMemo, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlist,
  optimisticToggle,
  fetchWishlistIds,
} from "@/Redux/Slices/wishlistSlice";
import { useAuthModal } from "@/context/AuthModalContext";
import { getStoredUser } from "@/lib/auth";
import { getCleanPropertyType } from "@/lib/categoryUtils";
import { VillaContext } from "@/lib/context/VillaContext";
import { addToast } from "@heroui/react";

/**
 * Reusable Wishlist Hook for Property View and Card components.
 * Supports optimistic updates, Redux sync, Socket.IO sync, and Auth modal trigger.
 */
export function useWishlist({
  property: propProperty,
  propertyId: propPropertyId,
  propertyType: propPropertyType,
} = {}) {
  const dispatch = useDispatch();
  const { openAuthModal } = useAuthModal() || {};

  // Safe context fallback if property was not explicitly passed
  let contextVilla = null;
  try {
    contextVilla = useContext(VillaContext);
  } catch (e) {
    contextVilla = null;
  }

  const property = propProperty || contextVilla || null;
  const rawPropertyId =
    propPropertyId || property?._id || property?.id || contextVilla?._id;
  const propertyId = rawPropertyId ? String(rawPropertyId) : null;

  const resolvedType =
    propPropertyType ||
    (property ? getCleanPropertyType(property, [], "villa") : "villa") ||
    "villa";
  const propertyType = String(resolvedType).toLowerCase();
  const propertyName = property?.name || "Property";

  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);

  // Fetch user's wishlist IDs on mount if logged in and not yet cached
  useEffect(() => {
    const currentUser = getStoredUser();
    if (currentUser?._id && (!wishlistIds || wishlistIds.length === 0)) {
      dispatch(fetchWishlistIds(currentUser._id));
    }
  }, [dispatch, wishlistIds]);

  // Determine if this property is in user's wishlist
  const isLiked = useMemo(() => {
    if (!wishlistIds || !Array.isArray(wishlistIds) || !propertyId) return false;
    const rawId = String(propertyId);
    const key = `${propertyType}:${rawId}`;

    return (
      wishlistIds.includes(rawId) ||
      wishlistIds.includes(key) ||
      wishlistIds.some((item) => {
        if (!item) return false;
        if (typeof item === "string") return item === rawId || item === key;
        return String(item.propertyId) === rawId || String(item._id) === rawId;
      })
    );
  }, [wishlistIds, propertyId, propertyType]);

  const handleWishlist = useCallback(
    (e) => {
      e?.stopPropagation?.();
      e?.preventDefault?.();

      const currentUser = getStoredUser();
      if (!currentUser?._id) {
        if (typeof openAuthModal === "function") {
          openAuthModal();
        }
        return;
      }

      if (!propertyId) return;

      const nextWished = !isLiked;

      // 1. Instant optimistic update in Redux store
      dispatch(
        optimisticToggle({
          propertyId,
          propertyType,
          wished: nextWished,
        })
      );

      // 2. Server API toggle (with Socket.IO notification to other tabs)
      dispatch(
        toggleWishlist({
          propertyId,
          propertyType,
          userId: currentUser._id,
        })
      );

      // 3. User feedback toast
      try {
        addToast({
          title: nextWished ? "Saved to Wishlist" : "Removed from Wishlist",
          description: nextWished
            ? `${propertyName} has been added to your wishlist.`
            : `${propertyName} has been removed from your wishlist.`,
          color: nextWished ? "success" : "default",
        });
      } catch (toastErr) {
        // Fallback if toast context is not mounted
      }
    },
    [dispatch, propertyId, propertyType, propertyName, isLiked, openAuthModal]
  );

  return {
    isLiked,
    handleWishlist,
    propertyId,
    propertyType,
    propertyName,
  };
}

export default useWishlist;
