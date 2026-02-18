// src/routes/health.ts - 헬스 체크 엔드포인트
import { Database } from "bun:sqlite";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  version: string;
  uptime: number;
  checks: {
    database: boolean;
    memory: boolean;
  };
}

const startTime = Date.now();

export async function healthCheck(db: Database): Promise<Response> {
  const checks = {
    database: checkDatabase(db),
    memory: checkMemory(),
  };

  const allHealthy = Object.values(checks).every(Boolean);

  const status: HealthStatus = {
    status: allHealthy ? "healthy" : "unhealthy",
    version: process.env.APP_VERSION || "1.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  return Response.json(status, {
    status: allHealthy ? 200 : 503,
  });
}

function checkDatabase(db: Database): boolean {
  try {
    db.prepare("SELECT 1").get();
    return true;
  } catch {
    return false;
  }
}

function checkMemory(): boolean {
  // 메모리 사용량 체크 (1GB 이하)
  const used = process.memoryUsage().heapUsed;
  return used < 1024 * 1024 * 1024;
}

// Kubernetes용 프로브
export function livenessProbe(): Response {
  return new Response("OK", { status: 200 });
}

export function readinessProbe(db: Database): Response {
  const dbHealthy = checkDatabase(db);
  return new Response(dbHealthy ? "Ready" : "Not Ready", {
    status: dbHealthy ? 200 : 503,
  });
}
