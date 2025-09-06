"use client";
import PropertyDetails from "@/components/Propertyviewcomponents/property-details";
import Villascreen from "@/components/Propertyviewcomponents/Villascreen";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Villascreen />
      <PropertyDetails />
    </div>
  );
}
