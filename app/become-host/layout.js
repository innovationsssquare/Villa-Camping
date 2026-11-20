const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "List Your Property | Earn High Monthly Rental Yield | ThevillaCamp Host",
  description:
    "Partner with Maharashtra's leading luxury hospitality network. List your private pool villa, cottage, or campsite with zero upfront fees, verified guests, 24-hr payouts, and dedicated host support.",
  keywords: [
    "list your villa",
    "become a villa host",
    "monetize holiday home",
    "lonavala villa management",
    "list campsite pawna lake",
    "thevillacamp host",
  ],
  openGraph: {
    title: "List Your Luxury Villa or Campsite | ThevillaCamp Host Network",
    description:
      "Join top property owners across Lonavala, Pawna, and Maharashtra earning consistent passive rental income with verified guests.",
    url: `${SITE_URL}/become-host`,
    siteName: "ThevillaCamp",
    images: [
      {
        url: "/Aboutusasset/Villabanner.jpg",
        width: 1200,
        height: 630,
        alt: "List your property with ThevillaCamp",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "List Your Luxury Villa or Campsite | ThevillaCamp Host",
    description:
      "Join top property owners earning consistent passive rental income with verified guests and 24-hour payouts.",
    images: ["/Aboutusasset/Villabanner.jpg"],
  },
  alternates: {
    canonical: `${SITE_URL}/become-host`,
  },
};

export default function BecomeHostLayout({ children }) {
  return children;
}
