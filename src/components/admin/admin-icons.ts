import { Car, Inbox, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";
import type { AdminNavIcon } from "@/lib/admin-nav";

export const ADMIN_NAV_ICONS: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  inventory: Car,
  requests: Inbox,
  settings: Settings,
};
