// src/redux/slices/propertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllproperties,
  Getpropertybyid,
  Getropertiesbyweekend,
} from "@/lib/API/properties/Property";

/* ----------------------------------
   Thunks
----------------------------------- */

// ✅ Fetch properties (normal search)
export const fetchAllProperties = createAsyncThunk(
  "properties/fetchAll",
  async (
    { categoryId, checkIn, checkOut, subtype, page, limit },
    { rejectWithValue }
  ) => {
    try {
      const response = await GetAllproperties({
        categoryId,
        checkIn,
        checkOut,
        subtype,
        page,
        limit,
      });

      if (response?.success === false) {
        return rejectWithValue(
          response.message || "Failed to fetch properties"
        );
      }

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch single property
export const fetchproperty = createAsyncThunk(
  "properties/fetchproperty",
  async ({ categoryId, propertyId }, { rejectWithValue }) => {
    try {
      const response = await Getpropertybyid({ categoryId, propertyId });

      if (response?.success === false) {
        return rejectWithValue(
          response.message || "Failed to fetch property"
        );
      }

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch available this weekend
export const fetchPropertiesByWeekend = createAsyncThunk(
  "properties/fetchByWeekend",
  async ({ categoryId, subtype }, { rejectWithValue }) => {
    try {
      const response = await Getropertiesbyweekend({
        categoryId,
        subtype,
      });

      if (response?.success === false) {
        return rejectWithValue(
          response.message || "Failed to fetch weekend properties"
        );
      }

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ----------------------------------
   Slice
----------------------------------- */

const propertiesSlice = createSlice({
  name: "properties",
  initialState: {
    // Normal listing
    dataloading: false,
    data: [],
    pagination: null,

    // Single property
    loading: false,
    property: null,

    // Weekend listing
    weekendLoading: false,
    weekendData: [],
    weekendError: null,

    // Shared error
    error: null,
  },
  reducers: {
    clearProperties: (state) => {
      state.data = [];
      state.pagination = null;
      state.error = null;
      state.dataloading = false;
    },
    clearWeekendProperties: (state) => {
      state.weekendData = [];
      state.weekendError = null;
      state.weekendLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Normal Properties ---------- */
      .addCase(fetchAllProperties.pending, (state) => {
        state.dataloading = true;
        state.error = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.dataloading = false;
        state.data = action.payload?.data || [];
        state.pagination = action.payload?.pagination || null;
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.dataloading = false;
        state.error = action.payload || "Something went wrong";
      })

      /* ---------- Single Property ---------- */
      .addCase(fetchproperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchproperty.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload?.data || null;
      })
      .addCase(fetchproperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      /* ---------- Weekend Properties ---------- */
      .addCase(fetchPropertiesByWeekend.pending, (state) => {
        state.weekendLoading = true;
        state.weekendError = null;
      })
      .addCase(fetchPropertiesByWeekend.fulfilled, (state, action) => {
        state.weekendLoading = false;
        state.weekendData = action.payload?.data || [];
      })
      .addCase(fetchPropertiesByWeekend.rejected, (state, action) => {
        state.weekendLoading = false;
        state.weekendError =
          action.payload || "Failed to load weekend properties";
      });
  },
});

export const {
  clearProperties,
  clearWeekendProperties,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
