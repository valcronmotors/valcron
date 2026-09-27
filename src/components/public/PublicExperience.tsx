"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { usesMarketingChrome } from "@/lib/site";

const PublicChrome = dynamic(
  () => import("@/components/public/PublicChrome").then((mod) => mod.PublicChrome),
  { ssr: true },
);

export function PublicExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || !usesMarketingChrome(pathname)) {
    return <>{children}</>;
  }

  return <PublicChrome>{children}</PublicChrome>;
}
