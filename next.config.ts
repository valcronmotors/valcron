import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/data/import-tax-table-:hash.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/vehiculo/veh_015",
        destination: "/inventario",
        statusCode: 301,
      },
      {
        source: "/vehiculo/veh_028",
        destination: "/inventario",
        statusCode: 301,
      },
      {
        source: "/blog/ley-103-13-incentivo-vehiculos-hibridos-electricos",
        destination: "/blog/vehiculos-hibridos-republica-dominicana",
        statusCode: 301,
      },
      {
        source: "/blog/financiamiento-vehiculos-republica-dominicana-requisitos",
        destination: "/financiamiento",
        statusCode: 301,
      },
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
      {
        source: "/blog/como-importar-vehiculo-eeuu-republica-dominicana",
        destination: "/blog/comprar-vehiculo-estados-unidos-republica-dominicana",
        statusCode: 301,
      },
      {
        source: "/blog/subastas-copart-manheim-como-funcionan",
        destination: "/blog/copart-vs-iaa-subastas-vehiculos-estados-unidos",
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
