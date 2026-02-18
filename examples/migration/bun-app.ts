// examples/migration/bun-app.ts - 마이그레이션 후: Bun.serve fetch 방식
const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    // GET /
    if (req.method === "GET" && url.pathname === "/") {
      return Response.json({ message: "Hello!" });
    }

    // GET /users/:id
    if (req.method === "GET" && url.pathname.startsWith("/users/")) {
      const id = url.pathname.split("/")[2];
      return Response.json({ userId: id });
    }

    // POST /users
    if (req.method === "POST" && url.pathname === "/users") {
      const body = await req.json();
      return Response.json(body, { status: 201 });
    }

    // 404
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on ${server.url}`);
