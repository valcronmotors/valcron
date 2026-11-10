"use client";

import { useEffect, type ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CurrencyProvider } from "@/components/public/CurrencyProvider";
import { WhatsAppFab } from "@/components/public/WhatsAppFab";
import { HomeMobileActionBar } from "@/components/home/HomeInventoryTabs";
import { VehicleContactProvider } from "@/components/public/VehicleContactContext";

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
      <VehicleContactProvider>
      <div className="public-site flex min-h-full flex-1 flex-col bg-[#f5f6f7] pb-20 text-[#08090b] lg:pb-0">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col overflow-x-clip">{children}</div>
        <Footer />
        <WhatsAppFab />
        <HomeMobileActionBar />
      </div>
      </VehicleContactProvider>
    </CurrencyProvider>
  );
}
