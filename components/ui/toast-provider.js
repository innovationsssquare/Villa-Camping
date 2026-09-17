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
  const defaultClassNames = {
    title: "text-xs sm:text-sm font-bold tracking-tight leading-snug",
    description: "text-[11px] sm:text-xs leading-normal mt-0.5",
    icon: "w-4 h-4 sm:w-5 sm:h-5 shrink-0",
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
