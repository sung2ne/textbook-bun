const server = Bun.serve({
  port: process.env.PORT || 3000,
  development: process.env.NODE_ENV !== "production",

  fetch(request) {
    const url = new URL(request.url);

    // 루트 경로
    if (url.pathname === "/") {
      return new Response("BunDo API Server", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // 상태 확인 엔드포인트
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        timestamp: new Date().toISOString()
      });
    }

    // 404 처리
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`BunDo 서버가 http://localhost:${server.port}에서 실행 중입니다`);
