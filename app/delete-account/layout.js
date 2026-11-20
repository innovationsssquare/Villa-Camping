const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "Account & Data Deletion Request",
  description:
    "Request permanent deletion of your ThevillaCamp account, host profile, and associated personal records in accordance with Google Play, Apple App Store, and the Digital Personal Data Protection (DPDP) Act of India.",
  openGraph: {
    title: "Account & Data Deletion | ThevillaCamp",
    description:
      "Transparency on data deletion, statutory retention requirements, and instructions on how to submit an account purge request.",
    url: `${SITE_URL}/delete-account`,
    siteName: "ThevillaCamp",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: `${SITE_URL}/delete-account`,
  },
};

export default function DeleteAccountLayout({ children }) {
  return children;
}
