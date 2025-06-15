import ProductListing from "@/components/Productcomponets/Product-listing";
import React from "react";
import Ourproduct from "@/public/Homeasset/Ourproduct.png"
import Ourproduct2 from "@/public/Homeasset/Ourproduct2.png"
import Aboutusheader from "@/components/Aboutuscomponets/Aboutusheader";
const page = () => {
  return (
    <div>
      <Aboutusheader
        image1={Ourproduct}
        image2={Ourproduct2}
        title={"Our Products"}
      />

      <ProductListing />
    </div>
  );
};

export default page;
