import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
});

// 테이블 생성 (앱 시작 시 실행)
await sql`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

process.on("beforeExit", async () => {
  await sql.end();
  console.log("PostgreSQL 연결이 닫혔습니다.");
});

export default sql;
