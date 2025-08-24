import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllcategories } from "@/lib/API/category/Category";

export const fetchAllCategories = createAsyncThunk(
  "master/fetchAllCategories",
  async () => {
    const response = await GetAllcategories();
    console.log(response)
    return response.data;
  }
);

// Initial state
const initialState = {
  tax: [],
  measurement: [],
  categories: [],
  subcategories: [],
  loading: false,
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
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Subcategories
  },
});

export default categorySlice.reducer;
