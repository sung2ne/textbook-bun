// examples/migration/bun-app-routes.ts - Bun.serve routes API 방식 (권장)
const server = Bun.serve({
  port: 3000,

  routes: {
    // GET /
    "/": () => Response.json({ message: "Hello!" }),

    // GET /users/:id (동적 경로)
    "/users/:id": (req) => {
      return Response.json({ userId: req.params.id });
    },

    // HTTP 메서드별 핸들러
    "/users": {
      GET: () => Response.json({ users: [] }),
      POST: async (req) => {
        const body = await req.json();
        return Response.json(body, { status: 201 });
      },
    },
  },

  // 매치되지 않는 경로의 폴백
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on ${server.url}`);
