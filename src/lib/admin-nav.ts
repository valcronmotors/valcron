export type AdminNavIcon =
  | "dashboard"
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
    id: "inventario",
    label: "Inventario & Stock",
    icon: "inventory",
    children: [
      {
        href: "/admin/inventario",
        label: "Ver Stock RD",
        description:
          "Unidades disponibles, en taller y vendidas en República Dominicana.",
      },
      {
        href: "/admin/inventario/nuevo",
        label: "Agregar Vehículo",
        description:
          "Alta de inventario con VIN, costos de importación y precio de venta.",
      },
      {
        href: "/admin/inventario/recepciones",
        label: "Recepciones / Trade-In",
        description:
          "Recepción de unidades, permutas y trade-in de clientes.",
      },
      {
        href: "/admin/inventario/taller",
        label: "Reacondicionamiento & Taller",
        description:
          "Órdenes de reacondicionamiento, costos de taller y listos para venta.",
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
        label: "Subastas Copart / IAAI / Manheim",
        description:
          "Pipeline de compras en Copart, IAAI y Manheim con lote y VIN.",
      },
      {
        href: "/admin/importaciones/tracker",
        label: "Tracker Logístico por VIN",
        description:
          "Seguimiento de tránsito, puerto, DGA y llegada a piso de venta.",
      },
      {
        href: "/admin/importaciones/landing-cost",
        label: "Calculadora Landing Cost",
        description:
          "Costo total aterrizado: subasta, fees, flete, taller e impuestos DGA.",
      },
    ],
  },
  {
    id: "financiamiento",
    label: "Financiamiento & Pre-Aprobaciones",
    icon: "finance",
    children: [
      {
        href: "/admin/financiamiento/solicitudes",
        label: "Solicitudes Web",
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
        label: "Simulador de Cuotas",
        description:
          "Simulación de inicial, plazo y cuota mensual para el cliente.",
      },
    ],
  },
  {
    id: "legales",
    label: "Legales & Contratos",
    icon: "legal",
    children: [
      {
        href: "/admin/legales/actos-venta",
        label: "Actos de Venta",
        description: "Generación y archivo de actos de venta notariales.",
      },
      {
        href: "/admin/legales/contratos-importacion",
        label: "Contratos de Importación",
        description:
          "Contratos de importación a nombre del cliente o de la empresa.",
      },
      {
        href: "/admin/legales/traspasos",
        label: "Traspasos & Matrículas",
        description: "Control de traspasos, placas y matrículas DGII/INTRANT.",
      },
    ],
  },
  {
    id: "finanzas",
    label: "Finanzas & Contabilidad",
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
        label: "NCF / Reporte 606 & 607 DGII",
        description:
          "Emisión de comprobantes fiscales y reportes 606 / 607.",
      },
      {
        href: "/admin/finanzas/margen",
        label: "Margen por Vehículo",
        description:
          "Utilidad neta, ROI y desglose de costo versus precio de venta.",
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
        label: "Directorio de Clientes",
        description: "Base de prospectos y clientes de Valcron Motors.",
      },
      {
        href: "/admin/clientes/kanban",
        label: "Embudo Kanban",
        description: "Pipeline comercial desde lead nuevo hasta cierre.",
      },
      {
        href: "/admin/clientes/cotizador",
        label: "Cotizador PDF / WhatsApp",
        description:
          "Cotizaciones formales para envío por PDF o WhatsApp.",
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
        label: "Rentabilidad por Marca",
        description: "Margen consolidado por marca, modelo y fuente de compra.",
      },
      {
        href: "/admin/reportes/comisiones",
        label: "Comisiones de Vendedores",
        description: "Comisiones por cierre y productividad del equipo comercial.",
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
        label: "Usuarios y Permisos",
        description:
          "Alta de administradores y vendedores, claves y revocación de acceso.",
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

export function findAdminNavItem(pathname: string) {
  for (const section of ADMIN_NAV) {
    if (section.href && isAdminPathActive(pathname, section.href)) {
      return {
        section,
        item: {
          href: section.href,
          label: section.label,
          description: "Vista ejecutiva de inventario, importaciones y CRM.",
        },
      };
    }

    const child = section.children?.find((entry) => pathname === entry.href);
    if (child) {
      return { section, item: child };
    }
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

export const ADMIN_MODULE_HREFS = new Set(
  ADMIN_NAV.flatMap((section) => [
    ...(section.href ? [section.href] : []),
    ...(section.children?.map((child) => child.href) ?? []),
  ]),
);
