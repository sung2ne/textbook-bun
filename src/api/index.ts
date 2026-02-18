// src/api/index.ts - API 라우터 통합
// 챕터 02: 기본 구조 (데이터베이스 연동은 챕터 03에서)
import { initDatabase } from "../db";

export function createServer() {
  initDatabase();

  return Bun.serve({
    port: Number(Bun.env.PORT) || 3000,

    routes: {
      "GET /health": () => Response.json({ status: "ok", version: "1.0.0" }),
    },

    // 매칭되지 않는 라우트
    fetch(req) {
      return Response.json(
        { success: false, error: { code: "NOT_FOUND", message: "Route not found" } },
        { status: 404 }
      );
    },
  });
}
