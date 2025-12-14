// src/redux/slices/villaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetCampingbyid } from "@/lib/API/category/Camping/Camping"; 

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

const campingSlice = createSlice({
  name: "camping",
  initialState: {
    camping: null,
    loading: false,
    error: null,
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
      });
  },
});

export const { clearCamping } = campingSlice.actions;
export default campingSlice.reducer;
