const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  title: "Curated Experiences in Lonavala & Pawna Lake | Trekking, Kayaking & Sightseeing",
  description:
    "Explore unforgettable Western Ghat experiences: Pawna Lake kayaking, Tiger Point sunrise, Lohagad & Rajmachi fort trekking, Karla caves, and acoustic bonfire evenings.",
  keywords: [
    "lonavala experiences",
    "pawna lake kayaking",
    "tiger point lonavala",
    "lohagad fort trek",
    "rajmachi trekking",
    "things to do in lonavala",
    "lonavala tourist spots",
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
