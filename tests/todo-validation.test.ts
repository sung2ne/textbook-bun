// tests/todo-validation.test.ts
import { describe, it, expect } from "bun:test";

interface CreateTodoInput {
  title: string;
  description?: string;
}

function validateTodo(input: CreateTodoInput): CreateTodoInput {
  if (!input.title || input.title.trim() === "") {
    throw new Error("제목은 필수입니다");
  }
  if (input.title.length > 100) {
    throw new Error("제목은 100자를 초과할 수 없습니다");
  }
  return {
    title: input.title.trim(),
    description: input.description?.trim()
  };
}

describe("Todo 유효성 검사", () => {
  describe("성공 케이스", () => {
    it("유효한 입력을 그대로 반환한다", () => {
      const input = { title: "Bun 배우기" };
      const result = validateTodo(input);

      expect(result).toEqual({ title: "Bun 배우기", description: undefined });
      expect(result.title).toHaveLength(7);
    });

    it("공백을 제거한다", () => {
      const input = { title: "  Bun 배우기  ", description: "  설명  " };
      const result = validateTodo(input);

      expect(result.title).toBe("Bun 배우기");
      expect(result.description).toBe("설명");
      expect(result.title).not.toMatch(/^\s|\s$/);
    });
  });

  describe("실패 케이스", () => {
    it("빈 제목은 에러를 던진다", () => {
      expect(() => validateTodo({ title: "" })).toThrow("제목은 필수입니다");
      expect(() => validateTodo({ title: "   " })).toThrow("제목은 필수입니다");
    });

    it("긴 제목은 에러를 던진다", () => {
      const longTitle = "a".repeat(101);
      expect(() => validateTodo({ title: longTitle }))
        .toThrow(/100자를 초과/);
    });
  });

  describe("경계값 테스트", () => {
    it("100자 제목은 유효하다", () => {
      const title = "a".repeat(100);
      expect(() => validateTodo({ title })).not.toThrow();
    });

    it("101자 제목은 무효하다", () => {
      const title = "a".repeat(101);
      expect(() => validateTodo({ title })).toThrow();
    });
  });
});
