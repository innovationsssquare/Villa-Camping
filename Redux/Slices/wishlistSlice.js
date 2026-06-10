import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Mywishlist } from "@/lib/API/User/User";
/* ===============================
   Helpers
================================ */
const API_BASE = process.env.NEXT_PUBLIC_PRODUCTION_URL;

/* ===============================
   Async Thunks (FETCH)
================================ */

/** ❤️ Toggle wishlist */
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async ({ propertyId, propertyType, userId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/Wishlist/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId, propertyType, userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { propertyId, propertyType, wished: data.wished };
    } catch (err) {
      return rejectWithValue(err.message || "Wishlist update failed");
    }
  }
);

/** 🆔 Fetch wishlist IDs */
export const fetchWishlistIds = createAsyncThunk(
  "wishlist/ids",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API_BASE}/Wishlist/wishlist/ids/6833656360ed0e90157dd2e1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.data; // ["villa:123", "hotel:456"]
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchmyWishlists = createAsyncThunk(
  "wishlist/mywishlist",
  async (_, { rejectWithValue }) => {
    try {
      const data = await Mywishlist();

      return data.data; // ["villa:123", "hotel:456"]
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
    ids: [], // ✅ SERIALIZABLE
    loading: false,
    error: null,

    wishlists: [],
    wishloading: false,
    wishlisterror: null,
  },

  reducers: {
    /** ⚡ Optimistic toggle */
    optimisticToggle(state, action) {
      const key = `${action.payload.propertyType}:${action.payload.propertyId}`;

      if (state.ids.includes(key)) {
        state.ids = state.ids.filter((id) => id !== key);
      } else {
        state.ids.push(key);
      }
    },

    /** 🔁 Rollback (if API fails) */
    rollbackToggle(state, action) {
      const key = `${action.payload.propertyType}:${action.payload.propertyId}`;

      if (state.ids.includes(key)) {
        state.ids = state.ids.filter((id) => id !== key);
      } else {
        state.ids.push(key);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistIds.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload;
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
        state.wishlists = action.payload;
      })
      .addCase(fetchmyWishlists.rejected, (state, action) => {
        state.wishloading = false;
        state.wishlisterror = action.payload;
      })

      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { optimisticToggle, rollbackToggle } = wishlistSlice.actions;

export default wishlistSlice.reducer;
