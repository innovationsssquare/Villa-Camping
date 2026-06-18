"use client";
import Viewhotel from "@/components/Hotelscreen/Viewhotel";
import HotelDetails from "@/components/Propertyviewcomponents/hotel-details";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Viewhotel/>
       <HotelDetails />
    </div>
  );
}
