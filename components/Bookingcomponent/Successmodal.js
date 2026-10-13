"use client";

import React, { Suspense } from "react";
import BookingConfirmationScreen from "./BookingConfirmationScreen";

export default function Successmodal(props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#EA580C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <BookingConfirmationScreen {...props} />
    </Suspense>
  );
}
