// src/redux/slices/villaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetCampingbyid,
  Getcampingdaydetails,
} from "@/lib/API/category/Camping/Camping";

// Thunk for fetching villa by id
export const fetchCampingById = createAsyncThunk(
  "camping/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetCampingbyid(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getCampingDayDetailsThunk = createAsyncThunk(
  "Camping/getDayDetailsThunk",
  async ({ id, date }, thunkAPI) => {
    try {
      const response = await Getcampingdaydetails(id, date);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const campingSlice = createSlice({
  name: "camping",
  initialState: {
    camping: null,
    loading: false,
    error: null,

    dayDetails: null,
    dayDetailsLoading: false,
    dayDetailsError: null,
  },
  reducers: {
    clearCamping: (state) => {
      state.camping = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampingById.fulfilled, (state, action) => {
        state.loading = false;
        state.camping = action.payload;
      })
      .addCase(fetchCampingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch camping";
      })
      .addCase(getCampingDayDetailsThunk.pending, (state) => {
        state.dayDetailsLoading = true;
        state.dayDetailsError = null;
      })
      .addCase(getCampingDayDetailsThunk.fulfilled, (state, action) => {
        state.dayDetailsLoading = false;
        state.dayDetails = action.payload;
      })
      .addCase(getCampingDayDetailsThunk.rejected, (state, action) => {
        state.dayDetailsLoading = false;
        state.dayDetailsError = action.payload;
      });
  },
});

export const { clearCamping } = campingSlice.actions;
export default campingSlice.reducer;
