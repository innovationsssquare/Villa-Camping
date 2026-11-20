const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "Cancellation & Refund Policy",
  description:
    "Understand cancellation windows, seasonal refund tiers, and weather emergency policies for villa and campsite bookings on ThevillaCamp.",
  openGraph: {
    title: "Cancellation & Refund Policy | ThevillaCamp",
    description: "Clear and transparent refund standards across all stays on ThevillaCamp.",
    url: `${SITE_URL}/cancellation-policy`,
    siteName: "ThevillaCamp",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: `${SITE_URL}/cancellation-policy`,
  },
};

export default function CancellationPolicyLayout({ children }) {
  return children;
}
