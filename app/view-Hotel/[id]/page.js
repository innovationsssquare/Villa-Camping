import Viewhotel from "@/components/Hotelscreen/Viewhotel";
import HotelDetails from "@/components/Propertyviewcomponents/hotel-details";
import JsonLd from "@/components/Propertyviewcomponents/JsonLd";
import TrackPropertyVisit from "@/components/Propertyviewcomponents/TrackPropertyVisit";
import { BaseUrl } from "@/lib/API/Baseurl";
import { notFound } from "next/navigation";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BaseUrl}/Hotel/get/hotel/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    const hotel = result?.data;
    if (!hotel || hotel.isapproved !== "approved" || hotel.isLive === false) {
      return {
        title: "Hotel Not Available | ThevillaCamp",
        description: "Find and book verified stays on ThevillaCamp.",
      };
    }
    const title = hotel?.name || `Hotel ${id}`;
    const description = hotel?.shortDescription || hotel?.description || "Book beautiful stays on ThevillaCamp.";
    const ogImage = (hotel?.images && hotel.images[0]) || "/og-default.jpg";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/view-Hotel/${id}`,
        images: [ogImage],
      },
      alternates: { canonical: `${SITE_ORIGIN}/view-Hotel/${id}`, languages: { 'en-US': `${SITE_ORIGIN}/view-Hotel/${id}` } },
    };
  } catch (err) {
    return {
      title: `Hotel ${id} | ThevillaCamp`,
      description: "Find and book hotels, cottages and villas on ThevillaCamp.",
      openGraph: { title: `Hotel ${id}`, description: "ThevillaCamp listing.", url: `${SITE_ORIGIN}/view-Hotel/${id}` },
    };
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let hotel = null;
  try {
    const res = await fetch(`${BaseUrl}/Hotel/get/hotel/${id}`, { next: { revalidate: 120 } });
    if (res.ok) {
      const result = await res.json();
      hotel = result?.data;
    }
  } catch (e) { }

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!hotel || hotel.isapproved !== "approved" || hotel.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {hotel ? <JsonLd villa={hotel} /> : null}
      {hotel ? <TrackPropertyVisit property={hotel} category="Hotel" /> : null}
      <Viewhotel />
      <HotelDetails />
    </div>
  );
}


