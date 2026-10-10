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
    description: "Resumen de Inventario Valcron, subastas y solicitudes.",
  },
  {
    id: "inventario",
    label: "Inventario Valcron",
    icon: "inventory",
    description: "Stock local controlado por Valcron. No incluye oportunidades de subasta.",
    children: [
      {
        href: "/admin/inventario",
        label: "Vehículos",
        description: "Borradores, publicados, reservados y vendidos.",
      },
      {
        href: "/admin/inventario/nuevo",
        label: "Agregar vehículo",
        description: "Nueva unidad al inventario local.",
      },
    ],
  },
  {
    id: "subastas",
    label: "Subastas",
    icon: "auctions",
    description: "Oportunidades de subasta Copart, IAA y Manheim — ingreso manual.",
    children: [
      {
        href: "/admin/subastas",
        label: "Oportunidades",
        description: "Gestión manual y publicación en el inventario de subastas.",
      },
      {
        href: "/admin/subastas/nuevo",
        label: "Agregar vehículo de subasta",
        description: "Crear oportunidad Copart, IAA o Manheim.",
      },
    ],
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
    description: "Estado de publicación de ambos catálogos públicos.",
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

    if (section.href && isAdminPathActive(pathname, section.href)) {
      return {
        section,
        item: {
          href: section.href,
          label: section.label,
          description: section.description ?? "",
        },
      };
    }

    if (
      !section.href &&
      section.children?.some((child) => isAdminPathActive(pathname, child.href))
    ) {
      const activeChild = section.children
        .filter((child) => isAdminPathActive(pathname, child.href))
        .sort((a, b) => b.href.length - a.href.length)[0];
      if (activeChild) {
        return { section, item: activeChild };
      }
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
  "/admin/configuracion/usuarios",
  "/admin/usuarios",
  "/admin/website",
]);
