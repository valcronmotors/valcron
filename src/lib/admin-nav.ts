export type AdminNavIcon =
  | "dashboard"
  | "inventory"
  | "auctions"
  | "requests"
  | "website"
  | "settings";

export type AdminNavChild = {
  href: string;
  label: string;
  description: string;
};

export type AdminNavSection = {
  id: string;
  label: string;
  icon: AdminNavIcon;
  href?: string;
  description?: string;
  children?: AdminNavChild[];
};

export const ADMIN_NAV: AdminNavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    href: "/admin",
    description: "Resumen del inventario, solicitudes y oportunidades.",
  },
  {
    id: "inventario",
    label: "Inventario",
    icon: "inventory",
    href: "/admin/inventario",
    description: "Vehículos del catálogo público: borradores, publicados, reservados y vendidos.",
  },
  {
    id: "subastas",
    label: "Oportunidades",
    icon: "auctions",
    href: "/admin/subastas",
    description: "Seguimiento interno de lotes. No aparecen en el inventario hasta prepararlos y publicarlos.",
  },
  {
    id: "solicitudes",
    label: "Solicitudes",
    icon: "requests",
    href: "/admin/solicitudes",
    description: "Mensajes y cotizaciones recibidos desde el website.",
  },
  {
    id: "website",
    label: "Website",
    icon: "website",
    href: "/admin/website",
    description: "Estado de publicación y accesos del sitio.",
  },
];

export function isAdminPathActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isAdminNavChildActive(
  pathname: string,
  childHref: string,
  siblings: AdminNavChild[],
) {
  const match = siblings
    .filter((entry) => isAdminPathActive(pathname, entry.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.href === childHref;
}

export function findAdminNavItem(pathname: string) {
  for (const section of ADMIN_NAV) {
    if (section.href && isAdminPathActive(pathname, section.href)) {
      const nestedLabel = pathname.endsWith("/nuevo")
        ? section.id === "inventario"
          ? "Agregar vehículo"
          : section.id === "subastas"
            ? "Agregar oportunidad"
            : section.label
        : pathname.startsWith("/admin/subastas/copart")
          ? "Inventario Copart"
          : section.label;
      return {
        section,
        item: {
          href: section.href,
          label: nestedLabel,
          description: section.description ?? "",
        },
      };
    }

    const exact = section.children?.find((entry) => pathname === entry.href);
    if (exact) {
      return { section, item: exact };
    }

    const nested = section.children
      ?.filter((entry) => pathname.startsWith(`${entry.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];
    if (nested) {
      return { section, item: nested };
    }
  }

  if (pathname.startsWith("/admin/configuracion/usuarios") || pathname.startsWith("/admin/usuarios")) {
    const website = ADMIN_NAV.find((section) => section.id === "website");
    return {
      section: website ?? ADMIN_NAV[0],
      item: {
        href: "/admin/configuracion/usuarios",
        label: "Usuarios",
        description: "Quién puede entrar al panel del website.",
      },
    };
  }

  return null;
}

export function sectionHasActiveChild(pathname: string, section: AdminNavSection) {
  if (section.href) {
    return isAdminPathActive(pathname, section.href);
  }
  return Boolean(
    section.children?.some(
      (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
    ),
  );
}

export const ADMIN_MODULE_HREFS = new Set([
  ...ADMIN_NAV.flatMap((section) => [
    ...(section.href ? [section.href] : []),
    ...(section.children?.map((child) => child.href) ?? []),
  ]),
  "/admin/inventario/nuevo",
  "/admin/subastas/nuevo",
  "/admin/subastas/copart",
  "/admin/configuracion/usuarios",
  "/admin/usuarios",
  "/admin/website",
]);
