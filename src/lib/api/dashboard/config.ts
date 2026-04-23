export const DASHBOARD_API_CONFIG = {
  baseUrl:
    process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8000',
  sessionCookieName: process.env.DASHBOARD_SESSION_COOKIE || 'access_token',
  refreshCookieName: process.env.DASHBOARD_REFRESH_COOKIE || 'refresh_token',
  csrfCookieName: process.env.DASHBOARD_CSRF_COOKIE || 'csrf_token',
  heartbeatIntervalMs: 60_000,
} as const;
