export type DashboardUserRole =
  | 'system_owner'
  | 'admin'
  | 'owners_agent'
  | 'customers_agent';

export interface DashboardUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: DashboardUserRole;
}

export interface DashboardMeResponse {
  id: string;
  username: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role: DashboardUserRole;
}

export interface DashboardLoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: DashboardUserRole;
  };
}

export const DASHBOARD_ROLE_PAGES: Record<DashboardUserRole, string[]> = {
  system_owner: [
    'home',
    'bookings',
    'customers',
    'units',
    'owners',
    'projects',
    'financials',
    'users',
    'integrations',
    'audit',
    'urgent-requests',
    'cleaning-maintenance',
  ],
  admin: [
    'home',
    'bookings',
    'customers',
    'units',
    'owners',
    'projects',
    'financials',
    'users',
    'integrations',
    'audit',
    'urgent-requests',
    'cleaning-maintenance',
  ],
  owners_agent: ['home', 'owners', 'units', 'projects', 'urgent-requests', 'cleaning-maintenance'],
  customers_agent: ['home', 'units', 'bookings', 'customers', 'urgent-requests', 'cleaning-maintenance'],
};
