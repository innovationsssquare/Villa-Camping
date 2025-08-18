"use client";
import PropertyDetails from "@/components/Propertyviewcomponents/property-details";
import PropertyDetailsPage from "@/components/Propertyviewcomponents/property-details-page";
import VillaListing from "@/components/Propertyviewcomponents/Villascreen";

export default function Home() {
  return (
    <div
      className="min-h-screen"
    > 
      <VillaListing /> 
      <PropertyDetails />
    </div>
  );
}
