export type AdminNavIcon =
  | "dashboard"
  | "messaging"
  | "inventory"
  | "imports"
  | "finance"
  | "legal"
  | "accounting"
  | "clients"
  | "reports"
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
  children?: AdminNavChild[];
};

export const ADMIN_NAV: AdminNavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard Principal",
    icon: "dashboard",
    href: "/admin",
  },
  {
    id: "mensajeria",
    label: "Mensajería Omnicanal & IA",
    icon: "messaging",
    children: [
      {
        href: "/admin/mensajeria",
        label: "Bandeja unificada",
        description:
          "WhatsApp, Instagram y Facebook con piloto automático de IA comercial.",
      },
      {
        href: "/admin/mensajeria/whatsapp",
        label: "WhatsApp",
        description: "Conversaciones del canal WhatsApp Business.",
      },
      {
        href: "/admin/mensajeria/instagram",
        label: "Instagram",
        description: "Bandeja de Instagram Direct vinculada al CRM.",
      },
      {
        href: "/admin/mensajeria/facebook",
        label: "Facebook",
        description: "Messenger y anuncios Meta conectados al embudo comercial.",
      },
    ],
  },
  {
    id: "inventario",
    label: "Inventario & Stock",
    icon: "inventory",
    children: [
      {
        href: "/admin/inventario",
        label: "Stock RD",
        description:
          "Unidades disponibles, en taller y vendidas en República Dominicana.",
      },
      {
        href: "/admin/inventario/ubicaciones",
        label: "Ubicación / Llaves",
        description:
          "Control de llaves, lote, patio y ubicación física de cada unidad.",
      },
      {
        href: "/admin/inventario/recepciones",
        label: "Recepciones / Trade-In",
        description:
          "Recepción de unidades, permutas y trade-in de clientes.",
      },
      {
        href: "/admin/inventario/taller",
        label: "Detailing / Taller",
        description:
          "Órdenes de detailing, reacondicionamiento y listos para venta.",
      },
    ],
  },
  {
    id: "importaciones",
    label: "Importaciones & Subastas",
    icon: "imports",
    children: [
      {
        href: "/admin/importaciones/subastas",
        label: "Copart / IAAI / Manheim",
        description:
          "Pipeline de compras en Copart, IAAI y Manheim con lote y VIN.",
      },
      {
        href: "/admin/importaciones/tracker",
        label: "Logística por VIN",
        description:
          "Seguimiento de tránsito, puerto, DGA y llegada a piso de venta.",
      },
      {
        href: "/admin/importaciones/landing-cost",
        label: "Landing Cost",
        description:
          "Costo total aterrizado: subasta, fees, flete, taller e impuestos DGA.",
      },
    ],
  },
  {
    id: "financiamiento",
    label: "Financiamiento",
    icon: "finance",
    children: [
      {
        href: "/admin/financiamiento/solicitudes",
        label: "Pre-Aprobaciones",
        description:
          "Solicitudes de pre-aprobación capturadas desde el sitio público.",
      },
      {
        href: "/admin/financiamiento/expedientes",
        label: "Expedientes Bancarios",
        description:
          "Documentación y estatus de expedientes con banca local.",
      },
      {
        href: "/admin/financiamiento/simulador",
        label: "Simulador",
        description:
          "Simulación de inicial, plazo y cuota mensual para el cliente.",
      },
    ],
  },
  {
    id: "legales",
    label: "Legales, Matrículas & DGII",
    icon: "legal",
    children: [
      {
        href: "/admin/legales/actos-venta",
        label: "Actos de Venta",
        description: "Generación y archivo de actos de venta notariales.",
      },
      {
        href: "/admin/legales/traspasos",
        label: "Traspasos",
        description: "Expedientes de traspaso y cambio de propietario.",
      },
      {
        href: "/admin/legales/placas",
        label: "Placas X",
        description:
          "Gestión de placas X, matrículas temporales y seguimiento DGII/INTRANT.",
      },
      {
        href: "/admin/legales/contratos",
        label: "Contratos",
        description:
          "Contratos de importación, compraventa y documentos legales del dealer.",
      },
    ],
  },
  {
    id: "finanzas",
    label: "Finanzas & NCF",
    icon: "accounting",
    children: [
      {
        href: "/admin/finanzas/cuentas-por-cobrar",
        label: "Cuentas por Cobrar",
        description: "Iniciales, balances financiados y cobros pendientes.",
      },
      {
        href: "/admin/finanzas/cuentas-por-pagar",
        label: "Cuentas por Pagar",
        description: "Obligaciones a subastas, fletes, taller y proveedores.",
      },
      {
        href: "/admin/finanzas/ncf",
        label: "Comprobantes 606 / 607 DGII",
        description:
          "Emisión de NCF y reportes 606 / 607 para cumplimiento fiscal.",
      },
      {
        href: "/admin/finanzas/margen",
        label: "Margen Neto",
        description:
          "Utilidad neta, ROI y desglose de costo versus precio de venta.",
      },
      {
        href: "/admin/finanzas/seguros",
        label: "Pólizas de Seguro",
        description:
          "Pólizas de stock, tránsito, responsabilidad civil y cobertura al cliente.",
      },
    ],
  },
  {
    id: "clientes",
    label: "Clientes & Ventas",
    icon: "clients",
    children: [
      {
        href: "/admin/clientes",
        label: "Directorio",
        description: "Base de prospectos y clientes de Valcron Motors.",
      },
      {
        href: "/admin/clientes/kanban",
        label: "Embudo Kanban",
        description: "Pipeline comercial desde lead nuevo hasta cierre.",
      },
      {
        href: "/admin/clientes/cotizador",
        label: "Cotizaciones",
        description: "Cotizaciones formales para envío por PDF o WhatsApp.",
      },
    ],
  },
  {
    id: "reportes",
    label: "Reportes & BI",
    icon: "reports",
    children: [
      {
        href: "/admin/reportes/rentabilidad",
        label: "Rentabilidad",
        description: "Margen consolidado por marca, modelo y fuente de compra.",
      },
      {
        href: "/admin/reportes/comisiones",
        label: "Comisiones",
        description: "Comisiones por cierre y productividad del equipo comercial.",
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración & Auditoría",
    icon: "settings",
    children: [
      {
        href: "/admin/configuracion/usuarios",
        label: "Usuarios",
        description:
          "Alta de administradores y vendedores, claves y revocación de acceso.",
      },
      {
        href: "/admin/configuracion/permisos",
        label: "Permisos",
        description:
          "Roles, accesos por módulo y políticas de autorización del ERP.",
      },
      {
        href: "/admin/configuracion/auditoria",
        label: "Audit Logs",
        description:
          "Registro de auditoría: altas, cambios de precio, accesos y revocaciones.",
      },
      {
        href: "/admin/configuracion/ia",
        label: "IA & Webhooks Meta",
        description:
          "Tokens de WhatsApp, Instagram y Facebook y prompt del asesor IA.",
      },
      {
        href: "/admin/configuracion/empresa",
        label: "Datos Fiscales Empresa",
        description:
          "RNC, dirección fiscal, NCF y datos corporativos de Valcron Motors.",
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
          description: "Vista ejecutiva de inventario, importaciones y CRM.",
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

export function sectionHasActiveChild(
  pathname: string,
  section: AdminNavSection,
) {
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
