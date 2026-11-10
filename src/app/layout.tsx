import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PublicExperience } from "@/components/public/PublicExperience";
import { SITE } from "@/lib/site";
import { ADSENSE_BOOTSTRAP, GOOGLE_ADS_ID, GOOGLE_TAG_BOOTSTRAP } from "@/lib/google-tags";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.seoTitle,
    template: "%s | Valcron Motors",
  },
  description: SITE.valueProposition,
  keywords: [
    "Valcron Motors",
    "dealer República Dominicana",
    "vehículos en venta Santo Domingo Este",
    "comprar vehículo RD",
    "financiamiento de vehículos RD",
    "subastas de vehículos USA",
    "importación de vehículos RD",
    "dealer Santo Domingo Este",
  ],
  icons: {
    icon: [
      { url: "/branding/valcron-favicon.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/branding/valcron-apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: SITE.seoTitle,
    description: SITE.valueProposition,
    url: SITE.url,
    images: [
      {
        url: "/api/public/social-image?v=20261110",
        width: 1200,
        height: 630,
        alt: "Valcron Motors — dealer en Santo Domingo Este",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: SITE.valueProposition,
    images: ["/api/public/social-image?v=20261110"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script id="google-tag" dangerouslySetInnerHTML={{ __html: GOOGLE_TAG_BOOTSTRAP }} />
        <Script
          id="google-ads-loader"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        <Script
          id="google-adsense-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: ADSENSE_BOOTSTRAP }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <PublicExperience>{children}</PublicExperience>
      </body>
    </html>
  );
}
