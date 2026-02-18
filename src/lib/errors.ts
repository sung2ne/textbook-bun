import { errorResponse } from "./response";

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }

  toResponse(path?: string): Response {
    return errorResponse(this.code, this.message, this.statusCode, this.details, path);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다", details?: unknown) {
    super(400, "BAD_REQUEST", message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "인증이 필요합니다") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "접근 권한이 없습니다") {
    super(403, "FORBIDDEN", message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "리소스를 찾을 수 없습니다") {
    super(404, "NOT_FOUND", message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "리소스 충돌이 발생했습니다") {
    super(409, "CONFLICT", message);
  }
}

export class ValidationError extends HttpError {
  constructor(errors: string[]) {
    super(422, "VALIDATION_ERROR", "유효성 검사에 실패했습니다", { errors });
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "서버 내부 오류가 발생했습니다") {
    super(500, "INTERNAL_SERVER_ERROR", message);
  }
}
