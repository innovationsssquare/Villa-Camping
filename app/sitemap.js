import { BaseUrl } from "@/lib/API/Baseurl";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

  // Static core routes
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/category/all`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/villa`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/camping`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/cottage`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/category/hotel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/become-host`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/cancellation-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic property URLs
  let propertyRoutes = [];
  try {
    const fetchProps = async (endpoint, routePrefix) => {
      try {
        const res = await fetch(`${BaseUrl}/${endpoint}`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        const items = json.data || json || [];
        if (!Array.isArray(items)) return [];
        return items.map((item) => ({
          url: `${siteUrl}/${routePrefix}/${item._id}`,
          lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        }));
      } catch (err) {
        console.warn(`Sitemap fetch error for ${endpoint}:`, err.message);
        return [];
      }
    };

    const [villas, campings, cottages, hotels] = await Promise.all([
      fetchProps("Villa/get/villas", "view-Villa"),
      fetchProps("Camping/get/campings", "view-Camping"),
      fetchProps("Cottage/get/cottages", "view-Cottage"),
      fetchProps("Hotel/get/hotels", "view-Hotel"),
    ]);

    propertyRoutes = [...villas, ...campings, ...cottages, ...hotels];
  } catch (error) {
    console.warn("Dynamic sitemap generation encountered an error:", error.message);
  }

  return [...staticRoutes, ...propertyRoutes];
}
