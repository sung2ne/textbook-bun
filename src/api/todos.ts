// src/api/todos.ts - 할 일 CRUD API
import { successResponse, notFound, unauthorized, badRequest } from "../lib/response";
import { verifyRequest } from "../lib/auth";
import * as todoDb from "../db/todos";
import type { CreateTodoInput, UpdateTodoInput } from "../db/schema";

export const todoRoutes = {
  // GET /todos - 할 일 목록 조회
  async list(req: Request): Promise<Response> {
    const user = await verifyRequest(req);
    if (!user) {
      return unauthorized();
    }

    const todos = todoDb.findByUserId(user.id);
    const counts = todoDb.countByUserId(user.id);

    return successResponse(todos, 200, {
      total: counts.total,
      completed: counts.completed,
      pending: counts.total - counts.completed,
    });
  },

  // GET /todos/:id - 할 일 상세 조회
  async get(req: Request): Promise<Response> {
    const user = await verifyRequest(req);
    if (!user) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (isNaN(id)) {
      return badRequest("유효하지 않은 ID입니다.");
    }

    const record = todoDb.findById(id);

    if (!record || record.user_id !== user.id) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    const todo = {
      id: record.id,
      userId: record.user_id,
      title: record.title,
      description: record.description,
      completed: record.completed === 1,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };

    return successResponse(todo);
  },

  // POST /todos - 할 일 생성
  async create(req: Request): Promise<Response> {
    const user = await verifyRequest(req);
    if (!user) {
      return unauthorized();
    }

    let body: { title?: string; description?: string };
    try {
      body = await req.json();
    } catch {
      return badRequest("유효하지 않은 JSON입니다.");
    }

    if (!body.title || body.title.trim() === "") {
      return badRequest("제목은 필수입니다.", { field: "title" });
    }

    if (body.title.length > 200) {
      return badRequest("제목은 200자 이하여야 합니다.", { field: "title" });
    }

    const input: CreateTodoInput = {
      userId: user.id,
      title: body.title.trim(),
      description: body.description?.trim() || null,
    };

    const todo = todoDb.create(input);
    return successResponse(todo, 201);
  },

  // PATCH /todos/:id - 할 일 수정
  async update(req: Request): Promise<Response> {
    const user = await verifyRequest(req);
    if (!user) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (isNaN(id)) {
      return badRequest("유효하지 않은 ID입니다.");
    }

    const existing = todoDb.findById(id);
    if (!existing || existing.user_id !== user.id) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    let body: { title?: string; description?: string; completed?: boolean };
    try {
      body = await req.json();
    } catch {
      return badRequest("유효하지 않은 JSON입니다.");
    }

    if (body.title !== undefined && body.title.trim() === "") {
      return badRequest("제목은 비어있을 수 없습니다.", { field: "title" });
    }

    const input: UpdateTodoInput = {};
    if (body.title !== undefined) input.title = body.title.trim();
    if (body.description !== undefined) input.description = body.description?.trim() || null;
    if (body.completed !== undefined) input.completed = body.completed;

    const todo = todoDb.update(id, input);
    if (!todo) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    return successResponse(todo);
  },

  // DELETE /todos/:id - 할 일 삭제
  async delete(req: Request): Promise<Response> {
    const user = await verifyRequest(req);
    if (!user) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (isNaN(id)) {
      return badRequest("유효하지 않은 ID입니다.");
    }

    const existing = todoDb.findById(id);
    if (!existing || existing.user_id !== user.id) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    const deleted = todoDb.remove(id);
    if (!deleted) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    return successResponse({ deleted: true });
  },

  // PATCH /todos/:id/toggle - 완료 상태 토글
  async toggle(req: Request): Promise<Response> {
    const user = await verifyRequest(req);
    if (!user) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const id = Number(parts[parts.length - 2]); // /todos/:id/toggle에서 id 추출

    if (isNaN(id)) {
      return badRequest("유효하지 않은 ID입니다.");
    }

    const existing = todoDb.findById(id);
    if (!existing || existing.user_id !== user.id) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    const todo = todoDb.toggleCompleted(id);
    if (!todo) {
      return notFound("할 일을 찾을 수 없습니다.");
    }

    return successResponse(todo);
  },
};
