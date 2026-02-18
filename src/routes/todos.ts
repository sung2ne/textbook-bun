import * as todoStore from "../lib/todoStore";
import { validateCreateTodo, validateUpdateTodo } from "../lib/validator";
import type { CreateTodoRequest, UpdateTodoRequest } from "../types";

// ID 파라미터 파싱 헬퍼
function parseId(idStr: string): number | null {
  const id = parseInt(idStr, 10);
  return isNaN(id) ? null : id;
}

// 할 일 목록 라우트
export const todoRoutes = {
  "/api/todos": {
    // GET /api/todos - 전체 목록 조회
    GET: () => {
      const todos = todoStore.findAll();
      return Response.json(todos);
    },

    // POST /api/todos - 새 할 일 생성
    POST: async (request: Request) => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "잘못된 JSON 형식입니다" }, { status: 400 });
      }

      const validation = validateCreateTodo(body);
      if (!validation.valid) {
        return Response.json({ errors: validation.errors }, { status: 400 });
      }

      const todo = todoStore.create(body as CreateTodoRequest);
      return Response.json(todo, { status: 201 });
    },
  },

  "/api/todos/:id": {
    // GET /api/todos/:id - 단일 조회
    GET: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      if (id === null) {
        return Response.json({ error: "유효하지 않은 ID입니다" }, { status: 400 });
      }

      const todo = todoStore.findById(id);
      if (!todo) {
        return Response.json({ error: "할 일을 찾을 수 없습니다" }, { status: 404 });
      }

      return Response.json(todo);
    },

    // PUT /api/todos/:id - 수정
    PUT: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      if (id === null) {
        return Response.json({ error: "유효하지 않은 ID입니다" }, { status: 400 });
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "잘못된 JSON 형식입니다" }, { status: 400 });
      }

      const validation = validateUpdateTodo(body);
      if (!validation.valid) {
        return Response.json({ errors: validation.errors }, { status: 400 });
      }

      const updated = todoStore.update(id, body as UpdateTodoRequest);
      if (!updated) {
        return Response.json({ error: "할 일을 찾을 수 없습니다" }, { status: 404 });
      }

      return Response.json(updated);
    },

    // PATCH /api/todos/:id - 부분 수정
    PATCH: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      if (id === null) {
        return Response.json({ error: "유효하지 않은 ID입니다" }, { status: 400 });
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "잘못된 JSON 형식입니다" }, { status: 400 });
      }

      const updated = todoStore.update(id, body as UpdateTodoRequest);
      if (!updated) {
        return Response.json({ error: "할 일을 찾을 수 없습니다" }, { status: 404 });
      }
      return Response.json(updated);
    },

    // DELETE /api/todos/:id - 삭제
    DELETE: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      if (id === null) {
        return Response.json({ error: "유효하지 않은 ID입니다" }, { status: 400 });
      }

      const deleted = todoStore.remove(id);
      if (!deleted) {
        return Response.json({ error: "할 일을 찾을 수 없습니다" }, { status: 404 });
      }

      return new Response(null, { status: 204 });
    },
  },
};
