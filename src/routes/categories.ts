import {
  getAllCategories,
  createCategory,
  getCategoriesWithTodos,
  getTodosByCategory,
} from "../lib/todos";
import { BadRequestError, ValidationError } from "../lib/errors";

export const categoryRoutes = {
  "/api/categories": {
    GET: async (request: Request) => {
      const url = new URL(request.url);
      const withTodos = url.searchParams.get("with_todos") === "true";

      if (withTodos) {
        const categories = await getCategoriesWithTodos();
        return Response.json(categories);
      }

      const categories = await getAllCategories();
      return Response.json(categories);
    },

    POST: async (request: Request) => {
      let body: { name?: string; color?: string };
      try {
        body = await request.json();
      } catch {
        throw new BadRequestError("잘못된 JSON 형식입니다");
      }

      const errors: string[] = [];
      if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
        errors.push("name은 필수 문자열입니다");
      }

      if (errors.length > 0) throw new ValidationError(errors);

      const category = await createCategory(body.name!.trim(), body.color);
      return Response.json(category, { status: 201 });
    },
  },

  "/api/categories/:id/todos": {
    GET: async (request: Request & { params: { id: string } }) => {
      const id = parseInt(request.params.id, 10);
      if (isNaN(id)) throw new BadRequestError("유효하지 않은 ID입니다");
      const todos = await getTodosByCategory(id);
      return Response.json(todos);
    },
  },
};
