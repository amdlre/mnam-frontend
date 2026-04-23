import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Building2,
  ClipboardList,
  DollarSign,
  FileText,
  Folder,
  Home,
  Link as LinkIcon,
  Sparkles,
  User,
  Users,
} from 'lucide-react';

export interface DashboardNavItem {
  id: string;
  /** Route segment under /[locale]/dashboard/. Empty string = dashboard home. */
  path: string;
  /** Translation key under `dashboard.nav.*`. */
  labelKey: string;
  icon: LucideIcon;
  /** Show in mobile bottom nav (top 4 only). */
  inBottomNav?: boolean;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: 'home', path: '', labelKey: 'home', icon: Home, inBottomNav: true },
  { id: 'cleaning-maintenance', path: 'cleaning-maintenance', labelKey: 'cleaningMaintenance', icon: Sparkles },
  { id: 'bookings', path: 'bookings', labelKey: 'bookings', icon: ClipboardList, inBottomNav: true },
  { id: 'owners', path: 'owners', labelKey: 'owners', icon: Briefcase },
  { id: 'projects', path: 'projects', labelKey: 'projects', icon: Folder },
  { id: 'units', path: 'units', labelKey: 'units', icon: Building2, inBottomNav: true },
  { id: 'users', path: 'users', labelKey: 'users', icon: Users },
  { id: 'financials', path: 'financials', labelKey: 'financials', icon: DollarSign },
  { id: 'customers', path: 'customers', labelKey: 'customers', icon: User, inBottomNav: true },
  { id: 'integrations', path: 'integrations', labelKey: 'integrations', icon: LinkIcon },
  { id: 'audit', path: 'audit', labelKey: 'audit', icon: FileText },
];
