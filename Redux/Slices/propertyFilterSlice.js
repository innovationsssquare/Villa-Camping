import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  // Filter states
  selectedPriceRanges: [],
  selectedCategories: [],
  selectedPropertyTypes: [],
  selectedRating: "",
  searchQuery: "",
  sortBy: "popular",
  showPopular: false,
  showSeasonal: false,

  // Pagination states
  currentPage: 1,
  itemsPerPage: 6,
  totalCount: 0,
  totalPages: 0,

  // Data states
  filteredProperties: [],
  loading: false,

  // UI states
  showMobileFilters: false,
}

const propertyFilterSlice = createSlice({
  name: "propertyFilter",
  initialState,
  reducers: {
    setPriceRanges: (state, action) => {
      state.selectedPriceRanges = action.payload
    },
    addPriceRange: (state, action) => {
      if (!state.selectedPriceRanges.includes(action.payload)) {
        state.selectedPriceRanges.push(action.payload)
      }
    },
    removePriceRange: (state, action) => {
      state.selectedPriceRanges = state.selectedPriceRanges.filter((range) => range !== action.payload)
    },

    setCategories: (state, action) => {
      state.selectedCategories = action.payload
    },
    addCategory: (state, action) => {
      if (!state.selectedCategories.includes(action.payload)) {
        state.selectedCategories.push(action.payload)
      }
    },
    removeCategory: (state, action) => {
      state.selectedCategories = state.selectedCategories.filter((category) => category !== action.payload)
    },

    setPropertyTypes: (state, action) => {
      state.selectedPropertyTypes = action.payload
    },
    addPropertyType: (state, action) => {
      if (!state.selectedPropertyTypes.includes(action.payload)) {
        state.selectedPropertyTypes.push(action.payload)
      }
    },
    removePropertyType: (state, action) => {
      state.selectedPropertyTypes = state.selectedPropertyTypes.filter((type) => type !== action.payload)
    },

    setRating: (state, action) => {
      state.selectedRating = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setShowPopular: (state, action) => {
      state.showPopular = action.payload
    },
    setShowSeasonal: (state, action) => {
      state.showSeasonal = action.payload
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload
    },

    setFilteredProperties: (state, action) => {
      state.filteredProperties = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setShowMobileFilters: (state, action) => {
      state.showMobileFilters = action.payload
    },

    clearAllFilters: (state) => {
      state.selectedPriceRanges = []
      state.selectedCategories = []
      state.selectedPropertyTypes = []
      state.selectedRating = ""
      state.searchQuery = ""
      state.showPopular = false
      state.showSeasonal = false
      state.currentPage = 1
    },

    resetState: (state) => {
      return initialState
    },
  },
})

export const {
  setPriceRanges,
  addPriceRange,
  removePriceRange,
  setCategories,
  addCategory,
  removeCategory,
  setPropertyTypes,
  addPropertyType,
  removePropertyType,
  setRating,
  setSearchQuery,
  setSortBy,
  setShowPopular,
  setShowSeasonal,
  setCurrentPage,
  setTotalCount,
  setTotalPages,
  setFilteredProperties,
  setLoading,
  setShowMobileFilters,
  clearAllFilters,
  resetState,
} = propertyFilterSlice.actions

export default propertyFilterSlice.reducer
