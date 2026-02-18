// 쿠키 문자열을 객체로 파싱
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  const cookies: Record<string, string> = {};

  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name) {
      cookies[name.trim()] = decodeURIComponent(valueParts.join("="));
    }
  });

  return cookies;
}

// 특정 쿠키 값 가져오기
export function getCookie(request: Request, name: string): string | undefined {
  const cookies = parseCookies(request.headers.get("cookie"));
  return cookies[name];
}

export interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

// Set-Cookie 헤더 값 생성
export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.path) parts.push(`Path=${options.path}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  return parts.join("; ");
}

// 쿠키 삭제용 헤더 생성
export function deleteCookie(name: string, path: string = "/"): string {
  return `${name}=; Path=${path}; Max-Age=0`;
}
