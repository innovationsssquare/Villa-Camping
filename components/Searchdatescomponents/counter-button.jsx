"use client";

import { Minus, Plus } from "lucide-react";

export function CounterButton({
  value,
  onDecrement,
  onIncrement,
  min = 0,
  max,
}) {
  const isMin = typeof value === "number" && value <= min;
  const isMax = typeof value === "number" && max !== undefined && value >= max;

  return (
    <div className="flex items-center gap-3 select-none">
      <button
        type="button"
        onClick={onDecrement}
        disabled={isMin}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer ${
          isMin
            ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50/50"
            : "border-neutral-300 text-neutral-700 bg-white hover:border-neutral-400 active:scale-90 shadow-2xs hover:bg-neutral-50"
        }`}
      >
        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      <span className="w-6 text-center font-bold text-base text-neutral-900 tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={isMax}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer ${
          isMax
            ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50/50"
            : "border-neutral-300 text-neutral-700 bg-white hover:border-neutral-400 active:scale-90 shadow-2xs hover:bg-neutral-50"
        }`}
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
}
