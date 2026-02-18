import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";

// data 디렉토리 생성 (없으면)
mkdirSync("data", { recursive: true });

// 데이터베이스 연결
const db = new Database("data/bundo.sqlite");

// WAL 모드 활성화
db.exec("PRAGMA journal_mode = WAL");

// 추가 성능 최적화 (선택사항)
db.exec("PRAGMA synchronous = NORMAL");
db.exec("PRAGMA cache_size = 10000");
db.exec("PRAGMA temp_store = MEMORY");

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// 기존 테이블에 sort_order 컬럼 추가 (마이그레이션)
try {
  db.exec("ALTER TABLE todos ADD COLUMN sort_order INTEGER DEFAULT 0");
} catch {
  // 이미 컬럼이 존재하면 무시
}

// 프로세스 종료 시 데이터베이스 닫기
process.on("beforeExit", () => {
  db.close();
  console.log("데이터베이스 연결이 닫혔습니다.");
});

export default db;
