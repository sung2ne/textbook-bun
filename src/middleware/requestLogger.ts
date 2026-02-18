// src/middleware/requestLogger.ts - HTTP 요청 로깅 미들웨어
import { logger } from "../lib/logger";

export async function requestLogger(
  request: Request,
  handler: (req: Request) => Promise<Response>
): Promise<Response> {
  const start = performance.now();
  const requestId = crypto.randomUUID();

  // 요청 로그
  logger.info("Request received", {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  try {
    const response = await handler(request);
    const duration = performance.now() - start;

    // 응답 로그
    logger.info("Response sent", {
      requestId,
      status: response.status,
      duration: `${duration.toFixed(2)}ms`,
    });

    // 요청 ID를 응답 헤더에 추가
    response.headers.set("X-Request-ID", requestId);
    return response;
  } catch (error) {
    const duration = performance.now() - start;

    logger.error("Request failed", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration.toFixed(2)}ms`,
    });

    throw error;
  }
}
