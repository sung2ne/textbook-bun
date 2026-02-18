// tests/helpers.ts - 통합 테스트용 헬퍼 함수
import { Database } from "bun:sqlite";
import { hashPassword } from "../src/lib/auth";

let testDb: Database | null = null;

// 테스트 데이터베이스 가져오기 (인메모리 SQLite)
export function getTestDatabase(): Database {
  if (!testDb) {
    testDb = new Database(":memory:");

    testDb.exec("PRAGMA journal_mode = WAL");
    testDb.exec("PRAGMA foreign_keys = ON");

    // 테이블 생성
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  }
  return testDb;
}

// 테이블 데이터 초기화 (테이블 구조는 유지)
export function resetTestDatabase(): void {
  const db = getTestDatabase();
  db.exec("DELETE FROM todos");
  db.exec("DELETE FROM users");
}

// 테스트 데이터베이스 닫기
export function closeTestDatabase(): void {
  if (testDb) {
    testDb.close();
    testDb = null;
  }
}

// 테스트 사용자 생성
export async function createTestUser(
  email: string = "test@example.com",
  password: string = "password123",
  name: string = "Test User"
): Promise<{ id: number; email: string; name: string }> {
  const db = getTestDatabase();
  const hashedPassword = await hashPassword(password);

  const result = db
    .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
    .run(email, hashedPassword, name);

  return { id: Number(result.lastInsertRowid), email, name };
}

// 테스트 할 일 생성
export function createTestTodo(
  userId: number,
  title: string,
  completed: boolean = false
): { id: number; userId: number; title: string; completed: boolean } {
  const db = getTestDatabase();
  const result = db
    .prepare("INSERT INTO todos (user_id, title, completed) VALUES (?, ?, ?)")
    .run(userId, title, completed ? 1 : 0);

  return { id: Number(result.lastInsertRowid), userId, title, completed };
}
