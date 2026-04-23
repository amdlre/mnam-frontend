import { cookies } from 'next/headers';

interface ParsedCookie {
  name: string;
  value: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

function parseSetCookie(header: string): ParsedCookie | null {
  const parts = header.split(';').map((p) => p.trim());
  const first = parts.shift();
  if (!first) return null;
  const eq = first.indexOf('=');
  if (eq === -1) return null;
  const name = first.slice(0, eq).trim();
  const value = first.slice(eq + 1).trim();
  const cookie: ParsedCookie = { name, value };
  for (const attr of parts) {
    const [rawKey, ...rest] = attr.split('=');
    const key = rawKey.trim().toLowerCase();
    const val = rest.join('=').trim();
    if (key === 'max-age') cookie.maxAge = Number(val);
    else if (key === 'expires') cookie.expires = new Date(val);
    else if (key === 'path') cookie.path = val;
    else if (key === 'httponly') cookie.httpOnly = true;
    else if (key === 'secure') cookie.secure = true;
    else if (key === 'samesite') {
      const s = val.toLowerCase();
      if (s === 'strict' || s === 'lax' || s === 'none') cookie.sameSite = s;
    }
  }
  return cookie;
}

/**
 * Some runtimes split Set-Cookie into one header; others provide `getSetCookie()`.
 * This handles both.
 */
function readSetCookies(response: Response): string[] {
  const anyHeaders = response.headers as unknown as { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === 'function') return anyHeaders.getSetCookie();
  const raw = response.headers.get('set-cookie');
  if (!raw) return [];
  return raw.split(/,(?=\s*\w+=)/).map((s) => s.trim());
}

/**
 * Copy all Set-Cookie headers from a backend `fetch` response into the Next.js
 * cookie store. Used by the dashboard login Server Action so that subsequent
 * server-side requests (middleware + fetcher cookie forwarding) see the
 * authenticated session.
 */
export async function forwardBackendCookies(response: Response): Promise<void> {
  const set = readSetCookies(response);
  if (!set.length) return;
  const store = await cookies();

  const isProd = process.env.NODE_ENV === 'production';

  for (const line of set) {
    const parsed = parseSetCookie(line);
    if (!parsed) continue;

    // In dev (HTTP localhost) browsers drop cookies that still carry the
    // backend's `SameSite=None; Secure` flags. Relax them so the cookie
    // round-trips; keep the originals in production.
    const secure = isProd ? (parsed.secure ?? true) : false;
    const sameSite = isProd ? (parsed.sameSite ?? 'lax') : 'lax';

    store.set(parsed.name, parsed.value, {
      path: parsed.path ?? '/',
      maxAge: parsed.maxAge,
      expires: parsed.expires,
      httpOnly: parsed.httpOnly,
      secure,
      sameSite,
    });
  }
}
