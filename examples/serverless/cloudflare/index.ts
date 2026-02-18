// examples/serverless/cloudflare/index.ts - Cloudflare Workers 예제
// Bun과 유사한 Web 표준 API 사용
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 라우팅
    if (url.pathname === "/") {
      return new Response("Welcome to BunDo API!");
    }

    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }

    if (url.pathname.startsWith("/api/todos")) {
      return handleTodos(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleTodos(request: Request, env: Env): Promise<Response> {
  // KV 스토리지 사용
  if (request.method === "GET") {
    const todos = await env.TODOS.get("todos", "json");
    return Response.json(todos || []);
  }

  if (request.method === "POST") {
    const body = await request.json();
    const todos = ((await env.TODOS.get("todos", "json")) as unknown[]) || [];
    const newTodo = { id: Date.now(), ...body };
    todos.push(newTodo);
    await env.TODOS.put("todos", JSON.stringify(todos));
    return Response.json(newTodo, { status: 201 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

interface KVNamespace {
  get(key: string, type: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  TODOS: KVNamespace;
}
