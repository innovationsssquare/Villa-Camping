import { BaseUrl } from "@/lib/API/Baseurl";
import { LONAVALA_STATIC_PATHS, getSiteUrl } from "@/lib/lonavalaSeo";

export default async function sitemap() {
  const siteUrl = getSiteUrl();

  // Static core routes
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...LONAVALA_STATIC_PATHS.map((routePath) => ({
      url: `${siteUrl}${routePath}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: routePath === "/villas-in-lonavala" ? 0.95 : 0.9,
    })),
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
    {
      url: `${siteUrl}/delete-account`,
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
        return items
          .filter((item) => item.isapproved === "approved" && item.isLive !== false)
          .map((item) => {
            const validImages = Array.isArray(item.images)
              ? item.images
                  .filter((img) => typeof img === "string" && /^https?:\/\//i.test(img))
                  .slice(0, 5)
              : [];
            return {
              url: `${siteUrl}/${routePrefix}/${item._id}`,
              lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
              changeFrequency: "daily",
              priority: 0.8,
              ...(validImages.length > 0 ? { images: validImages } : {}),
            };
          });
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
