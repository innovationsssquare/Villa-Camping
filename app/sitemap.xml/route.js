export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://thevillacamp.com';

  // try to fetch property slugs/ids from backend; fallback to static routes
  let urls = [
    '/',
    '/search-stay',
    '/become-host',
  ];

  try {
    const apiBase = process.env.NEXT_PUBLIC_PRODUCTION_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (apiBase) {
      const res = await fetch(`${apiBase}/properties`, { cache: 'no-store' });
      if (res.ok) {
        const list = await res.json();
        // expect an array of properties with id and type
        list.forEach((p) => {
          if (p._id) urls.push(`/view-Villa/${p._id}`);
          if (p.type === 'cottage' && p._id) urls.push(`/view-Cottage/${p._id}`);
          if (p.type === 'hotel' && p._id) urls.push(`/view-Hotel/${p._id}`);
        });
      }
    }
  } catch (e) {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((u) => {
        return `<url><loc>${site}${u}</loc><changefreq>weekly</changefreq></url>`;
      })
      .join('')}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
