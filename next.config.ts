import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "/ingreso-batytech",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/gestion-batytech",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/gestion-batytech/:path*",
        permanent: false,
      },
      {
        source: "/gestion-batytech/login",
        destination: "/ingreso-batytech",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/gestion-batytech",
        destination: "/admin",
      },
      {
        source: "/gestion-batytech/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
