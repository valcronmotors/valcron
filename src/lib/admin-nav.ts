export type AdminNavIcon = "dashboard" | "inventory" | "requests" | "settings";

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
  children?: AdminNavChild[];
};

export const ADMIN_NAV: AdminNavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    href: "/admin",
  },
  {
    id: "inventario",
    label: "Vehículos",
    icon: "inventory",
    children: [
      {
        href: "/admin/inventario",
        label: "Inventario público",
        description: "Unidades publicadas o listas para el website de Valcron Motors.",
      },
      {
        href: "/admin/inventario/nuevo",
        label: "Agregar vehículo",
        description: "Alta de una unidad para el inventario del website.",
      },
    ],
  },
  {
    id: "solicitudes",
    label: "Solicitudes web",
    icon: "requests",
    children: [
      {
        href: "/admin/solicitudes",
        label: "Bandeja de solicitudes",
        description:
          "Contacto, búsqueda de vehículo, importación, subasta y financiamiento capturados desde el website. Sin pipeline comercial.",
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: "settings",
    children: [
      {
        href: "/admin/configuracion/usuarios",
        label: "Usuarios del website",
        description: "Acceso al CMS del website. No es gestión de equipo comercial.",
      },
    ],
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
    if (section.href && pathname === section.href) {
      return {
        section,
        item: {
          href: section.href,
          label: section.label,
          description: "Vista del inventario y contenido del website.",
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

  return null;
}

export function sectionHasActiveChild(pathname: string, section: AdminNavSection) {
  if (section.href) {
    return pathname === section.href;
  }
  return Boolean(
    section.children?.some(
      (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
    ),
  );
}

export const ADMIN_MODULE_HREFS = new Set(
  ADMIN_NAV.flatMap((section) => [
    ...(section.href ? [section.href] : []),
    ...(section.children?.map((child) => child.href) ?? []),
  ]),
);
