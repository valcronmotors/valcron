import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
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
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Valcron Motors Group | Dealer, Importación y Financiamiento en RD",
    template: "%s | Valcron Motors Group",
  },
  description: SITE.heroSubtitle,
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
    title: "Valcron Motors Group | Dealer, Importación y Financiamiento en RD",
    description: SITE.heroSubtitle,
    url: SITE.url,
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
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
