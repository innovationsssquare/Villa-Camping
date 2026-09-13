"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import ResponsiveAuthModal from "@/components/Logincomponents/responsive-auth-modal";

const AuthModalContext = createContext({
  isOpen: false,
  returnUrl: "",
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

function AuthModalSync({ onTriggerAuth }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "required" || authParam === "true") {
      const targetReturnUrl = searchParams.get("returnUrl") || pathname;
      onTriggerAuth(targetReturnUrl);
    }
  }, [searchParams, pathname, onTriggerAuth]);

  return null;
}

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState("");

  const openAuthModal = (options = {}) => {
    if (options?.returnUrl) {
      setReturnUrl(options.returnUrl);
    }
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    // If URL contains auth=..., clean it up quietly from browser history
    if (typeof window !== "undefined" && window.location.search.includes("auth=")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("returnUrl");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  };

  const handleTriggerFromUrl = React.useCallback((targetReturnUrl) => {
    setReturnUrl(targetReturnUrl);
    setIsOpen(true);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        returnUrl,
        openAuthModal,
        closeAuthModal,
      }}
    >
      <Suspense fallback={null}>
        <AuthModalSync onTriggerAuth={handleTriggerFromUrl} />
      </Suspense>
      {children}
      <ResponsiveAuthModal
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeAuthModal();
          } else {
            setIsOpen(true);
          }
        }}
        returnUrl={returnUrl}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
