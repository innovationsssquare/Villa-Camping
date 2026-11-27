import Cottageview from "@/components/Cottagescreen/Cottageview";
import CottageDetails from "@/components/Propertyviewcomponents/cottage-details";
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
    const res = await fetch(`${BaseUrl}/Cottage/get/cottage/${id}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    return buildPropertyRouteMetadata({
      property: result?.data,
      id,
      routePrefix: "view-Cottage",
      categoryLabel: "Cottage",
      fallbackDescription:
        "Book cozy cottages, chalets, and farm stays in Lonavala and Pawna Lake on ThevillaCamp.",
      includeLanguages: true,
    });
  } catch (err) {
    return buildPropertyRouteMetadata({
      property: { _id: id, name: `Cottage ${id}`, isapproved: "approved", isLive: true },
      id,
      routePrefix: "view-Cottage",
      categoryLabel: "Cottage",
      includeLanguages: true,
    });
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let cottage = null;
  try {
    const res = await fetch(`${BaseUrl}/Cottage/get/cottage/${id}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const result = await res.json();
      cottage = result?.data;
    }
  } catch (e) {}

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!cottage || cottage.isapproved !== "approved" || cottage.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <JsonLd villa={cottage} category="Cottage" />
      <TrackPropertyVisit property={cottage} category="Cottage" />
      <Cottageview />
      <CottageDetails />
      <PropertySeoSummary property={cottage} categoryLabel="Cottage" />
    </div>
  );
}
