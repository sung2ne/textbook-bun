import * as todoStore from "../lib/todoStore";
import { NotFoundError, BadRequestError, ValidationError } from "../lib/errors";
import type { CreateTodoRequest, UpdateTodoRequest } from "../types";

// ID 파라미터 파싱 헬퍼
function parseId(idStr: string): number {
  const id = parseInt(idStr, 10);
  if (isNaN(id)) throw new BadRequestError("유효하지 않은 ID입니다");
  return id;
}

export const todoRoutes = {
  "/api/todos": {
    GET: () => {
      const todos = todoStore.findAll();
      return Response.json(todos);
    },

    POST: async (request: Request) => {
      let body: CreateTodoRequest;
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }

      const errors: string[] = [];
      if (!body.title) {
        errors.push("title은 필수입니다");
      } else if (typeof body.title !== "string") {
        errors.push("title은 문자열이어야 합니다");
      } else if (body.title.trim().length === 0) {
        errors.push("title은 비어있을 수 없습니다");
      }

      if (errors.length > 0) throw new ValidationError(errors);

      const todo = todoStore.create({ title: body.title.trim() });
      return Response.json(todo, { status: 201 });
    },
  },

  "/api/todos/:id": {
    GET: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const todo = todoStore.findById(id);
      if (!todo) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return Response.json(todo);
    },

    PUT: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      let body: UpdateTodoRequest;
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }
      const updated = todoStore.update(id, body);
      if (!updated) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return Response.json(updated);
    },

    PATCH: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      let body: UpdateTodoRequest;
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }
      const updated = todoStore.update(id, body);
      if (!updated) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return Response.json(updated);
    },

    DELETE: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const deleted = todoStore.remove(id);
      if (!deleted) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return new Response(null, { status: 204 });
    },
  },
};
