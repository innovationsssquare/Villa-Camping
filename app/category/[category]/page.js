import ProductListing from "@/components/Productcomponets/Product-listing";
import React from "react";
import Ourproduct from "@/public/Homeasset/Ourproduct.png";
import Ourproduct2 from "@/public/Homeasset/Ourproduct2.png";
import Aboutusheader from "@/components/Aboutuscomponets/Aboutusheader";
import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";
const page = () => {
  return (
    <div className="md:pt-40 ">
      {/* <ShopbyCategory/> */}
      <ProductListing />
    </div>
  );
};

export default page;
