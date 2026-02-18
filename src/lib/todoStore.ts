import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types";

// 메모리 저장소
const todos: Map<number, Todo> = new Map();
let nextId = 1;

// 초기 데이터
function init() {
  create({ title: "Bun HTTP 서버 배우기" });
  create({ title: "JSON API 만들기" });
  create({ title: "프로젝트 완성하기" });
}

// 모든 할 일 조회
export function findAll(): Todo[] {
  return Array.from(todos.values());
}

// 단일 할 일 조회
export function findById(id: number): Todo | undefined {
  return todos.get(id);
}

// 할 일 생성
export function create(data: CreateTodoRequest): Todo {
  const now = new Date().toISOString();
  const todo: Todo = {
    id: nextId++,
    title: data.title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  todos.set(todo.id, todo);
  return todo;
}

// 할 일 수정
export function update(id: number, data: UpdateTodoRequest): Todo | null {
  const todo = todos.get(id);
  if (!todo) return null;

  const updated: Todo = {
    ...todo,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  todos.set(id, updated);
  return updated;
}

// 할 일 삭제
export function remove(id: number): boolean {
  return todos.delete(id);
}

// 초기화 실행
init();
