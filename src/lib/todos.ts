import sql from "../db";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export async function getAllTodos(): Promise<Todo[]> {
  return await sql<Todo[]>`
    SELECT * FROM todos
    ORDER BY sort_order ASC, created_at DESC
  `;
}

export async function getTodoById(id: number): Promise<Todo | undefined> {
  const [todo] = await sql<Todo[]>`
    SELECT * FROM todos
    WHERE id = ${id}
  `;
  return todo;
}

export async function createTodo(title: string): Promise<Todo> {
  const [todo] = await sql<Todo[]>`
    INSERT INTO todos (title)
    VALUES (${title})
    RETURNING *
  `;
  return todo;
}

export async function updateTodo(
  id: number,
  title: string,
  completed: boolean
): Promise<Todo | undefined> {
  const [todo] = await sql<Todo[]>`
    UPDATE todos
    SET title = ${title}, completed = ${completed}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return todo;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM todos
    WHERE id = ${id}
  `;
  return result.count > 0;
}

export async function toggleTodo(id: number): Promise<Todo | undefined> {
  const [todo] = await sql<Todo[]>`
    UPDATE todos
    SET completed = NOT completed, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return todo;
}

// 할 일 순서 변경 (드래그 앤 드롭)
export async function reorderTodos(
  orderedIds: number[]
): Promise<{ success: boolean; count: number }> {
  await sql.begin(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      const result = await tx`
        UPDATE todos SET sort_order = ${i} WHERE id = ${orderedIds[i]}
      `;
      if (Number(result.count) === 0) {
        throw new Error(`ID ${orderedIds[i]}에 해당하는 할 일이 없습니다.`);
      }
    }
  });
  return { success: true, count: orderedIds.length };
}

// 여러 할 일 일괄 삭제
export async function deleteMultipleTodos(
  ids: number[]
): Promise<{ deletedCount: number }> {
  let deletedCount = 0;
  await sql.begin(async (tx) => {
    for (const id of ids) {
      const result = await tx`DELETE FROM todos WHERE id = ${id}`;
      deletedCount += Number(result.count);
    }
  });
  return { deletedCount };
}

// 할 일 일괄 완료 처리
export async function completeMultipleTodos(
  ids: number[]
): Promise<{ completedCount: number }> {
  let completedCount = 0;
  await sql.begin(async (tx) => {
    for (const id of ids) {
      const result = await tx`
        UPDATE todos
        SET completed = TRUE, updated_at = NOW()
        WHERE id = ${id}
      `;
      completedCount += Number(result.count);
    }
  });
  return { completedCount };
}
