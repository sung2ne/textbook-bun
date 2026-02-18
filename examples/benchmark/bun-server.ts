// examples/benchmark/bun-server.ts - Bun HTTP 서버 벤치마크용
// 실행: bun run bun-server.ts
Bun.serve({
  port: 3000,
  fetch(req) {
    return Response.json({ message: "Hello from Bun" });
  },
});
