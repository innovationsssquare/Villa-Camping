"use client";

import { useEffect } from "react";
import logo from "@/public/Productasset/Logoicon.png";
import Image from "next/image";

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Complete splash screen after animation
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-[#FAF9F6] text-[#1c1917] antialiased select-none overflow-hidden cursor-pointer"
      onClick={() => onComplete?.()}
    >
      <div className="flex flex-col w-full h-full relative overflow-hidden bg-gradient-to-b from-[#fdfcfb] via-[#FAF9F6] to-[#f5f2ea]">
        {/* Ambient Light Porcelain & Soft Warm Radial Sunrise Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#fed7aa]/35 via-[#ffedd5]/25 to-transparent blur-3xl animate-[ambientPulse_6s_ease-in-out_infinite]" />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-orange-100/30 blur-[80px]" />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-50/50 blur-[90px]" />
        </div>

        {/* Main Animated Brand Container */}
        <div className="relative z-20 flex flex-col justify-center items-center w-full h-full px-6 max-w-md mx-auto gap-8">
          {/* Logo Entrance & Subtle Float */}
          <div className="flex flex-col items-center justify-center w-full text-center">
            <div className="relative flex items-center justify-center">
              <div className="flex items-center justify-center animate-[logoEntrance_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                <Image
                  src={logo}
                  alt="The Villa Camp Logo"
                  width={96}
                  height={96}
                  priority
                  className="w-24 h-24 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-[subtleFloat_5s_ease-in-out_infinite]"
                />
              </div>
            </div>
          </div>

          {/* Shimmer Track & Status Text */}
          <div className="w-full max-w-[200px] flex flex-col items-center gap-2.5 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.9s_forwards]">
            <div className="w-full h-[2px] bg-stone-200/80 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 rounded-full w-2/5 animate-[shimmerTrack_2.2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] tracking-wider text-[#a8a29e] font-medium font-sans">
                Preparing your stay...
              </span>
            </div>
          </div>
        </div>

        {/* Keyframe Animations */}
        <style jsx>{`
          @keyframes logoEntrance {
            0% {
              opacity: 0;
              transform: scale(0.85) translateY(12px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes subtleFloat {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3.5px);
            }
          }
          @keyframes ambientPulse {
            0%,
            100% {
              opacity: 0.25;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.45;
              transform: translate(-50%, -50%) scale(1.06);
            }
          }
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(14px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shimmerTrack {
            0% {
              left: -40%;
              width: 30%;
            }
            50% {
              left: 35%;
              width: 50%;
            }
            100% {
              left: 105%;
              width: 30%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SplashScreen;
