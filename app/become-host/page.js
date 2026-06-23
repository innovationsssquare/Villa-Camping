import { ParallaxHero } from '@/components/Becomehostcomponents/parallax-hero';
import { AvailableNowSection } from '@/components/Becomehostcomponents/available-now-section';
import { AppDownloadSection } from '@/components/Becomehostcomponents/app-download-section';
import { ContactListingSection } from '@/components/Becomehostcomponents/contact-listing-section';

export default function Page() {
  return (
    <main className="w-full">
      <ParallaxHero />
      <AvailableNowSection />
      <ContactListingSection />
    </main>
  )
}
