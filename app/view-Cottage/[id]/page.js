import Cottageview from "@/components/Cottagescreen/Cottageview";
import CottageDetails from "@/components/Propertyviewcomponents/cottage-details";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${SITE_ORIGIN}/api/cottages/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const cottage = await res.json();
    const title = cottage?.name || `Cottage ${id}`;
    const description = cottage?.shortDescription || cottage?.description || "Book beautiful stays on ThevillaCamp.";
    const ogImage = (cottage?.images && cottage.images[0]) || "/og-default.jpg";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/view-Cottage/${id}`,
        images: [ogImage],
      },
      alternates: { canonical: `${SITE_ORIGIN}/view-Cottage/${id}`, languages: { 'en-US': `${SITE_ORIGIN}/view-Cottage/${id}` } },
    };
  } catch (err) {
    return {
      title: `Cottage ${id} | ThevillaCamp`,
      description: "Find and book cottages, villas and hotels on ThevillaCamp.",
      openGraph: { title: `Cottage ${id}`, description: "ThevillaCamp listing.", url: `${SITE_ORIGIN}/view-Cottage/${id}` },
    };
  }
}

export default async function Home({ params }) {
  const { id } = await params;
  let cottage = null;
  try {
    const res = await fetch(`${SITE_ORIGIN}/api/cottages/${id}`, { cache: "no-store" });
    if (res.ok) cottage = await res.json();
  } catch (e) {}

  return (
    <div className="min-h-screen">
      {cottage ? (
        (function () {
          const JsonLd = require("@/components/Propertyviewcomponents/JsonLd").default;
          return JsonLd ? JsonLd({ villa: cottage }) : null;
        })()
      ) : null}
      <Cottageview />
      <CottageDetails />
    </div>
  );
}
