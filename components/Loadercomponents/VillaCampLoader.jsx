"use client";
import React from "react";

/**
 * VillaCampLoader - The official animated loading brand logo for The Villa Camp.
 * 
 * Features:
 * - Animated outer path drawing
 * - Dropping and bouncing location pin
 * - Animated accent center dot
 * - Optional subtle skeleton backdrop
 * - Accessible with prefers-reduced-motion
 * - Fully customizable size and brand colors
 */
export default function VillaCampLoader({
  size = 96,
  width,
  height,
  logoColor = "#111827",
  accentColor = "#ff6900",
  skeletonColor = "#E5E7EB",
  showSkeleton = true,
  className = "",
  style = {},
  ariaLabel = "Loading The Villa Camp",
}) {
  const finalWidth = width || size;
  const finalHeight = height || size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 512 512"
      role="status"
      aria-label={ariaLabel}
      className={`tvc-loader-svg ${className}`}
      style={{
        "--logo-color": logoColor,
        "--accent-color": accentColor,
        "--skeleton-color": skeletonColor,
        display: "block",
        overflow: "visible",
        ...style,
      }}
    >
      <style>{`
        .tvc-outer, .tvc-pin-path {
          fill: none;
          stroke: var(--logo-color, #111827);
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .tvc-outer {
          stroke-width: 31px;
          stroke-dasharray: 1370;
          stroke-dashoffset: 1370;
          animation: tvcOuterDraw 3s ease-in-out infinite;
        }
        .tvc-pin {
          opacity: 0;
          animation: tvcPinDrop 3s cubic-bezier(0.2, 0.7, 0.25, 1) infinite;
        }
        .tvc-pin-path {
          stroke-width: 29px;
          stroke-dasharray: 446.36;
          stroke-dashoffset: 446.36;
          animation: tvcPinDraw 3s ease-out infinite;
        }
        .tvc-dot {
          fill: var(--accent-color, #ff6900);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: tvcDotDrop 3s cubic-bezier(0.2, 0.7, 0.25, 1) infinite;
        }
        @keyframes tvcOuterDraw {
          0% { stroke-dashoffset: 1370; opacity: 0; }
          5% { stroke-dashoffset: 1370; opacity: 1; }
          48%, 74% { stroke-dashoffset: 0; opacity: 1; }
          88% { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: 1370; opacity: 0; }
        }
        @keyframes tvcPinDraw {
          0%, 34% { stroke-dashoffset: 446.36; opacity: 0; }
          40% { stroke-dashoffset: 446.36; opacity: 1; }
          49% { stroke-dashoffset: 0; opacity: 1; }
          80% { stroke-dashoffset: 0; opacity: 1; }
          90% { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: 446.36; opacity: 0; }
        }
        @keyframes tvcPinDrop {
          0%, 34% { transform: translateY(-68px); opacity: 0; }
          40% { transform: translateY(-68px); opacity: 1; }
          47% { transform: translateY(11px); opacity: 1; }
          52% { transform: translateY(-7px); opacity: 1; }
          57% { transform: translateY(3px); opacity: 1; }
          62%, 80% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(0); opacity: 0; }
          100% { transform: translateY(-68px); opacity: 0; }
        }
        @keyframes tvcDotDrop {
          0%, 49% { transform: translateY(-42px) scale(0.55); opacity: 0; }
          56% { transform: translateY(8px) scale(1.15); opacity: 1; }
          61% { transform: translateY(-4px) scale(0.92); opacity: 1; }
          66% { transform: translateY(2px) scale(1.04); opacity: 1; }
          71%, 82% { transform: translateY(0) scale(1); opacity: 1; }
          90% { transform: translateY(0) scale(1); opacity: 0; }
          100% { transform: translateY(-42px) scale(0.55); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tvc-outer, .tvc-pin, .tvc-pin-path, .tvc-dot { animation: none !important; }
          .tvc-outer, .tvc-pin-path { stroke-dashoffset: 0; opacity: 1; }
          .tvc-pin, .tvc-dot { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Background skeleton layer */}
      {showSkeleton && (
        <g
          className="tvc-skeleton"
          fill="none"
          stroke="var(--skeleton-color, #E5E7EB)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M256 58 C232 58 220 72 204 102 L77 347 C54 391 45 421 65 449 C89 481 126 480 166 454 C198 434 225 409 256 383 C287 409 314 434 346 454 C386 480 423 481 447 449 C467 421 458 391 435 347 L308 102 C292 72 280 58 256 58 Z"
            strokeWidth="31"
          />
          <path
            d="M256 211 C220 211 198 236 198 273 C198 315 228 354 256 383 C284 354 314 315 314 273 C314 236 292 211 256 211 Z"
            strokeWidth="29"
          />
          <circle cx="256" cy="273" r="18" fill="var(--skeleton-color, #E5E7EB)" stroke="none" />
        </g>
      )}

      {/* Animated outer stroke */}
      <path
        className="tvc-outer"
        d="M256 58 C232 58 220 72 204 102 L77 347 C54 391 45 421 65 449 C89 481 126 480 166 454 C198 434 225 409 256 383 C287 409 314 434 346 454 C386 480 423 481 447 449 C467 421 458 391 435 347 L308 102 C292 72 280 58 256 58 Z"
      />

      {/* Animated dropping location pin */}
      <g className="tvc-pin">
        <path
          className="tvc-pin-path"
          d="M256 211 C220 211 198 236 198 273 C198 315 228 354 256 383 C284 354 314 315 314 273 C314 236 292 211 256 211 Z"
        />
      </g>

      {/* Animated center accent dot */}
      <circle className="tvc-dot" cx="256" cy="273" r="18" />
    </svg>
  );
}

/**
 * VillaCampLoadingScreen - Clean white full-page or section container with animated brand loader
 */
export function VillaCampLoadingScreen({
  text = null,
  subtext = null,
  size = 120,
  fullScreen = true,
  className = "",
  logoColor = "#111827",
  accentColor = "#ff6900",
}) {
  const containerClass = fullScreen
    ? `fixed inset-0 z-50 flex flex-col items-center justify-center bg-white ${className}`
    : `flex flex-col items-center justify-center py-16 w-full bg-white ${className}`;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <VillaCampLoader size={size} logoColor={logoColor} accentColor={accentColor} />
      {text && (
        <p className="mt-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          {text}
        </p>
      )}
      {subtext && (
        <p className="mt-1 text-xs text-gray-400 font-normal">
          {subtext}
        </p>
      )}
    </div>
  );
}
