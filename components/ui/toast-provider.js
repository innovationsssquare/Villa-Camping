"use client";

import * as React from "react";
import { addToast as heroAddToast } from "@heroui/react";

/**
 * Maps legacy shadcn toast variant names to HeroUI color tokens
 */
const mapVariantToColor = (variant) => {
  switch (variant) {
    case "destructive":
      return "danger";
    case "warning":
      return "warning";
    case "success":
      return "success";
    case "info":
      return "primary";
    default:
      return "default";
  }
};

/**
 * Unified addToast function delegating to HeroUI Toast (same as Login modal)
 */
export const addToast = (props = {}) => {
  const isDestructive =
    (typeof props === "object" && (props?.variant === "destructive" || props?.color === "danger"));

  const defaultClassNames = {
    base: isDestructive
      ? "bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 shadow-2xl border-2 border-rose-500/50 rounded-2xl opacity-100"
      : "bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 shadow-2xl border border-neutral-200 dark:border-neutral-800 rounded-2xl opacity-100",
    title: isDestructive
      ? "text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 tracking-tight leading-snug"
      : "text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug",
    description: "text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-300 leading-normal mt-0.5",
    icon: isDestructive
      ? "w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-rose-500"
      : "w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#ff6900]",
  };

  if (typeof props === "string") {
    return heroAddToast({
      title: props,
      color: "primary",
      classNames: defaultClassNames,
    });
  }

  const color = props.color || mapVariantToColor(props.variant);
  return heroAddToast({
    ...props,
    title: props.title,
    description: props.description,
    color,
    timeout: props.duration || props.timeout || 4000,
    classNames: {
      ...defaultClassNames,
      ...(props.classNames || {}),
    },
  });
};

/**
 * useToast hook compatible with existing components, delegating to HeroUI Toast
 */
export function useToast() {
  return {
    addToast,
    toast: addToast,
  };
}

/**
 * ToastProvider passthrough (HeroUI's provider is already mounted in Nextuiprovider)
 */
export function ToastProvider({ children }) {
  return <>{children}</>;
}

export default useToast;
