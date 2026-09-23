"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CurrencyProvider } from "@/components/public/CurrencyProvider";
import { WhatsAppFab } from "@/components/public/WhatsAppFab";
import { usesMarketingChrome } from "@/lib/site";

export function PublicExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const publicSite = usesMarketingChrome(pathname);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (publicSite) {
      root.classList.add("public-site");
      body.classList.add("public-site");
    } else {
      root.classList.remove("public-site");
      body.classList.remove("public-site");
    }

    return () => {
      root.classList.remove("public-site");
      body.classList.remove("public-site");
    };
  }, [publicSite]);

  if (pathname.startsWith("/admin")) {
    return (
      <div className="flex h-screen w-full min-h-screen flex-col overflow-hidden">
        {children}
      </div>
    );
  }

  if (!publicSite) {
    return <>{children}</>;
  }

  return (
    <CurrencyProvider>
      <div className="public-site flex min-h-full flex-1 flex-col overflow-x-clip bg-[#050608] text-[#fafafa]">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <Footer showCompactMap={pathname !== "/contacto"} />
        <WhatsAppFab />
      </div>
    </CurrencyProvider>
  );
}
