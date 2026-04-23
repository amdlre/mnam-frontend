import { cookies } from 'next/headers';

import { DASHBOARD_API_CONFIG } from './config';

export interface DashboardFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  /** Pass `true` from Client Components — cookies are forwarded by the browser automatically. */
  isClient?: boolean;
  /** Send a raw body without JSON.stringify (e.g. URLSearchParams). */
  rawBody?: BodyInit;
  /** Override Content-Type when sending rawBody. */
  contentType?: string;
}

export class DashboardApiException extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'DashboardApiException';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(endpoint: string, params?: DashboardFetchOptions['params']) {
  const base = DASHBOARD_API_CONFIG.baseUrl.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${base}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function buildServerHeaders(
  method: string,
  contentType: string,
  custom?: HeadersInit,
): Promise<Record<string, string>> {
  const store = await cookies();
  const all = store.getAll();
  const cookieHeader = all.map((c) => `${c.name}=${c.value}`).join('; ');

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': contentType,
    ...(custom as Record<string, string> | undefined),
  };
  if (cookieHeader) headers['Cookie'] = cookieHeader;

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrf = store.get(DASHBOARD_API_CONFIG.csrfCookieName)?.value;
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }
  return headers;
}

function getClientCsrf(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${DASHBOARD_API_CONFIG.csrfCookieName}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export async function dashboardFetch<T>(
  endpoint: string,
  options: DashboardFetchOptions = {},
): Promise<T> {
  const {
    body,
    params,
    isClient = false,
    rawBody,
    contentType = 'application/json',
    headers: customHeaders,
    method = 'GET',
    ...rest
  } = options;

  const methodUpper = method.toUpperCase();
  const url = buildUrl(endpoint, params);

  let headers: Record<string, string>;
  if (isClient) {
    headers = {
      Accept: 'application/json',
      'Content-Type': contentType,
      ...(customHeaders as Record<string, string> | undefined),
    };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(methodUpper)) {
      const csrf = getClientCsrf();
      if (csrf) headers['X-CSRF-Token'] = csrf;
    }
  } else {
    headers = await buildServerHeaders(methodUpper, contentType, customHeaders);
  }

  const finalBody: BodyInit | undefined = rawBody ?? (body ? JSON.stringify(body) : undefined);

  const res = await fetch(url, {
    ...rest,
    method: methodUpper,
    headers,
    body: finalBody,
    credentials: 'include',
    cache: 'no-store',
  });

  if (res.status === 204) return null as T;

  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (isJson && payload && typeof payload === 'object' && 'detail' in payload
        ? String((payload as { detail: unknown }).detail)
        : undefined) ||
      (isJson && payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : undefined) ||
      `HTTP ${res.status}`;
    throw new DashboardApiException(message, res.status, payload);
  }

  return payload as T;
}

export const dashboardApi = {
  get: <T>(endpoint: string, options?: Omit<DashboardFetchOptions, 'method' | 'body'>) =>
    dashboardFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: Omit<DashboardFetchOptions, 'method'>) =>
    dashboardFetch<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown, options?: Omit<DashboardFetchOptions, 'method'>) =>
    dashboardFetch<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<DashboardFetchOptions, 'method'>) =>
    dashboardFetch<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T>(endpoint: string, options?: Omit<DashboardFetchOptions, 'method' | 'body'>) =>
    dashboardFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
