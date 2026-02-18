interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path?: string;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

// 성공 응답 생성
export function successResponse<T>(data: T, status = 200): Response {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return Response.json(body, { status });
}

// 에러 응답 생성
export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown,
  path?: string
): Response {
  const body: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
    ...(path && { path }),
  };
  return Response.json(body, { status });
}
