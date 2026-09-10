"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export function GuestSelector({
  adults = 1,
  childrenn = 0,
  infants = 0,
  pets = 0,
  onGuestChange,
  onClose,
  isMobile = false,
}) {
  const GuestRow = ({ title, description, count, type, min = 0, max = 16 }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <div className="text-sm font-semibold text-neutral-900">{title}</div>
        <div className="text-xs text-neutral-500 mt-0.5">{description}</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onGuestChange(type, Math.max(min, count - 1))}
          disabled={count <= min}
          className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-25 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          aria-label={`Decrease ${title}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-6 text-center text-sm font-bold text-neutral-900 select-none">
          {count}
        </span>

        <button
          type="button"
          onClick={() => onGuestChange(type, Math.min(max, count + 1))}
          disabled={count >= max}
          className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-25 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          aria-label={`Increase ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative z-50 bg-white rounded-3xl border border-neutral-200/90 shadow-[0_16px_48px_rgba(0,0,0,0.14)] ${
        isMobile ? "w-80 p-5" : "w-96 p-6"
      }`}
    >
      <div className="divide-y divide-neutral-150">
        <GuestRow
          title="Adults"
          description="Ages 13 or above"
          count={adults}
          type="adults"
          min={1}
        />
        <GuestRow
          title="Children"
          description="Ages 2–12"
          count={childrenn}
          type="childrenn"
          min={0}
        />
        <GuestRow
          title="Infants"
          description="Under 2"
          count={infants}
          type="infants"
          min={0}
          max={5}
        />
        <GuestRow
          title="Pets"
          description="Bringing a companion animal?"
          count={pets}
          type="pets"
          min={0}
          max={5}
        />
      </div>

      {onClose && (
        <div className="pt-3 mt-2 border-t border-neutral-150 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      )}
    </motion.div>
  );
}
