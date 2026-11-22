"use client";

import { useEffect } from "react";
import VillaCampLoader from "@/components/Loadercomponents/VillaCampLoader";

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Complete splash screen after animation cycle
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2800);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white select-none cursor-pointer"
      onClick={() => onComplete?.()}
    >
      <VillaCampLoader
        size={140}
        logoColor="#111827"
        accentColor="#ff6900"
        skeletonColor="#E5E7EB"
      />
    </div>
  );
};

export default SplashScreen;
