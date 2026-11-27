import { notFound } from "next/navigation";
import { LonavalaLandingView } from "@/components/Seo/LonavalaSeoSection";
import {
  LONAVALA_FILTER_PAGES,
  buildLonavalaMetadata,
  getLonavalaSeoConfig,
} from "@/lib/lonavalaSeo";

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.keys(LONAVALA_FILTER_PAGES).map((filter) => ({ filter }));
}

export async function generateMetadata({ params }) {
  const { filter } = await params;
  const config = getLonavalaSeoConfig(filter);
  if (!config || !config.slug) {
    return {
      title: "Villas in Lonavala | ThevillaCamp",
      description:
        "Discover verified villas in Lonavala with private pools and direct host pricing.",
    };
  }
  return buildLonavalaMetadata(config);
}

export default async function VillasInLonavalaFilterPage({ params }) {
  const { filter } = await params;
  const config = getLonavalaSeoConfig(filter);
  if (!config || !config.slug) {
    notFound();
  }

  return <LonavalaLandingView config={config} />;
}
