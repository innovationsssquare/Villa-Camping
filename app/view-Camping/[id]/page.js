import CampingDetails from "@/components/Propertyviewcomponents/camping-details";
import Tentview from "@/components/Tentscreen/Tentview";
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
    const res = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    return buildPropertyRouteMetadata({
      property: result?.data,
      id,
      routePrefix: "view-Camping",
      categoryLabel: "Camping",
      fallbackDescription:
        "Book Pawna Lake camping and waterfront glamping tents with live BBQ & bonfire on ThevillaCamp.",
      includeLanguages: true,
    });
  } catch (err) {
    return buildPropertyRouteMetadata({
      property: { _id: id, name: `Camping ${id}`, isapproved: "approved", isLive: true },
      id,
      routePrefix: "view-Camping",
      categoryLabel: "Camping",
      includeLanguages: true,
    });
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let camping = null;
  try {
    const res = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const result = await res.json();
      camping = result?.data;
    }
  } catch (e) {}

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!camping || camping.isapproved !== "approved" || camping.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <JsonLd villa={camping} category="Camping" />
      <TrackPropertyVisit property={camping} category="Camping" />
      <Tentview />
      <CampingDetails />
      <PropertySeoSummary property={camping} categoryLabel="Camping" />
    </div>
  );
}
