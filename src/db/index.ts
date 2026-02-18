import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";

// data 디렉토리 생성 (없으면)
mkdirSync("data", { recursive: true });

// 데이터베이스 연결
const db = new Database("data/bundo.sqlite");

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// 프로세스 종료 시 데이터베이스 닫기
process.on("beforeExit", () => {
  db.close();
  console.log("데이터베이스 연결이 닫혔습니다.");
});

export default db;
