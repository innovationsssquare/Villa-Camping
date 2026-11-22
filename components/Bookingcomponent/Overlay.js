"use client";
import React from "react";
import VillaCampLoader from "../Loadercomponents/VillaCampLoader";

const Overlay = ({ isLoading, message = "Please wait, do not close this window..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white px-8 py-7 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-100 max-w-sm w-full text-center">
        <VillaCampLoader size={88} />
        <p className="mt-4 text-sm font-semibold text-gray-800">
          {message}
        </p>
        <p className="mt-1 text-xs text-gray-400">Processing your request securely</p>
      </div>
    </div>
  );
};

export default Overlay;
