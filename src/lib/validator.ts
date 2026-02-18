export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCreateTodo(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return { valid: false, errors: ["요청 본문은 객체여야 합니다"] };
  }

  const data = body as Record<string, unknown>;

  if (!data.title) {
    errors.push("title은 필수입니다");
  } else if (typeof data.title !== "string") {
    errors.push("title은 문자열이어야 합니다");
  } else if (data.title.trim().length === 0) {
    errors.push("title은 비어있을 수 없습니다");
  } else if (data.title.length > 200) {
    errors.push("title은 200자를 초과할 수 없습니다");
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateTodo(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return { valid: false, errors: ["요청 본문은 객체여야 합니다"] };
  }

  const data = body as Record<string, unknown>;

  if (data.title !== undefined) {
    if (typeof data.title !== "string") {
      errors.push("title은 문자열이어야 합니다");
    } else if (data.title.trim().length === 0) {
      errors.push("title은 비어있을 수 없습니다");
    } else if (data.title.length > 200) {
      errors.push("title은 200자를 초과할 수 없습니다");
    }
  }

  if (data.completed !== undefined && typeof data.completed !== "boolean") {
    errors.push("completed는 불리언이어야 합니다");
  }

  return { valid: errors.length === 0, errors };
}
