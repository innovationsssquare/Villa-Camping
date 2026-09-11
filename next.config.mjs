/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
