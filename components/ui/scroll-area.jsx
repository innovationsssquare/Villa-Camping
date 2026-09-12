"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef(function ScrollArea(
  {
    className,
    children,
    orientation = "vertical",
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="scroll-area"
      className={cn(
        "custom-scrollbar overscroll-contain",
        orientation === "horizontal"
          ? "overflow-x-auto overflow-y-hidden"
          : "overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";

function ScrollBar({ className, orientation = "vertical", ...props }) {
  return null;
}

export { ScrollArea, ScrollBar }

