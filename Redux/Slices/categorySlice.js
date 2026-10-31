import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllcategories } from "@/lib/API/category/Category";

export const fetchAllCategories = createAsyncThunk(
  "master/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllcategories();
      if (
        !response ||
        response.success === false ||
        response.status === false ||
        typeof response === "string"
      ) {
        return rejectWithValue(
          response?.message || "Failed to fetch categories"
        );
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Initial state
const initialState = {
  tax: [],
  measurement: [],
  categories: [],
  subcategories: [],
  loading: false,
  isLoaded: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Measurement

      // Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.error = action.payload || action.error?.message;
      });

    // Subcategories
  },
});

export default categorySlice.reducer;
