import { join, resolve, normalize } from "path";
import { todoRoutes } from "./routes/todos";
import { wrapRoutes } from "./lib/wrapHandler";
import { handleError } from "./lib/errorHandler";
import {
  createSession,
  destroySession,
  getSessionFromRequest,
  createSessionCookie,
  cleanExpiredSessions,
} from "./lib/session";
import { deleteCookie } from "./lib/cookie";

const PUBLIC_DIR = resolve("./public");

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

const users = [
  { id: 1, username: "alice", password: "password123" },
  { id: 2, username: "bob", password: "secret456" },
];

const server = Bun.serve({
  port: process.env.PORT || 3000,
  development: process.env.NODE_ENV !== "production",

  routes: {
    "/": () => Response.json({
      name: "BunDo API",
      version: "1.0.0",
    }),

    "/static/*": (request) => {
      const url = new URL(request.url);
      const filePath = url.pathname.replace("/static/", "");
      return serveStatic(filePath);
    },

    "/health": () => Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),

    "/api/auth/login": {
      POST: async (request) => {
        const body = await request.json();
        const { username, password } = body;

        const user = users.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) {
          return Response.json(
            { error: "아이디 또는 비밀번호가 일치하지 않습니다" },
            { status: 401 }
          );
        }

        const sessionId = createSession({
          userId: user.id,
          username: user.username,
        });

        return new Response(
          JSON.stringify({
            message: "로그인 성공",
            user: { id: user.id, username: user.username },
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": createSessionCookie(sessionId),
            },
          }
        );
      },
    },

    "/api/auth/logout": {
      POST: (request) => {
        const session = getSessionFromRequest(request);
        if (session) {
          const sessionId = request.headers.get("cookie")?.match(/sessionId=([^;]+)/)?.[1];
          if (sessionId) destroySession(sessionId);
        }
        return new Response(JSON.stringify({ message: "로그아웃 성공" }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": deleteCookie("sessionId"),
          },
        });
      },
    },

    "/api/auth/me": (request) => {
      const session = getSessionFromRequest(request);
      if (!session) {
        return Response.json({ error: "로그인이 필요합니다" }, { status: 401 });
      }
      return Response.json({ userId: session.userId, username: session.username });
    },

    // 에러 핸들링이 적용된 할 일 API
    ...wrapRoutes(todoRoutes),
  },

  fetch(request) {
    return Response.json({ error: "경로를 찾을 수 없습니다" }, { status: 404 });
  },

  error(error) {
    console.error("서버 에러:", error);
    return handleError(error);
  },
});

setInterval(() => {
  cleanExpiredSessions();
}, 60 * 60 * 1000);

console.log(`BunDo API 서버가 http://localhost:${server.port}에서 실행 중입니다`);
