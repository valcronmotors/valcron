"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CurrencyProvider } from "@/components/public/CurrencyProvider";
import { WhatsAppFab } from "@/components/public/WhatsAppFab";
import { usesMarketingChrome } from "@/lib/site";
import type { ReactNode } from "react";

export function PublicExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const publicSite = usesMarketingChrome(pathname);

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
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-0 flex-1 flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <WhatsAppFab />
    </CurrencyProvider>
  );
}
