import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Valcron Motors Group | Dealer, Financiamiento e Importación Directa en RD",
    template: "%s | Valcron Motors Group",
  },
  description:
    "Vendemos, importamos y financiamos vehículos de marcas confiables en República Dominicana. Asesoría Ley 103-13 y subastas Copart/Manheim.",
  keywords: [
    "dealer Santo Domingo Este",
    "importacion de vehiculos RD",
    "financiamiento de vehiculos RD",
    "subastas Copart Manheim",
    "Ley 103-13",
  ],
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.name,
    title: "Valcron Motors Group | Dealer, Financiamiento e Importación Directa en RD",
    description:
      "Vendemos, importamos y financiamos vehículos de marcas confiables en República Dominicana. Asesoría Ley 103-13 y subastas Copart/Manheim.",
    url: SITE.url,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0B0C10] text-[#F4F5F7]">{children}</body>
    </html>
  );
}
