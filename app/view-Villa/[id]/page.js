import PropertyDetails from "@/components/Propertyviewcomponents/property-details";
import Villascreen from "@/components/Propertyviewcomponents/Villascreen";
import Villaview from "@/components/Villascreen/Villaview";
import JsonLd from "@/components/Propertyviewcomponents/JsonLd";
import PropertySeoSummary from "@/components/Propertyviewcomponents/PropertySeoSummary";
import TrackPropertyVisit from "@/components/Propertyviewcomponents/TrackPropertyVisit";
import { BaseUrl } from "@/lib/API/Baseurl";
import { buildPropertyRouteMetadata } from "@/lib/lonavalaSeo";
import { notFound } from "next/navigation";

// Incremental Static Regeneration: revalidate background cache once every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BaseUrl}/Villa/get/villa/${id}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    return buildPropertyRouteMetadata({
      property: result?.data,
      id,
      routePrefix: "view-Villa",
      categoryLabel: "Villa",
      fallbackDescription:
        "Book verified private pool villas and holiday homes in Lonavala on ThevillaCamp.",
    });
  } catch (err) {
    return buildPropertyRouteMetadata({
      property: { _id: id, name: `Villa ${id}`, isapproved: "approved", isLive: true },
      id,
      routePrefix: "view-Villa",
      categoryLabel: "Villa",
    });
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let villa = null;
  try {
    const res = await fetch(`${BaseUrl}/Villa/get/villa/${id}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const result = await res.json();
      villa = result?.data;
    }
  } catch (e) {}

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!villa || villa.isapproved !== "approved" || villa.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Structured data for SEO */}
      <JsonLd villa={villa} category="Villa" />
      <TrackPropertyVisit property={villa} category="Villa" />
      <Villaview />
      <PropertyDetails />
      <PropertySeoSummary property={villa} categoryLabel="Villa" />
    </div>
  );
}
