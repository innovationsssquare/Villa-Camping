import ProductListing from "@/components/Productcomponets/Product-listing";
import React from "react";

const page = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <div className="pt-20 md:pt-36 bg-neutral-50/60 min-h-screen">
      <ProductListing categorySlug={resolvedParams.category} />
    </div>
  );
};

export default page;
