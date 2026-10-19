import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Mywishlist } from "@/lib/API/User/User";
import Cookies from "js-cookie";
import { BaseUrl, getBaseUrl } from "@/lib/API/Baseurl";

/* ===============================
   Helpers
================================ */
const getAuthHeaders = () => {
  const token =
    Cookies.get("token") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("thevilla_token") ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem("thevilla_user") || "{}")?.token;
          } catch {
            return null;
          }
        })()
      : null);

  return {
    "Content-Type": "application/json",
    ...(token ? { token, Authorization: `Bearer ${token}` } : {}),
  };
};

const normalizeKeys = (propertyType, propertyId) => {
  const type = (propertyType || "villa").toLowerCase();
  const rawId = String(propertyId);
  const compositeKey = `${type}:${rawId}`;
  return { compositeKey, rawId };
};

/* ===============================
   Async Thunks (FETCH)
================================ */

/** ❤️ Toggle wishlist */
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async ({ propertyId, propertyType, userId }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User authentication required");

      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/Wishlist/wishlist/toggle`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ propertyId, propertyType, userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update wishlist");

      return { propertyId, propertyType, wished: data.wished };
    } catch (err) {
      return rejectWithValue({
        message: err.message || "Wishlist update failed",
        propertyId,
        propertyType,
      });
    }
  }
);

/** 🆔 Fetch wishlist IDs */
export const fetchWishlistIds = createAsyncThunk(
  "wishlist/ids",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return [];

      const baseUrl = getBaseUrl();
      const res = await fetch(
        `${baseUrl}/Wishlist/wishlist/ids/${userId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.data || []; // ["villa:123", "123", ...]
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchmyWishlists = createAsyncThunk(
  "wishlist/mywishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await Mywishlist(userId);
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===============================
   Slice
================================ */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    ids: [], // Array of keys ["villa:123", "123"]
    loading: false,
    error: null,

    wishlists: [],
    wishloading: false,
    wishlisterror: null,
  },

  reducers: {
    /** ⚡ Optimistic toggle / Socket update */
    optimisticToggle(state, action) {
      const { propertyId, propertyType, wished } = action.payload || {};
      if (!propertyId) return;

      const { compositeKey, rawId } = normalizeKeys(propertyType, propertyId);

      // If explicit wished boolean was provided (e.g. from socket or API response)
      if (typeof wished === "boolean") {
        if (wished) {
          if (!state.ids.includes(compositeKey)) state.ids.push(compositeKey);
          if (!state.ids.includes(rawId)) state.ids.push(rawId);
        } else {
          state.ids = state.ids.filter(
            (id) => id !== compositeKey && id !== rawId
          );
        }
        return;
      }

      // If toggle without explicit boolean (user clicked the button)
      const isCurrentlyLiked =
        state.ids.includes(compositeKey) || state.ids.includes(rawId);

      if (isCurrentlyLiked) {
        state.ids = state.ids.filter(
          (id) => id !== compositeKey && id !== rawId
        );
      } else {
        if (!state.ids.includes(compositeKey)) state.ids.push(compositeKey);
        if (!state.ids.includes(rawId)) state.ids.push(rawId);
      }
    },

    /** 🔁 Rollback (if API fails) */
    rollbackToggle(state, action) {
      const { propertyId, propertyType } = action.payload || {};
      if (!propertyId) return;

      const { compositeKey, rawId } = normalizeKeys(propertyType, propertyId);
      const isCurrentlyLiked =
        state.ids.includes(compositeKey) || state.ids.includes(rawId);

      if (isCurrentlyLiked) {
        state.ids = state.ids.filter(
          (id) => id !== compositeKey && id !== rawId
        );
      } else {
        if (!state.ids.includes(compositeKey)) state.ids.push(compositeKey);
        if (!state.ids.includes(rawId)) state.ids.push(rawId);
      }
    },

    /** Clear wishlist on logout */
    clearWishlist(state) {
      state.ids = [];
      state.wishlists = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistIds.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWishlistIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchmyWishlists.pending, (state) => {
        state.wishloading = true;
        state.wishlisterror = null;
      })
      .addCase(fetchmyWishlists.fulfilled, (state, action) => {
        state.wishloading = false;
        state.wishlists = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchmyWishlists.rejected, (state, action) => {
        state.wishloading = false;
        state.wishlisterror = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { propertyId, propertyType, wished } = action.payload || {};
        if (!propertyId) return;

        const { compositeKey, rawId } = normalizeKeys(propertyType, propertyId);
        if (wished) {
          if (!state.ids.includes(compositeKey)) state.ids.push(compositeKey);
          if (!state.ids.includes(rawId)) state.ids.push(rawId);
        } else {
          state.ids = state.ids.filter(
            (id) => id !== compositeKey && id !== rawId
          );
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload?.message || "Wishlist update failed";
        // Rollback state since API failed
        const { propertyId, propertyType } = action.payload || {};
        if (propertyId) {
          const { compositeKey, rawId } = normalizeKeys(propertyType, propertyId);
          const isCurrentlyLiked =
            state.ids.includes(compositeKey) || state.ids.includes(rawId);
          if (isCurrentlyLiked) {
            state.ids = state.ids.filter(
              (id) => id !== compositeKey && id !== rawId
            );
          } else {
            if (!state.ids.includes(compositeKey)) state.ids.push(compositeKey);
            if (!state.ids.includes(rawId)) state.ids.push(rawId);
          }
        }
      });
  },
});

export const { optimisticToggle, rollbackToggle, clearWishlist } =
  wishlistSlice.actions;

/**
 * 🔢 Selector to calculate the accurate count of unique saved properties
 * Deduplicates raw IDs from composite keys like "cottage:id" and "id"
 */
export const selectWishlistCount = (state) => {
  const items = state?.wishlist?.wishlists;
  if (Array.isArray(items) && items.length > 0) return items.length;
  const ids = state?.wishlist?.ids;
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const uniqueRawIds = new Set();
  for (const item of ids) {
    if (!item) continue;
    if (typeof item === "object") {
      const raw = item.propertyId || item._id || item.id;
      if (raw) uniqueRawIds.add(String(raw));
    } else {
      const str = String(item).trim();
      if (!str) continue;
      const raw = str.includes(":") ? str.split(":")[1] : str;
      if (raw) uniqueRawIds.add(raw);
    }
  }
  return uniqueRawIds.size;
};

export default wishlistSlice.reducer;
