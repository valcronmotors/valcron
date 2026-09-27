"use client";

import { useEffect, type ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CurrencyProvider } from "@/components/public/CurrencyProvider";
import { WhatsAppFab } from "@/components/public/WhatsAppFab";

export function PublicChrome({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("public-site");
    body.classList.add("public-site");
    return () => {
      root.classList.remove("public-site");
      body.classList.remove("public-site");
    };
  }, []);

  return (
    <CurrencyProvider>
      <div className="public-site flex min-h-full flex-1 flex-col overflow-x-clip bg-[#f7f5f1] text-[#141414]">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <Footer />
        <WhatsAppFab />
      </div>
    </CurrencyProvider>
  );
}
