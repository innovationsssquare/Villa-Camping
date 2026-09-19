import CampingDetails from "@/components/Propertyviewcomponents/camping-details";
import Tentview from "@/components/Tentscreen/Tentview";
import JsonLd from "@/components/Propertyviewcomponents/JsonLd";
import TrackPropertyVisit from "@/components/Propertyviewcomponents/TrackPropertyVisit";
import { BaseUrl } from "@/lib/API/Baseurl";
import { notFound } from "next/navigation";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    const camping = result?.data;
    if (!camping || camping.isapproved !== "approved" || camping.isLive === false) {
      return {
        title: "Camping Not Available | ThevillaCamp",
        description: "Find and book verified stays on ThevillaCamp.",
      };
    }
    const title = camping?.name || `Camping ${id}`;
    const description = camping?.shortDescription || camping?.description || "Book beautiful stays on ThevillaCamp.";
    const ogImage = (camping?.images && camping.images[0]) || "/og-default.jpg";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/view-Camping/${id}`,
        images: [ogImage],
      },
      alternates: { canonical: `${SITE_ORIGIN}/view-Camping/${id}`, languages: { 'en-US': `${SITE_ORIGIN}/view-Camping/${id}` } },
    };
  } catch (err) {
    return {
      title: `Camping ${id} | ThevillaCamp`,
      description: "Find and book camping sites, cottages, hotels and villas on ThevillaCamp.",
      openGraph: { title: `Camping ${id}`, description: "ThevillaCamp listing.", url: `${SITE_ORIGIN}/view-Camping/${id}` },
    };
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let camping = null;
  try {
    const res = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, { next: { revalidate: 120 } });
    if (res.ok) {
      const result = await res.json();
      camping = result?.data;
    }
  } catch (e) { }

  // Do not publish or display unapproved or inactive stays on villa-web
  if (!camping || camping.isapproved !== "approved" || camping.isLive === false) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {camping ? <JsonLd villa={camping} /> : null}
      {camping ? <TrackPropertyVisit property={camping} category="Camping" /> : null}
      <Tentview />
      <CampingDetails />
    </div>
  );
}
