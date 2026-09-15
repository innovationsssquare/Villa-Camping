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
  if (typeof props === "string") {
    return heroAddToast({ title: props, color: "primary" });
  }

  const color = props.color || mapVariantToColor(props.variant);
  return heroAddToast({
    title: props.title,
    description: props.description,
    color,
    timeout: props.duration || 4000,
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
