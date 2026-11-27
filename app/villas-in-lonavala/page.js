import { LonavalaLandingView } from "@/components/Seo/LonavalaSeoSection";
import {
  LONAVALA_MAIN_SEO,
  buildLonavalaMetadata,
} from "@/lib/lonavalaSeo";

export const revalidate = 60;

export const metadata = buildLonavalaMetadata(LONAVALA_MAIN_SEO);

export default function VillasInLonavalaPage() {
  return <LonavalaLandingView config={LONAVALA_MAIN_SEO} />;
}
