export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/api/",
          "/Signin",
          "/checkout",
          "/camping-checkout",
          "/booking/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
