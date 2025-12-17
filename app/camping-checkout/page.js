import PropertyBooking from "@/components/Bookingcomponent/Bookingpreview";
import CampingBookingPreviewScreen from "@/components/Bookingcomponent/camping-booking-screen";
import React from "react";

const page = () => {
  return (
    <>
      <CampingBookingPreviewScreen />
      <PropertyBooking />
    </>
  );
};

export default page;
