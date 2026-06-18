"use client";
import Cottageview from "@/components/Cottagescreen/Cottageview";
import CottageDetails from "@/components/Propertyviewcomponents/cottage-details";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Cottageview/>
      <CottageDetails />
    </div>
  );
}
