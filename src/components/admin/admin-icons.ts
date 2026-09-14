import {
  Car,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  MessageCircle,
  Scale,
  Settings,
  Ship,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminNavIcon } from "@/lib/admin-nav";

export const ADMIN_NAV_ICONS: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  messaging: MessageCircle,
  inventory: Car,
  imports: Ship,
  finance: CreditCard,
  legal: Scale,
  accounting: CircleDollarSign,
  clients: Users,
  reports: TrendingUp,
  settings: Settings,
};
