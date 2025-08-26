// src/redux/slices/villaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetVillabyid } from "@/lib/API/category/Villa/Villa"; 

// Thunk for fetching villa by id
export const fetchVillaById = createAsyncThunk(
  "villa/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetVillabyid(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const villaSlice = createSlice({
  name: "villa",
  initialState: {
    villa: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearVilla: (state) => {
      state.villa = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVillaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillaById.fulfilled, (state, action) => {
        state.loading = false;
        state.villa = action.payload;
      })
      .addCase(fetchVillaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch villa";
      });
  },
});

export const { clearVilla } = villaSlice.actions;
export default villaSlice.reducer;
