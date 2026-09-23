import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { PublicExperience } from "@/components/public/PublicExperience";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Valcron Motors | Encuentra tu próximo vehículo en República Dominicana",
    template: "%s | Valcron Motors",
  },
  description: SITE.valueProposition,
  keywords: [
    "Valcron Motors",
    "dealer República Dominicana",
    "comprar vehículo RD",
    "inventario de vehículos Santo Domingo",
    "financiamiento de vehículos RD",
    "subastas de vehículos USA",
    "importación de vehículos RD",
    "dealer Santo Domingo Este",
  ],
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: "Valcron Motors | Encuentra tu próximo vehículo en República Dominicana",
    description: SITE.valueProposition,
    url: SITE.url,
    images: [{ url: "/hero-luxury.png", alt: SITE.shortName }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valcron Motors | Vehículos importados en República Dominicana",
    description: SITE.valueProposition,
    images: ["/hero-luxury.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakarta.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <PublicExperience>{children}</PublicExperience>
      </body>
    </html>
  );
}
