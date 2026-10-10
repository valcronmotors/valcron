import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PublicExperience } from "@/components/public/PublicExperience";
import { SITE } from "@/lib/site";
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
    default: "Más opciones. Más cerca de ti. | Valcron Motors",
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
    title: "Más opciones. Más cerca de ti. | Valcron Motors",
    description: SITE.valueProposition,
    url: SITE.url,
    images: [
      {
        url: "/marketing/banner-suv-tropical.jpg",
        alt: "SUV Mazda blanco en un entorno tropical, fotografía ilustrativa. No representa las instalaciones de Valcron.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Más opciones. Más cerca de ti. | Valcron Motors",
    description: SITE.valueProposition,
    images: ["/marketing/banner-suv-tropical.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <PublicExperience>{children}</PublicExperience>
      </body>
    </html>
  );
}
