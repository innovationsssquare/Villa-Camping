import { getSiteUrl } from "@/lib/lonavalaSeo";

const SITE_URL = getSiteUrl();

export const metadata = {
  title: "Villa Concierge, BBQ, Private Chef & Group Event Services in Lonavala",
  description:
    "Upgrade your Lonavala holiday home or private pool villa stay with live barbecue chefs, caretaker home-cooked meals, birthday & pool party decor, bonfire setups, cab transfers, and corporate offsite support.",
  keywords: [
    "villa concierge services lonavala",
    "private chef lonavala villa",
    "home cooked meals villa lonavala",
    "villa barbecue and bonfire setup",
    "birthday party decor villa lonavala",
    "pool party setup lonavala",
    "corporate offsite planning lonavala",
    "lonavala cab transfers",
    "thevillacamp services",
  ],
  openGraph: {
    title: "Stay Concierge & Guest Services | ThevillaCamp",
    description:
      "On-demand hospitality experiences for your private villa stay: live barbecue, private chef, event styling, and local transfers.",
    url: `${SITE_URL}/services`,
    siteName: "ThevillaCamp",
    images: [
      {
        url: "/Aboutusasset/Villabanner.jpg",
        width: 1200,
        height: 630,
        alt: "Stay Concierge Services - ThevillaCamp",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stay Concierge & Guest Services | ThevillaCamp",
    description:
      "Elevate your stay with personal chefs, live barbecue, bonfire setups, and 24/7 concierge support.",
    images: ["/Aboutusasset/Villabanner.jpg"],
  },
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

export default function ServicesLayout({ children }) {
  return children;
}
