import { join, resolve, normalize } from "path";
import { todoRoutes } from "./routes/todos";

const PUBLIC_DIR = resolve("./public");

// 안전한 정적 파일 서빙 함수
async function serveStatic(
  requestPath: string,
  options: { download?: boolean } = {}
): Promise<Response> {
  const safePath = normalize(requestPath).replace(/^(\.\.[\/\\])+/, "");
  const fullPath = join(PUBLIC_DIR, safePath);

  if (!fullPath.startsWith(PUBLIC_DIR)) {
    return new Response("접근이 거부되었습니다", { status: 403 });
  }

  const file = Bun.file(fullPath);

  if (!(await file.exists())) {
    return new Response("파일을 찾을 수 없습니다", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=3600",
  };

  if (options.download) {
    const filename = safePath.split("/").pop() || "download";
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }

  return new Response(file, { headers });
}

const server = Bun.serve({
  port: process.env.PORT || 3000,
  development: process.env.NODE_ENV !== "production",

  routes: {
    // 루트 - API 정보
    "/": () => Response.json({
      name: "BunDo API",
      version: "1.0.0",
    }),

    // 정적 파일 서빙
    "/static/*": (request) => {
      const url = new URL(request.url);
      const filePath = url.pathname.replace("/static/", "");
      return serveStatic(filePath);
    },

    // 헬스 체크
    "/health": () => Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),

    // 할 일 API
    ...todoRoutes,
  },

  fetch(request) {
    return Response.json({ error: "경로를 찾을 수 없습니다" }, { status: 404 });
  },
});

console.log(`BunDo API 서버가 http://localhost:${server.port}에서 실행 중입니다`);
