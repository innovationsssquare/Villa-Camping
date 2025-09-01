"use client";
import React from "react";
import ButtonLoader from "../Loadercomponents/button-loader";

const Overlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
        <div className="bg-black rounded-full flex justify-center items-center">
          <ButtonLoader />
        </div>
        <p className="mt-4 text-xs font-semibold text-gray-700">
          Please wait Do not close this Window ....
        </p>
      </div>
    </div>
  );
};

export default Overlay;
