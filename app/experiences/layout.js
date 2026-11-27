import { getSiteUrl } from "@/lib/lonavalaSeo";

const SITE_URL = getSiteUrl();

export const metadata = {
  title: "Things to Do in Lonavala & Pawna Lake | Trekking, Kayaking & Waterfall Sightseeing",
  description:
    "Explore top Western Ghat experiences near your villa stay: Pawna Lake kayaking, Tiger Point sunset, Bhushi Dam monsoon views, Wet 'n' Joy Water Park, Lohagad fort trek, Karla Caves & live BBQ bonfire nights.",
  keywords: [
    "things to do in lonavala",
    "lonavala experiences",
    "pawna lake kayaking",
    "pawna lake camping bonfire bbq",
    "tiger point lonavala",
    "bhushi dam lonavala",
    "wet n joy water park lonavala",
    "lohagad fort trek",
    "rajmachi trekking",
    "karla caves lonavala",
    "lonavala tourist spots",
    "weekend activities near mumbai pune",
    "thevillacamp experiences",
  ],
  openGraph: {
    title: "Curated Experiences in Lonavala & Pawna Lake | ThevillaCamp",
    description:
      "From sunrise view points to tranquil lake kayaking and historical Sahyadri treks, discover curated adventures near your stay.",
    url: `${SITE_URL}/experiences`,
    siteName: "ThevillaCamp",
    images: [
      {
        url: "/Aboutusasset/Campbanner.jpg",
        width: 1200,
        height: 630,
        alt: "Curated Experiences in Lonavala and Pawna Lake",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Experiences in Lonavala & Pawna Lake | ThevillaCamp",
    description:
      "Explore unforgettable Western Ghat experiences: Pawna Lake kayaking, Tiger Point, fort trekking, and bonfire nights.",
    images: ["/Aboutusasset/Campbanner.jpg"],
  },
  alternates: {
    canonical: `${SITE_URL}/experiences`,
  },
};

export default function ExperiencesLayout({ children }) {
  return children;
}
