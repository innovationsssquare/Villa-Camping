/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/view-Villas/:id",
        destination: "/view-Villa/:id",
        permanent: true,
      },
      {
        source: "/view-villas/:id",
        destination: "/view-Villa/:id",
        permanent: true,
      },
      {
        source: "/view-Campings/:id",
        destination: "/view-Camping/:id",
        permanent: true,
      },
      {
        source: "/view-campings/:id",
        destination: "/view-Camping/:id",
        permanent: true,
      },
      {
        source: "/view-Cottages/:id",
        destination: "/view-Cottage/:id",
        permanent: true,
      },
      {
        source: "/view-cottages/:id",
        destination: "/view-Cottage/:id",
        permanent: true,
      },
      {
        source: "/view-Hotels/:id",
        destination: "/view-Hotel/:id",
        permanent: true,
      },
      {
        source: "/view-hotels/:id",
        destination: "/view-Hotel/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
