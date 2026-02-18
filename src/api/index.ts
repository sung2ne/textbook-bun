// src/api/index.ts - API 라우터 통합
import { initDatabase, getDatabase } from "../db";
import { todoRoutes } from "./todos";
import { authRoutes } from "./auth";
import { docsRoutes } from "./docs";

export function createServer() {
  initDatabase();

  return Bun.serve({
    port: Number(Bun.env.PORT) || 3000,

    routes: {
      "GET /health": () => Response.json({ status: "ok", version: "1.0.0" }),
      "GET /health/ready": () => {
        try {
          getDatabase().prepare("SELECT 1").all();
          return new Response("Ready", { status: 200 });
        } catch {
          return new Response("Not Ready", { status: 503 });
        }
      },
      "GET /health/live": () => new Response("Alive", { status: 200 }),

      // 인증 라우트 (인증 불필요)
      "POST /auth/register": authRoutes.register,
      "POST /auth/login": authRoutes.login,
      "POST /auth/refresh": authRoutes.refresh,

      // 할 일 API (JWT 인증 필요)
      "GET /todos": todoRoutes.list,
      "POST /todos": todoRoutes.create,
      "GET /todos/:id": todoRoutes.get,
      "PATCH /todos/:id": todoRoutes.update,
      "DELETE /todos/:id": todoRoutes.delete,
      "PATCH /todos/:id/toggle": todoRoutes.toggle,

      // API 문서
      "GET /docs": docsRoutes.ui,
      "GET /docs/openapi.yaml": docsRoutes.spec,
    },

    fetch(req) {
      return Response.json(
        { success: false, error: { code: "NOT_FOUND", message: "Route not found" } },
        { status: 404 }
      );
    },
  });
}
