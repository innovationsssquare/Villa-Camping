import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MyBooking } from "@/lib/API/User/User";

/**
 * Fetch bookings by customer ID
 */
export const fetchMyBookings = createAsyncThunk(
  "myBookings/fetchMyBookings",
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await MyBooking(customerId);

      if (!res || res.error) {
        return rejectWithValue(res?.message || "Failed to fetch bookings");
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const myBookingSlice = createSlice({
  name: "myBookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMyBookings: (state) => {
      state.bookings = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMyBookings } = myBookingSlice.actions;
export default myBookingSlice.reducer;
