// src/redux/slices/propertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllproperties } from "@/lib/API/properties/Property";

// ✅ Thunk for fetching properties
export const fetchAllProperties = createAsyncThunk(
  "properties/fetchAll",
  async ({ categoryId, checkIn, checkOut, subtype, page, limit }, { rejectWithValue }) => {
    try {
      const response = await GetAllproperties({ categoryId, checkIn, checkOut, subtype, page, limit });

      if (response.success === false || response.error) {
        return rejectWithValue(response.message || "Failed to fetch properties");
      }

      return response; // API result
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const propertiesSlice = createSlice({
  name: "properties",
  initialState: {
    loading: false,
    error: null,
    data: [],
    pagination:null
  },
  reducers: {
    clearProperties: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || []; 
        state.pagination = action.payload.pagination
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearProperties } = propertiesSlice.actions;
export default propertiesSlice.reducer;
