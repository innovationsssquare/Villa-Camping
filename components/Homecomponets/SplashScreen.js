"use client";

import { useEffect } from "react";
import VillaCampLoader from "@/components/Loadercomponents/VillaCampLoader";

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Complete splash screen after animation cycle (loop is 3.024s)
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 3100);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white select-none cursor-pointer"
      onClick={() => onComplete?.()}
    >
      <VillaCampLoader size={150} />
    </div>
  );
};

export default SplashScreen;
