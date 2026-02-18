// src/lib/todo-utils.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function filterCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => todo.completed);
}

export function filterActive(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

export function countCompleted(todos: Todo[]): number {
  return filterCompleted(todos).length;
}
