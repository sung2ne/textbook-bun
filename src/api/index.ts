// src/api/index.ts - API 라우터 통합
import { initDatabase } from "../db";
import { todoRoutes } from "./todos";

export function createServer() {
  initDatabase();

  return Bun.serve({
    port: Number(Bun.env.PORT) || 3000,

    routes: {
      "GET /health": () => Response.json({ status: "ok", version: "1.0.0" }),

      // 할 일 API (X-User-Id 임시 인증)
      "GET /todos": todoRoutes.list,
      "POST /todos": todoRoutes.create,
      "GET /todos/:id": todoRoutes.get,
      "PATCH /todos/:id": todoRoutes.update,
      "DELETE /todos/:id": todoRoutes.delete,
      "PATCH /todos/:id/toggle": todoRoutes.toggle,
    },

    fetch(req) {
      return Response.json(
        { success: false, error: { code: "NOT_FOUND", message: "Route not found" } },
        { status: 404 }
      );
    },
  });
}
