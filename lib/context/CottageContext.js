"use client";

import { createContext, useContext } from "react";

const CottageContext = createContext(null);

export const CottageProvider = ({ cottage, children }) => {
  if (!cottage) {
    throw new Error("cottageProvider requires a valid cottage object");
  }

  return (
    <CottageContext.Provider value={cottage}>
      {children}
    </CottageContext.Provider>
  );
};

export const useCottage = () => {
  const context = useContext(CottageContext);
  if (!context) {
    throw new Error("useCottage must be used inside CottageProvider");
  }
  return context;
};
