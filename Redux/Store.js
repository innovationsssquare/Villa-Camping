import { configureStore } from "@reduxjs/toolkit";
import propertyFilterReducer from "@/Redux/Slices/propertyFilterSlice"


export const store = configureStore({
  reducer: {
     propertyFilter: propertyFilterReducer,
  },
});
