"use client";

import { createContext, useContext } from "react";

const HotelContext = createContext(null);

export const HotelProvider = ({ hotel, children }) => {
  if (!hotel) {
    throw new Error("hotelProvider requires a valid hotel object");
  }

  return (
    <HotelContext.Provider value={hotel}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used inside hotelProvider");
  }
  return context;
};
