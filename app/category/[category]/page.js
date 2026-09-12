import ProductListing from "@/components/Productcomponets/Product-listing";
import React, { Suspense } from "react";

const page = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <div className="pt-20 md:pt-36 bg-neutral-50/60 min-h-screen">
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListing categorySlug={resolvedParams.category} />
      </Suspense>
    </div>
  );
};

export default page;

