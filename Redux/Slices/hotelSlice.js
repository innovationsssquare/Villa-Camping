// src/redux/slices/villaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetHotelbyid,
  Gethoteldaydetails,
} from "@/lib/API/category/Hotel/Hotel";

// Thunk for fetching villa by id
export const fetchHotelById = createAsyncThunk(
  "hotel/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetHotelbyid(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getHotelDayDetailsThunk = createAsyncThunk(
  "Hotel/getDayDetailsThunk",
  async ({ id, date }, thunkAPI) => {
    try {
      const response = await Gethoteldaydetails(id, date);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const hotelSlice = createSlice({
  name: "hotel",
  initialState: {
    hotel: null,
    loading: false,
    error: null,

    dayDetails: null,
    dayDetailsLoading: false,
    dayDetailsError: null,
  },
  reducers: {
    clearHotel: (state) => {
      state.hotel = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.hotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch camping";
      })
      .addCase(getHotelDayDetailsThunk.pending, (state) => {
        state.dayDetailsLoading = true;
        state.dayDetailsError = null;
      })
      .addCase(getHotelDayDetailsThunk.fulfilled, (state, action) => {
        state.dayDetailsLoading = false;
        state.dayDetails = action.payload;
      })
      .addCase(getHotelDayDetailsThunk.rejected, (state, action) => {
        state.dayDetailsLoading = false;
        state.dayDetailsError = action.payload;
      });
  },
});

export const { clearHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
