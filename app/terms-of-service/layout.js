const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "Terms of Service & Guest Guidelines",
  description:
    "Official terms and conditions for reserving private pool villas, lakeside campsites, cottages, and boutique hotel stays on ThevillaCamp.",
  openGraph: {
    title: "Terms of Service | ThevillaCamp",
    description: "Platform guidelines, reservation policies, and guest standards across ThevillaCamp.",
    url: `${SITE_URL}/terms-of-service`,
    siteName: "ThevillaCamp",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
};

export default function TermsOfServiceLayout({ children }) {
  return children;
}
