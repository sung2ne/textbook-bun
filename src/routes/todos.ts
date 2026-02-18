import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  reorderTodos,
  deleteMultipleTodos,
  completeMultipleTodos,
  getTodosWithCategory,
  searchTodos,
} from "../lib/todos";
import { NotFoundError, BadRequestError, ValidationError } from "../lib/errors";

function parseId(idStr: string): number {
  const id = parseInt(idStr, 10);
  if (isNaN(id)) throw new BadRequestError("유효하지 않은 ID입니다");
  return id;
}

export const todoRoutes = {
  "/api/todos": {
    GET: async (request: Request) => {
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? undefined;
      const completedParam = url.searchParams.get("completed");
      const withCategory = url.searchParams.get("with_category") === "true";

      if (search || completedParam !== null) {
        const completed =
          completedParam === "true"
            ? true
            : completedParam === "false"
            ? false
            : undefined;
        const todos = await searchTodos({ search, completed });
        return Response.json(todos);
      }

      if (withCategory) {
        const todos = await getTodosWithCategory();
        return Response.json(todos);
      }

      const todos = await getAllTodos();
      return Response.json(todos);
    },

    POST: async (request: Request) => {
      let body: { title?: string; categoryId?: number };
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

      const todo = await createTodo(body.title!.trim());
      return Response.json(todo, { status: 201 });
    },
  },

  "/api/todos/:id": {
    GET: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const todo = await getTodoById(id);
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

      const existing = await getTodoById(id);
      if (!existing) throw new NotFoundError("할 일을 찾을 수 없습니다");

      const updated = await updateTodo(
        id,
        body.title ?? existing.title,
        body.completed ?? Boolean(existing.completed)
      );
      return Response.json(updated);
    },

    DELETE: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const deleted = await deleteTodo(id);
      if (!deleted) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return new Response(null, { status: 204 });
    },
  },

  "/api/todos/:id/toggle": {
    PATCH: async (request: Request & { params: { id: string } }) => {
      const id = parseId(request.params.id);
      const todo = await toggleTodo(id);
      if (!todo) throw new NotFoundError("할 일을 찾을 수 없습니다");
      return Response.json(todo);
    },
  },

  "/api/todos/reorder": {
    PATCH: async (request: Request) => {
      let body: { ids?: number[] };
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }

      if (!Array.isArray(body.ids) || body.ids.length === 0) {
        throw new BadRequestError("ids는 비어있지 않은 배열이어야 합니다");
      }

      const result = await reorderTodos(body.ids);
      return Response.json(result);
    },
  },

  "/api/todos/bulk-delete": {
    DELETE: async (request: Request) => {
      let body: { ids?: number[] };
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }

      if (!Array.isArray(body.ids) || body.ids.length === 0) {
        throw new BadRequestError("ids는 비어있지 않은 배열이어야 합니다");
      }

      const result = await deleteMultipleTodos(body.ids);
      return Response.json(result);
    },
  },

  "/api/todos/bulk-complete": {
    PATCH: async (request: Request) => {
      let body: { ids?: number[] };
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }

      if (!Array.isArray(body.ids) || body.ids.length === 0) {
        throw new BadRequestError("ids는 비어있지 않은 배열이어야 합니다");
      }

      const result = await completeMultipleTodos(body.ids);
      return Response.json(result);
    },
  },
};
