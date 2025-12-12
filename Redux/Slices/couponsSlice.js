// redux/slices/couponsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Applycoupon, Getallcouponbypropertyid } from "@/lib/API/Coupon/Coupon";

// Thunks
export const fetchCouponsByProperty = createAsyncThunk(
  "coupons/fetchByProperty",
  async (propertyId, { rejectWithValue }) => {
    try {
      const res = await Getallcouponbypropertyid(propertyId);
      // Expecting your API returns { status: "success", data: { coupons: [...] } } or similar
      if (!res || res?.status === false) {
        const message = res?.message || "Failed to fetch coupons";
        return rejectWithValue(message);
      }
      // normalize: if API returns data.coupons or coupons directly
      const coupons = res?.data?.coupons ?? res?.coupons ?? [];
      return coupons;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

export const applyCoupon = createAsyncThunk(
  "coupons/apply",
  async (payload, { rejectWithValue }) => {
    // payload expected: { couponCode, orderValue, userId, deviceId, propertyType, propertyId, checkIn, checkOut }
    try {
      const res = await Applycoupon(payload);
      // Your frontend helper currently returns whatever backend returns; handle success/failure
      // Expectation: res = { status: "success", data: { coupon, discountAmount } }
      if (!res) return rejectWithValue("No response from server");
      if (res?.status === false || res?.status === "failed") {
        return rejectWithValue(res?.message || "Failed to apply coupon");
      }
      // If your API returns `data` with coupon + discountAmount
      const data = res?.data ?? res;
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to apply coupon");
    }
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState: {
    list: [],
    fetchStatus: "idle",
    fetchError: null,
    applyStatus: "idle",
    applyError: null,
    lastAppliedResult: null,
  },
  reducers: {
    clearApplyState(state) {
      state.applyStatus = "idle";
      state.applyError = null;
      state.lastAppliedResult = null;
    },
    clearCoupons(state) {
      state.list = [];
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCouponsByProperty
    builder
      .addCase(fetchCouponsByProperty.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchCouponsByProperty.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCouponsByProperty.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload || action.error.message;
      });

    // applyCoupon
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.applyStatus = "loading";
        state.applyError = null;
        state.lastAppliedResult = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.applyStatus = "succeeded";
        state.lastAppliedResult = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.applyError = action.payload || action.error.message;
      });
  },
});

export const { clearApplyState, clearCoupons } = couponsSlice.actions;

export default couponsSlice.reducer;
