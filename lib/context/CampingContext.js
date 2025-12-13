"use client";

import { createContext, useContext } from "react";

const CampingContext = createContext(null);

export const CampingProvider = ({ camping, children }) => {
  if (!camping) {
    throw new Error("CampingProvider requires a valid camping object");
  }

  return (
    <CampingContext.Provider value={camping}>
      {children}
    </CampingContext.Provider>
  );
};

export const useCamping = () => {
  const context = useContext(CampingContext);
  if (!context) {
    throw new Error("usecamping must be used inside CampingProvider");
  }
  return context;
};
