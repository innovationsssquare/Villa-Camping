import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment-timezone";

const timezone = "Asia/Kolkata";
const today = moment().tz(timezone).startOf("day");
const tomorrow = today.clone().add(1, "day");

const initialState = {
  selectedCategoryId: null,
  selectedCategoryName: "",
  selectedSubtype: { type: "", quantity: 1 },
  checkin: today.format(),
  checkout: tomorrow.format(),
  selectedGuest: {
    adults: 1,
    childrenn: 0,
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

    setSelectedSubtype: (state, action) => {
      state.selectedSubtype = action.payload; // expects { type, quantity }
    },
    updateSubtypeQuantity: (state, action) => {
      state.selectedSubtype.quantity = action.payload;
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
  setSelectedCategoryname,
  setSelectedSubtype,
  updateSubtypeQuantity,
} = bookingSlice.actions;

export default bookingSlice.reducer;
