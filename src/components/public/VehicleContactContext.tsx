"use client";

import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { whatsappHref } from "@/lib/site";

type Contact = { pathname: string; href: string } | null;
const ContactContext = createContext<{ href: string; register: Dispatch<SetStateAction<Contact>> } | null>(null);

export function VehicleContactProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [contact, register] = useState<Contact>(null);
  const href = contact?.pathname === pathname ? contact.href : whatsappHref("Hola Valcron, quiero información");
  const value = useMemo(() => ({ href, register }), [href]);
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useVehicleContactHref() {
  return useContext(ContactContext)?.href ?? whatsappHref("Hola Valcron, quiero información");
}

export function VehicleContact({ href }: { href: string }) {
  const context = useContext(ContactContext);
  const pathname = usePathname();
  const register = context?.register;
  useEffect(() => {
    if (!register) return;
    register({ pathname, href });
    return () => register(null);
  }, [href, pathname, register]);
  return null;
}
