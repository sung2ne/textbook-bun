import { serializeCookie, getCookie } from "./cookie";

// 세션 데이터 타입
export interface SessionData {
  userId?: number;
  username?: string;
  createdAt: number;
  [key: string]: unknown;
}

// 세션 저장소 (메모리)
const sessions = new Map<string, SessionData>();

// 세션 ID 생성
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 세션 생성
export function createSession(data: Omit<SessionData, "createdAt">): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    ...data,
    createdAt: Date.now(),
  });
  return sessionId;
}

// 세션 조회
export function getSession(sessionId: string): SessionData | null {
  return sessions.get(sessionId) || null;
}

// 세션 업데이트
export function updateSession(sessionId: string, data: Partial<SessionData>): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  sessions.set(sessionId, { ...session, ...data });
  return true;
}

// 세션 삭제
export function destroySession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

// 요청에서 세션 가져오기
export function getSessionFromRequest(request: Request): SessionData | null {
  const sessionId = getCookie(request, "sessionId");
  if (!sessionId) return null;
  return getSession(sessionId);
}

// 세션 쿠키 생성
export function createSessionCookie(sessionId: string): string {
  return serializeCookie("sessionId", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24,  // 24시간
  });
}

// 세션 만료 처리
export function cleanExpiredSessions(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > maxAgeMs) {
      sessions.delete(id);
    }
  }
}
