import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment-timezone";

const timezone = "Asia/Kolkata";
const today = moment().tz(timezone).startOf("day");
const tomorrow = today.clone().add(1, "day");

const initialState = {
  selectedCategoryId: null,
  selectedCategoryName: "",
  selectedCategoryImage: null,

  selectedSubtype: { type: "", quantity: 1 },
  checkin: today.format(),
  checkout: tomorrow.format(),
  selectedGuest: {
    adults: 1,
    childrenn: 0,
    infants: 0,
    pets: 0,
  },
  propertyId: null,
  ownerId: null,
  propertyType: "",
  categoryId: null,

  customerDetails: {
    bookingFor: "myself",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    city: "",
  },
  selectedTents: {},
  appliedCoupon: null,
  specialRequests: "",
  acceptedTerms: false,
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
    setSelectedCategoryImage: (state, action) => {
      state.selectedCategoryImage = action.payload;
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

    setPropertyId: (state, action) => {
      state.propertyId = action.payload;
    },
    setcategoryId: (state, action) => {
      state.categoryId = action.payload;
    },
    setOwnerId: (state, action) => {
      state.ownerId = action.payload;
    },
    setPropertyType: (state, action) => {
      state.propertyType = action.payload;
    },

    setCustomerDetails: (state, action) => {
      state.customerDetails = { ...state.customerDetails, ...action.payload };
    },
    updateCustomerField: (state, action) => {
      const { field, value } = action.payload;
      state.customerDetails[field] = value;
    },

    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
    setSpecialRequests: (state, action) => {
      state.specialRequests = action.payload;
    },
    setAcceptedTerms: (state, action) => {
      state.acceptedTerms = action.payload;
    },
    setSelectedTents: (state, action) => {
      state.selectedTents = action.payload;
    },

    updateTentQuantity: (state, action) => {
      const { tentType, tentData } = action.payload;
      state.selectedTents[tentType] = tentData;
    },

    removeTent: (state, action) => {
      delete state.selectedTents[action.payload];
    },

    clearSelectedTents: (state) => {
      state.selectedTents = {};
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
  setPropertyId,
  setcategoryId,
  setOwnerId,
  setPropertyType,
  setCustomerDetails,
  updateCustomerField,
  setAppliedCoupon,
  removeCoupon,
  setSpecialRequests,
  setAcceptedTerms,
  setSelectedCategoryImage,

  setSelectedTents,
  updateTentQuantity,
  removeTent,
  clearSelectedTents,
} = bookingSlice.actions;

export default bookingSlice.reducer;
