import Aboutusheader from "@/components/Aboutuscomponets/Aboutusheader";
import React from "react";
import Mybag from "@/public/Homeasset/Mybag.png";
import Mybag2 from "@/public/Homeasset/Mybag2.png";
import Newsletter from "@/components/Homecomponets/Newsletter";
import CheckoutPage from "@/components/Cartcomponets/Cart";

const page = () => {
  return (
    <div>
      <Aboutusheader image1={Mybag} image2={Mybag2} title={"My Bag"} />
      <CheckoutPage/>
      <Newsletter/>
    </div>
  );
};

export default page;
