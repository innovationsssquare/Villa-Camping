// src/redux/slices/villaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetCottagebyid,
  Getcottagedaydetails,
} from "@/lib/API/category/Cottage/Cottage";

// Thunk for fetching villa by id
export const fetchCottageById = createAsyncThunk(
  "cottage/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetCottagebyid(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getCottageDayDetailsThunk = createAsyncThunk(
  "Cottage/getDayDetailsThunk",
  async ({ id, date }, thunkAPI) => {
    try {
      const response = await Getcottagedaydetails(id, date);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const cottageSlice = createSlice({
  name: "cottage",
  initialState: {
    cottage: null,
    loading: false,
    error: null,

    dayDetails: null,
    dayDetailsLoading: false,
    dayDetailsError: null,
  },
  reducers: {
    clearCottage: (state) => {
      state.cottage = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCottageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCottageById.fulfilled, (state, action) => {
        state.loading = false;
        state.cottage = action.payload;
      })
      .addCase(fetchCottageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch camping";
      })
      .addCase(getCottageDayDetailsThunk.pending, (state) => {
        state.dayDetailsLoading = true;
        state.dayDetailsError = null;
      })
      .addCase(getCottageDayDetailsThunk.fulfilled, (state, action) => {
        state.dayDetailsLoading = false;
        state.dayDetails = action.payload;
      })
      .addCase(getCottageDayDetailsThunk.rejected, (state, action) => {
        state.dayDetailsLoading = false;
        state.dayDetailsError = action.payload;
      });
  },
});

export const { clearCottage } = cottageSlice.actions;
export default cottageSlice.reducer;
