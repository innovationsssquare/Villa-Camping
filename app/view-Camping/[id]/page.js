"use client";
import CampingDetails from "@/components/Propertyviewcomponents/camping-details";
import Tentview from "@/components/Tentscreen/Tentview";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Tentview/>
      <CampingDetails/>
    </div>
  );
}
