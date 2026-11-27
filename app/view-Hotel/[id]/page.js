import Viewhotel from "@/components/Hotelscreen/Viewhotel";
import HotelDetails from "@/components/Propertyviewcomponents/hotel-details";
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
    const res = await fetch(`${BaseUrl}/Hotel/get/hotel/${id}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    return buildPropertyRouteMetadata({
      property: result?.data,
      id,
      routePrefix: "view-Hotel",
      categoryLabel: "Hotel",
      fallbackDescription:
        "Book boutique hotels, suites, and pool resorts in Lonavala and Khandala on ThevillaCamp.",
      includeLanguages: true,
    });
  } catch (err) {
    return buildPropertyRouteMetadata({
      property: { _id: id, name: `Hotel ${id}`, isapproved: "approved", isLive: true },
      id,
      routePrefix: "view-Hotel",
      categoryLabel: "Hotel",
      includeLanguages: true,
    });
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let hotel = null;
  try {
    const res = await fetch(`${BaseUrl}/Hotel/get/hotel/${id}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const result = await res.json();
      hotel = result?.data;
    }
  } catch (e) {}

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!hotel || hotel.isapproved !== "approved" || hotel.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <JsonLd villa={hotel} category="Hotel" />
      <TrackPropertyVisit property={hotel} category="Hotel" />
      <Viewhotel />
      <HotelDetails />
      <PropertySeoSummary property={hotel} categoryLabel="Hotel" />
    </div>
  );
}
