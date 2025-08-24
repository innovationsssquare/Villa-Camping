import { configureStore } from "@reduxjs/toolkit";
import propertyFilterReducer from "@/Redux/Slices/propertyFilterSlice";
import propertiesSlice from "@/Redux/Slices/propertiesSlice";
import categorySlice from "@/Redux/Slices/categorySlice";
import bookingSlice from "@/Redux/Slices/bookingSlice";

export const store = configureStore({
  reducer: {
    propertyFilter: propertyFilterReducer,
    properties: propertiesSlice,
    category: categorySlice,
    booking: bookingSlice,
  },
});
