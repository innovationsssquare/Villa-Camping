import ProductListing from "@/components/Productcomponets/Product-listing";
import React, { Suspense } from "react";

// Incremental Static Regeneration: revalidate category pages once every 60 seconds
export const revalidate = 60;

const page = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <div className="pt-22 md:pt-36 bg-neutral-50/60 min-h-screen">
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListing categorySlug={resolvedParams.category} />
      </Suspense>
    </div>
  );
};

export default page;

