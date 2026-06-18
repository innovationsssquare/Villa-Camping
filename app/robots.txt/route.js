export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://thevillacamp.com';
  const txt = `User-agent: *
Disallow:
Sitemap: ${site}/sitemap.xml
`;
  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
