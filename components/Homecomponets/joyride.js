"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Joyride1 from "@/public/Homeasset/Joyride1.png";
import Joyride2 from "@/public/Homeasset/Joyride2.png";
import Joyride3 from "@/public/Homeasset/Joyride3.png";

export default function Joyride() {
  const [showJoyride, setShowJoyride] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "High-quality stitching essentials!",
      description:
        "From sewing machines to accessories, we've got everything you need.",
      imageUrl: Joyride1,
      buttonText: "Next",
      showBackButton: false,
    },
    {
      title: "Easy ordering for your businesses.",
      description:
        "Browse, add to cart, and get supplies delivered to your doorstep.",
      imageUrl: Joyride2,
      buttonText: "Next",
      showBackButton: true,
    },
    {
      title: "Enjoy bulk discounts just for you!",
      description: "Sign up now for exclusive deals on stitching essentials.",
      imageUrl: Joyride3,
      buttonText: "Get Started",
      showBackButton: true,
    },
  ];

  useEffect(() => {
    const hasSeenJoyride = localStorage.getItem("hasSeenJoyride");

    if (!hasSeenJoyride) {
      setShowJoyride(true);
    }
  }, []);

  // Handle the next button click
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step, close the joyride and set the flag in localStorage
      handleClose();
    }
  };

  // Handle the back button click
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle closing the joyride
  const handleClose = () => {
    setShowJoyride(false);
    localStorage.setItem("hasSeenJoyride", "true");
  };

  // If the joyride should not be shown, return null
  if (!showJoyride) {
    return null;
  }

  // Get the current step
  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl h-full md:h-auto rounded-lg categorygradient2 p-8 shadow-lg md:p-8">
        {/* Close/Skip button - X on desktop, "Skip" text on mobile */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#106C83] hover:bg-gray-100 md:text-gray-500"
        >
          <span className="hidden md:inline">
            <X className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium md:hidden">Skip</span>
        </button>

        {/* Desktop layout */}
        <div className="hidden md:block">
          {/* Progress indicators */}
          <div className="mb-6 flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full ${
                  index === currentStep ? "bg-[#106C83]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-800">
                {step.title}
              </h2>
              <p className="mb-8 text-gray-600">{step.description}</p>

              <div className="flex items-center space-x-2">
                {step.showBackButton && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="w-12 rounded-md border bg-white ring-1 ring-gray-300 border-gray-300 px-3 py-2"
                  >
                    <ChevronLeft />
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-md bg-[#106C83] px-4 py-2 text-white hover:bg-[#106C83]"
                >
                  {step.buttonText}
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center">
              <Image
                src={step.imageUrl}
                alt={step.title}
                width={400}
                height={300}
                className="h-60 w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex h-full flex-col justify-between  md:hidden overflow-hidden z-50">
          <div className="mt-auto flex flex-col items-center justify-center">
            {/* Title and description - centered on mobile */}
            <div className="flex items-center justify-center">
              <Image
                src={step.imageUrl}
                alt={step.title}
                width={400}
                height={300}
                className="h-60 w-full object-contain"
              />
            </div>
            <div className="mb-8 text-center mt-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {step.title}
              </h2>
              <p className="text-gray-600">{step.description}</p>
            </div>

            {/* Progress indicators - below description on mobile */}
            <div className="mb-4 flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? "bg-[#106C83]" : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation buttons - at bottom on mobile */}
          <div className="mt-auto">
            <div className="flex items-center space-x-2">
              {step.showBackButton && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-12 rounded-md border bg-white ring-1 ring-gray-300 border-gray-300 px-3 py-2"
                >
                  <ChevronLeft />
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 rounded-md bg-[#106C83] px-4 py-2 text-white hover:bg-[#106C83]"
              >
                {step.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
