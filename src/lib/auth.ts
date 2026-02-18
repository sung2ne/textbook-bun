// src/lib/auth.ts - 임시 인증 (PART 11 챕터 04까지 사용)
// 챕터 05에서 JWT 인증으로 교체됩니다.

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

// 임시 인증 함수 (X-User-Id 헤더 기반)
export async function verifyRequest(req: Request): Promise<AuthUser | null> {
  const userId = req.headers.get("X-User-Id");

  if (!userId || isNaN(Number(userId))) {
    return null;
  }

  // 실제로는 DB에서 사용자 조회 (현재는 하드코딩)
  return {
    id: Number(userId),
    email: "user@example.com",
    name: "Test User",
  };
}
