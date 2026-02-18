import db from "../db";

// Prepared Statements 미리 생성 (성능 최적화)
const statements = {
  selectAll: db.prepare("SELECT * FROM todos ORDER BY sort_order ASC, created_at DESC"),
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
  updateOrder: db.prepare("UPDATE todos SET sort_order = ? WHERE id = ?"),
};

export interface Todo {
  id: number;
  title: string;
  completed: number;
  sort_order: number;
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

// 할 일 순서 변경 (드래그 앤 드롭)
export const reorderTodos = db.transaction((orderedIds: number[]) => {
  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    const result = statements.updateOrder.run(i, id);

    if (result.changes === 0) {
      throw new Error(`ID ${id}에 해당하는 할 일이 없습니다.`);
    }
  }

  return { success: true, count: orderedIds.length };
});

// 여러 할 일 일괄 삭제
export const deleteMultipleTodos = db.transaction((ids: number[]) => {
  const deleteStmt = db.prepare("DELETE FROM todos WHERE id = ?");
  let deletedCount = 0;

  for (const id of ids) {
    const result = deleteStmt.run(id);
    deletedCount += result.changes;
  }

  return { deletedCount };
});

// 할 일 일괄 완료 처리
export const completeMultipleTodos = db.transaction((ids: number[]) => {
  const completeStmt = db.prepare(`
    UPDATE todos
    SET completed = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  let completedCount = 0;

  for (const id of ids) {
    const result = completeStmt.run(id);
    completedCount += result.changes;
  }

  return { completedCount };
});
