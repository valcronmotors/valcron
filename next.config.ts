import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/quienes-somos",
        destination: "/nosotros",
        statusCode: 301,
      },
      {
        source: "/calculadora-financiamiento",
        destination: "/calculadoras/financiamiento",
        statusCode: 301,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "admin.valcronmotors.com" }],
          destination: "/admin",
        },
      ],
    };
  },
};

export default nextConfig;
