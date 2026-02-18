// src/db/users.ts - 사용자 저장소
import { getDatabase } from "./index";
import type { UserRecord, User, CreateUserInput } from "./schema";
import { toUser } from "./schema";

export function findByEmail(email: string): UserRecord | null {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as UserRecord | null;
}

export function findById(id: number): UserRecord | null {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as UserRecord | null;
}

export function create(input: CreateUserInput): User {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(input.email, input.password, input.name);
  const insertedId = Number(result.lastInsertRowid);

  const record = findById(insertedId);
  if (!record) {
    throw new Error("사용자 생성에 실패했습니다.");
  }

  return toUser(record);
}

export function existsByEmail(email: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare("SELECT 1 FROM users WHERE email = ? LIMIT 1");
  return stmt.get(email) !== null;
}
