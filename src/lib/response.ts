// src/lib/response.ts - 응답 헬퍼

export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, unknown>
): Response {
  const body: SuccessResponse<T> = { success: true, data };
  if (meta) {
    body.meta = meta;
  }
  return Response.json(body, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): Response {
  const body: ErrorResponse = {
    success: false,
    error: { code, message },
  };
  if (details !== undefined) {
    body.error.details = details;
  }
  return Response.json(body, { status });
}

// 자주 사용하는 에러 응답 단축 함수
export function unauthorized(message: string = "인증이 필요합니다."): Response {
  return errorResponse("UNAUTHORIZED", message, 401);
}

export function notFound(message: string = "리소스를 찾을 수 없습니다."): Response {
  return errorResponse("NOT_FOUND", message, 404);
}

export function badRequest(message: string, details?: unknown): Response {
  return errorResponse("VALIDATION_ERROR", message, 400, details);
}

export function conflict(message: string): Response {
  return errorResponse("CONFLICT", message, 409);
}
