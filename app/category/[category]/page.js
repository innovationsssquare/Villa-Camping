import ProductListing from "@/components/Productcomponets/Product-listing";
import React from "react";

const page = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <div className="md:pt-40 ">
      {/* <ShopbyCategory/> */}
      <ProductListing categorySlug={resolvedParams.category} />
    </div>
  );
};

export default page;
