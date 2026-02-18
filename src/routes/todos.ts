import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "../lib/todos";
import { NotFoundError, BadRequestError, ValidationError } from "../lib/errors";

function parseId(idStr: string): number {
  const id = parseInt(idStr, 10);
  if (isNaN(id)) throw new BadRequestError("유효하지 않은 ID입니다");
  return id;
}

export const todoRoutes = {
  "/api/todos": {
    GET: () => {
      const todos = getAllTodos();
      return Response.json(todos);
    },

    POST: async (request: Request) => {
      let body: { title?: string };
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

      const todo = createTodo(body.title!.trim());
      return Response.json(todo, { status: 201 });
    },
  },

  "/api/todos/:id": {
    GET: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const todo = getTodoById(id);
      if (!todo) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return Response.json(todo);
    },

    PUT: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      let body: { title?: string; completed?: boolean };
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }

      const existing = getTodoById(id);
      if (!existing) throw new NotFoundError("할 일을 찾을 수 없습니다");

      const updated = updateTodo(
        id,
        body.title ?? existing.title,
        body.completed ?? Boolean(existing.completed)
      );
      return Response.json(updated);
    },

    DELETE: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const deleted = deleteTodo(id);
      if (!deleted) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return new Response(null, { status: 204 });
    },
  },

  "/api/todos/:id/toggle": {
    PATCH: (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const todo = toggleTodo(id);
      if (!todo) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return Response.json(todo);
    },
  },
};
