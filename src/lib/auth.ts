// src/lib/auth.ts - JWT 인증 유틸리티

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

const JWT_SECRET = Bun.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRES_IN = Number(Bun.env.JWT_EXPIRES_IN) || 3600; // 1시간
const JWT_REFRESH_EXPIRES_IN = 60 * 60 * 24 * 7; // 7일

// Base64 URL 인코딩/디코딩
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// HMAC-SHA256 서명 생성
async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

// JWT 생성
export async function generateToken(
  user: AuthUser,
  expiresIn: number = JWT_EXPIRES_IN
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + expiresIn,
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(`${headerEncoded}.${payloadEncoded}`, JWT_SECRET);

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

// Access Token 생성
export async function generateAccessToken(user: AuthUser): Promise<string> {
  return generateToken(user, JWT_EXPIRES_IN);
}

// Refresh Token 생성
export async function generateRefreshToken(user: AuthUser): Promise<string> {
  return generateToken(user, JWT_REFRESH_EXPIRES_IN);
}

// JWT 검증 (토큰 문자열) - verifyToken과 같은 함수
export async function verifyJWT(token: string): Promise<JwtPayload | null> {
  return verifyToken(token);
}

// JWT 검증 (토큰 문자열)
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureProvided] = parts;
    const expectedSignature = await sign(`${headerEncoded}.${payloadEncoded}`, JWT_SECRET);

    if (signatureProvided !== expectedSignature) return null;

    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

// 요청에서 사용자 정보 추출 (Authorization: Bearer <token>)
export async function verifyRequest(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);
  if (!payload) return null;

  return { id: payload.userId, email: payload.email, name: payload.name };
}

// 비밀번호 해싱 (Bun 내장 Argon2id)
export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 65536,
    timeCost: 2,
  });
}

// 비밀번호 검증
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash);
}
