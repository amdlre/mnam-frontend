export const DASHBOARD_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    refresh: '/api/auth/refresh',
  },
  session: {
    heartbeat: '/api/employee/heartbeat',
    mySession: '/api/employee/my-session',
  },
  dashboard: {
    summary: '/api/dashboard/summary',
    teamAchievement: '/api/dashboard/team-achievement',
  },
  notifications: {
    list: '/api/notifications',
    unreadCount: '/api/notifications/unread-count',
    markRead: (id: string) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all',
    delete: (id: string) => `/api/notifications/${id}`,
    clearRead: '/api/notifications/clear-all',
  },
  search: '/api/search',
  alerts: '/api/alerts',
  alertsSummary: '/api/alerts/summary',
  profile: {
    me: '/api/users/me',
    update: '/api/users/me',
    changePassword: '/api/users/me/password',
  },
} as const;
