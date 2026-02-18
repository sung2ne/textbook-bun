// src/db/schema.ts - SQLite 스키마 타입 정의

// 데이터베이스 레코드 타입 (DB에서 가져온 그대로)
export interface UserRecord {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TodoRecord {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  completed: number; // SQLite는 boolean이 없어서 0/1 사용
  created_at: string;
  updated_at: string;
}

// API 응답용 타입 (클라이언트에게 보내는 형태)
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 입력 타입
export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface CreateTodoInput {
  userId: number;
  title: string;
  description?: string | null;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

// 변환 함수
export function toUser(record: UserRecord): User {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function toTodo(record: TodoRecord): Todo {
  return {
    id: record.id,
    userId: record.user_id,
    title: record.title,
    description: record.description,
    completed: record.completed === 1,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}
