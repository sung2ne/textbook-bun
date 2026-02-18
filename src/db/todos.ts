// src/db/todos.ts - 할 일 저장소
import { getDatabase } from "./index";
import type { TodoRecord, Todo, CreateTodoInput, UpdateTodoInput } from "./schema";
import { toTodo } from "./schema";

export function findByUserId(userId: number): Todo[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM todos
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);
  const records = stmt.all(userId) as TodoRecord[];
  return records.map(toTodo);
}

export function findById(id: number): TodoRecord | null {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
  return stmt.get(id) as TodoRecord | null;
}

export function create(input: CreateTodoInput): Todo {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO todos (user_id, title, description)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(input.userId, input.title, input.description || null);
  const insertedId = Number(result.lastInsertRowid);

  const record = findById(insertedId);
  if (!record) {
    throw new Error("할 일 생성에 실패했습니다.");
  }

  return toTodo(record);
}

export function update(id: number, input: UpdateTodoInput): Todo | null {
  const db = getDatabase();
  const record = findById(id);
  if (!record) return null;

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.title !== undefined) {
    updates.push("title = ?");
    values.push(input.title);
  }
  if (input.description !== undefined) {
    updates.push("description = ?");
    values.push(input.description);
  }
  if (input.completed !== undefined) {
    updates.push("completed = ?");
    values.push(input.completed ? 1 : 0);
  }

  if (updates.length === 0) return toTodo(record);

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  const sql = `UPDATE todos SET ${updates.join(", ")} WHERE id = ?`;
  db.prepare(sql).run(...values);

  const updated = findById(id);
  return updated ? toTodo(updated) : null;
}

export function remove(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

export function toggleCompleted(id: number): Todo | null {
  const record = findById(id);
  if (!record) return null;

  return update(id, { completed: record.completed !== 1 });
}

export function countByUserId(userId: number): { total: number; completed: number } {
  const db = getDatabase();
  const total = (db.prepare("SELECT COUNT(*) as count FROM todos WHERE user_id = ?").get(userId) as { count: number }).count;
  const completed = (db.prepare("SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 1").get(userId) as { count: number }).count;
  return { total, completed };
}
