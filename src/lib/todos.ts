import { db } from "../db";
import { todos, categories, Todo, Category } from "../db/schema";
import { eq, desc, asc, ilike, and, SQL } from "drizzle-orm";

export type { Todo, Category };

export async function getAllTodos(): Promise<Todo[]> {
  return await db
    .select()
    .from(todos)
    .orderBy(asc(todos.sortOrder), desc(todos.createdAt));
}

export async function getTodoById(id: number): Promise<Todo | undefined> {
  const [todo] = await db
    .select()
    .from(todos)
    .where(eq(todos.id, id));

  return todo;
}

export async function createTodo(title: string): Promise<Todo> {
  const [todo] = await db
    .insert(todos)
    .values({ title })
    .returning();

  return todo;
}

export async function updateTodo(
  id: number,
  title: string,
  completed: boolean
): Promise<Todo | undefined> {
  const [todo] = await db
    .update(todos)
    .set({ title, completed, updatedAt: new Date() })
    .where(eq(todos.id, id))
    .returning();

  return todo;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const result = await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning({ id: todos.id });

  return result.length > 0;
}

export async function toggleTodo(id: number): Promise<Todo | undefined> {
  const existing = await getTodoById(id);
  if (!existing) return undefined;

  const [todo] = await db
    .update(todos)
    .set({ completed: !existing.completed, updatedAt: new Date() })
    .where(eq(todos.id, id))
    .returning();

  return todo;
}

interface SearchParams {
  completed?: boolean;
  search?: string;
  limit?: number;
}

export async function searchTodos(params: SearchParams): Promise<Todo[]> {
  const { completed, search, limit = 10 } = params;

  const conditions: SQL[] = [];

  if (completed !== undefined) {
    conditions.push(eq(todos.completed, completed));
  }

  if (search) {
    conditions.push(ilike(todos.title, `%${search}%`));
  }

  return await db
    .select()
    .from(todos)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)
    .orderBy(desc(todos.createdAt));
}

// 할 일과 카테고리 함께 조회
export async function getTodosWithCategory() {
  return await db.query.todos.findMany({
    with: {
      category: true,
    },
    orderBy: (todos, { asc, desc }) => [asc(todos.sortOrder), desc(todos.createdAt)],
  });
}

// 특정 카테고리의 할 일만 조회
export async function getTodosByCategory(categoryId: number) {
  return await db.query.todos.findMany({
    where: eq(todos.categoryId, categoryId),
    with: {
      category: true,
    },
  });
}

// 할 일 순서 변경
export async function reorderTodos(
  orderedIds: number[]
): Promise<{ success: boolean; count: number }> {
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(todos)
        .set({ sortOrder: i })
        .where(eq(todos.id, orderedIds[i]));
    }
  });
  return { success: true, count: orderedIds.length };
}

// 여러 할 일 일괄 삭제
export async function deleteMultipleTodos(
  ids: number[]
): Promise<{ deletedCount: number }> {
  let deletedCount = 0;
  await db.transaction(async (tx) => {
    for (const id of ids) {
      const result = await tx
        .delete(todos)
        .where(eq(todos.id, id))
        .returning({ id: todos.id });
      deletedCount += result.length;
    }
  });
  return { deletedCount };
}

// 할 일 일괄 완료 처리
export async function completeMultipleTodos(
  ids: number[]
): Promise<{ completedCount: number }> {
  let completedCount = 0;
  await db.transaction(async (tx) => {
    for (const id of ids) {
      const result = await tx
        .update(todos)
        .set({ completed: true, updatedAt: new Date() })
        .where(eq(todos.id, id))
        .returning({ id: todos.id });
      completedCount += result.length;
    }
  });
  return { completedCount };
}

// 카테고리 CRUD
export async function getAllCategories(): Promise<Category[]> {
  return await db.select().from(categories).orderBy(asc(categories.id));
}

export async function createCategory(
  name: string,
  color?: string
): Promise<Category> {
  const [category] = await db
    .insert(categories)
    .values({ name, color })
    .returning();
  return category;
}

export async function getCategoriesWithTodos() {
  return await db.query.categories.findMany({
    with: {
      todos: true,
    },
  });
}

// 트랜잭션으로 할 일과 카테고리 함께 생성
export async function createTodoWithCategory(
  todoTitle: string,
  categoryName: string
) {
  return await db.transaction(async (tx) => {
    const [category] = await tx
      .insert(categories)
      .values({ name: categoryName })
      .returning();

    const [todo] = await tx
      .insert(todos)
      .values({ title: todoTitle, categoryId: category.id })
      .returning();

    return { todo, category };
  });
}
