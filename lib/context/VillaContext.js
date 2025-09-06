"use client";

import { createContext, useContext } from "react";

const VillaContext = createContext(null);

export const VillaProvider = ({ villa, children }) => {
  if (!villa) {
    throw new Error("VillaProvider requires a valid villa object");
  }

  return (
    <VillaContext.Provider value={villa}>
      {children}
    </VillaContext.Provider>
  );
};

export const useVilla = () => {
  const context = useContext(VillaContext);
  if (!context) {
    throw new Error("useVilla must be used inside VillaProvider");
  }
  return context;
};
