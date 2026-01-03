// src/redux/slices/propertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllproperties,
  Getpropertybyid,
  Getropertiesbyweekend,
  Getropertiesbymap,
  Getpropertylocation,
  GetDestinations,
} from "@/lib/API/properties/Property";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

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
        return rejectWithValue(response.message || "Failed to fetch property");
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
export const fetchPropertiesBymap = createAsyncThunk(
  "properties/fetchBymap",
  async ({ locationId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await Getropertiesbymap({
        locationId,
        categoryId,
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

export const fetchPropertylocation = createAsyncThunk(
  "properties/fetchBylocation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Getpropertylocation();

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

export const fetchdestination = createAsyncThunk(
  "properties/fetchdestination",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetDestinations();

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

export const fetchTrendingReels = createAsyncThunk(
  "reels/fetchTrendingReels",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const res = await fetch(`${BaseUrl}/User/reels/trending`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reels");

      const data = await res.json();
      return data.data;
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

    mapLoading: false,
    mapData: [],
    mapError: null,

    locationLoading: false,
    locationData: [],
    locationError: null,

    destinationLoading: false,
    destinationData: [],
    destinationError: null,

    // Shared error
    error: null,

    selectedLocationId: null,

    reelsvideo: [],
    reelloading: false,
    reelerror: null,
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
    setselectedLocationId: (state, action) => {
      state.selectedLocationId = action.payload;
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
      })

      .addCase(fetchPropertiesBymap.pending, (state) => {
        state.mapLoading = true;
        state.mapError = null;
      })
      .addCase(fetchPropertiesBymap.fulfilled, (state, action) => {
        state.mapLoading = false;
        state.mapData = action.payload?.data || [];
      })
      .addCase(fetchPropertiesBymap.rejected, (state, action) => {
        state.mapLoading = false;
        state.mapError = action.payload || "Failed to load weekend properties";
      })

      .addCase(fetchPropertylocation.pending, (state) => {
        state.locationLoading = true;
        state.locationError = null;
      })
      .addCase(fetchPropertylocation.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.locationData = action.payload?.data || [];
      })

      .addCase(fetchPropertylocation.rejected, (state, action) => {
        state.locationLoading = false;
        state.locationError =
          action.payload || "Failed to load weekend properties";
      })

      .addCase(fetchdestination.pending, (state) => {
        state.destinationLoading = true;
        state.destinationError = null;
      })
      .addCase(fetchdestination.fulfilled, (state, action) => {
        state.destinationLoading = false;
        state.destinationData = action.payload?.data || [];
      })
      .addCase(fetchdestination.rejected, (state, action) => {
        state.destinationLoading = false;
        state.destinationError =
          action.payload || "Failed to load weekend properties";
      })

      .addCase(fetchTrendingReels.pending, (state) => {
        state.reelloading = true;
        state.reelerror = null;
      })
      .addCase(fetchTrendingReels.fulfilled, (state, action) => {
        state.reelloading = false;
        state.reelsvideo = action.payload;
      })
      .addCase(fetchTrendingReels.rejected, (state, action) => {
        state.reelloading = false;
        state.reelerror = action.payload;
      });
  },
});

export const {
  clearProperties,
  clearWeekendProperties,
  setselectedLocationId,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
