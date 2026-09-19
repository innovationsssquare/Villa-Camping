import PropertyDetails from "@/components/Propertyviewcomponents/property-details";
import Villascreen from "@/components/Propertyviewcomponents/Villascreen";
import Villaview from "@/components/Villascreen/Villaview";
import JsonLd from "@/components/Propertyviewcomponents/JsonLd";
import TrackPropertyVisit from "@/components/Propertyviewcomponents/TrackPropertyVisit";
import { BaseUrl } from "@/lib/API/Baseurl";
import { notFound } from "next/navigation";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BaseUrl}/Villa/get/villa/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    const villa = result?.data;
    if (!villa || villa.isapproved !== "approved" || villa.isLive === false) {
      return {
        title: "Villa Not Available | ThevillaCamp",
        description: "Find and book verified stays on ThevillaCamp.",
      };
    }
    const title = villa?.name || `Villa ${id}`;
    const description = villa?.shortDescription || villa?.description || "Book beautiful stays on ThevillaCamp.";
    const ogImage = (villa?.images && villa.images[0]) || "/og-default.jpg";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/view-Villa/${id}`,
        images: [ogImage],
      },
      alternates: { canonical: `${SITE_ORIGIN}/view-Villa/${id}` },
    };
  } catch (err) {
    return {
      title: `Villa ${id} | ThevillaCamp`,
      description: "Find and book villas, cottages and hotels on ThevillaCamp.",
      openGraph: { title: `Villa ${id}`, description: "ThevillaCamp listing.", url: `${SITE_ORIGIN}/view-Villa/${id}` },
    };
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let villa = null;
  try {
    const res = await fetch(`${BaseUrl}/Villa/get/villa/${id}`, { next: { revalidate: 120 } });
    if (res.ok) {
      const result = await res.json();
      villa = result?.data;
    }
  } catch (e) { }

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!villa || villa.isapproved !== "approved" || villa.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Structured data for SEO */}
      {villa ? <JsonLd villa={villa} /> : null}
      {villa ? <TrackPropertyVisit property={villa} category="Villa" /> : null}
      <Villaview />
      <PropertyDetails />
    </div>
  );
}
