const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "Privacy Policy & Data Security",
  description:
    "Learn how ThevillaCamp safeguards your personal records, payment data, and contact information under the Digital Personal Data Protection (DPDP) Act of India.",
  openGraph: {
    title: "Privacy Policy | ThevillaCamp",
    description: "Transparency and data protection practices across ThevillaCamp web and mobile apps.",
    url: `${SITE_URL}/privacy-policy`,
    siteName: "ThevillaCamp",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
