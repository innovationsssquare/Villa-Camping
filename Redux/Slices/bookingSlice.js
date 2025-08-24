import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  selectedCategoryId: null,
  selectedCategoryName: "",
  checkin: null,
  checkout: null,
  selectedGuest: {
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
    setSelectedCategoryname: (state, action) => {
      state.selectedCategoryName = action.payload;
    },
    setCheckin: (state, action) => {
      state.checkin = action.payload;
    },
    setCheckout: (state, action) => {
      state.checkout = action.payload;
    },
    setSelectedGuest: (state, action) => {
      state.selectedGuest = { ...state.selectedGuest, ...action.payload };
    },
    updateGuestCount: (state, action) => {
      state.selectedGuest[action.payload.type] = action.payload.value;
    },
    resetBooking: (state) => {
      return initialState;
    },
  },
});

export const {
  setSelectedCategory,
  setCheckin,
  setCheckout,
  setSelectedGuest,
  updateGuestCount,
  resetBooking,
  setSelectedCategoryname
} = bookingSlice.actions;

export default bookingSlice.reducer;
