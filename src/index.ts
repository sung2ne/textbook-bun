import { userRoutes } from "./routes/users";
import { postRoutes } from "./routes/posts";

const server = Bun.serve({
  port: process.env.PORT || 3000,
  development: process.env.NODE_ENV !== "production",

  routes: {
    "/": new Response("BunDo API Server", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }),
    "/health": () => Response.json({ status: "ok", timestamp: new Date().toISOString() }),

    // 스프레드 연산자로 라우트 병합
    ...userRoutes,
    ...postRoutes,
  },

  fetch(request) {
    return Response.json({ error: "Not Found" }, { status: 404 });
  },
});

console.log(`BunDo 서버가 http://localhost:${server.port}에서 실행 중입니다`);
