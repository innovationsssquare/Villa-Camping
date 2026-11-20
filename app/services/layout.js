const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "Stay Concierge & Guest Services | Private Chef, Barbeque & Cab Transfers",
  description:
    "Elevate your villa stay with curated on-demand services: personal live barbecue chefs, poolside decoration, private cab transfers, bonfire setups, and 24/7 concierge assistance.",
  keywords: [
    "villa concierge services",
    "private chef lonavala",
    "villa barbecue setup",
    "lonavala cab transfers",
    "pool party setup lonavala",
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
