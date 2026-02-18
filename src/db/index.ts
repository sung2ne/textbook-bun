import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

process.on("beforeExit", async () => {
  await client.end();
  console.log("PostgreSQL 연결이 닫혔습니다.");
});
