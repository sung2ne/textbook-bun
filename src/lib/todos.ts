import db from "../db";

// Prepared Statements 미리 생성 (성능 최적화)
const statements = {
  selectAll: db.prepare("SELECT * FROM todos ORDER BY created_at DESC"),
  selectById: db.prepare("SELECT * FROM todos WHERE id = ?"),
  insert: db.prepare("INSERT INTO todos (title) VALUES (?) RETURNING *"),
  update: db.prepare(`
    UPDATE todos
    SET title = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    RETURNING *
  `),
  delete: db.prepare("DELETE FROM todos WHERE id = ?"),
  toggleComplete: db.prepare(`
    UPDATE todos
    SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    RETURNING *
  `),
};

export interface Todo {
  id: number;
  title: string;
  completed: number;
  created_at: string;
  updated_at: string;
}

export function getAllTodos(): Todo[] {
  return statements.selectAll.all() as Todo[];
}

export function getTodoById(id: number): Todo | undefined {
  return statements.selectById.get(id) as Todo | undefined;
}

export function createTodo(title: string): Todo {
  return statements.insert.get(title) as Todo;
}

export function updateTodo(
  id: number,
  title: string,
  completed: boolean
): Todo | undefined {
  return statements.update.get(title, completed ? 1 : 0, id) as Todo | undefined;
}

export function deleteTodo(id: number): boolean {
  const result = statements.delete.run(id);
  return result.changes > 0;
}

export function toggleTodo(id: number): Todo | undefined {
  return statements.toggleComplete.get(id) as Todo | undefined;
}
