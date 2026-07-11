import CampingDetails from "@/components/Propertyviewcomponents/camping-details";
import Tentview from "@/components/Tentscreen/Tentview";
import JsonLd from "@/components/Propertyviewcomponents/JsonLd";
import { BaseUrl } from "@/lib/API/Baseurl";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    const camping = result?.data;
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
    const res = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      camping = result?.data;
    }
  } catch (e) {}

  return (
    <div className="min-h-screen">
      {camping ? <JsonLd villa={camping} /> : null}
      <Tentview/>
      <CampingDetails/>
    </div>
  );
}
