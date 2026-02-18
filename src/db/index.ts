// src/db/index.ts - SQLite 데이터베이스 연결
import { Database } from "bun:sqlite";

// 데이터베이스 인스턴스 (싱글톤)
let db: Database | null = null;

export function getDatabase(): Database {
  if (!db) {
    const dbPath = Bun.env.DATABASE_PATH || "./data/bundo.sqlite";
    db = new Database(dbPath, { create: true });

    // WAL 모드 활성화 (동시 읽기/쓰기 성능 향상)
    db.exec("PRAGMA journal_mode = WAL");
    // 외래 키 제약 조건 활성화
    db.exec("PRAGMA foreign_keys = ON");
  }
  return db;
}

export function initDatabase(): void {
  const database = getDatabase();
  runMigrations(database);
  console.log("📦 Database initialized");
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

function runMigrations(database: Database): void {
  // 마이그레이션 추적 테이블 생성
  database.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrations = [
    { name: "001_create_users", run: createUsersTable },
    { name: "002_create_todos", run: createTodosTable },
  ];

  const executedMigrations = database
    .prepare("SELECT name FROM migrations")
    .all() as { name: string }[];
  const executedNames = new Set(executedMigrations.map((m) => m.name));

  for (const migration of migrations) {
    if (!executedNames.has(migration.name)) {
      console.log(`📝 Running migration: ${migration.name}`);
      migration.run(database);
      database.prepare("INSERT INTO migrations (name) VALUES (?)").run(migration.name);
    }
  }
}

function createUsersTable(database: Database): void {
  database.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  database.exec("CREATE INDEX idx_users_email ON users(email)");
}

function createTodosTable(database: Database): void {
  database.exec(`
    CREATE TABLE todos (
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
  database.exec("CREATE INDEX idx_todos_user_id ON todos(user_id)");
}
