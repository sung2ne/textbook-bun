// tests/todo-utils.test.ts
import { describe, it, expect } from "bun:test";
import { filterCompleted, filterActive, countCompleted, type Todo } from "../src/lib/todo-utils";

const sampleTodos: Todo[] = [
  { id: 1, title: "Bun 설치하기", completed: true },
  { id: 2, title: "첫 테스트 작성하기", completed: false },
  { id: 3, title: "API 서버 만들기", completed: true },
];

describe("Todo 유틸리티", () => {
  describe("filterCompleted", () => {
    it("완료된 할 일만 반환한다", () => {
      const result = filterCompleted(sampleTodos);
      expect(result.length).toBe(2);
      expect(result.every((todo) => todo.completed)).toBe(true);
    });

    it("빈 배열을 처리한다", () => {
      const result = filterCompleted([]);
      expect(result).toEqual([]);
    });
  });

  describe("filterActive", () => {
    it("미완료 할 일만 반환한다", () => {
      const result = filterActive(sampleTodos);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe("첫 테스트 작성하기");
    });
  });

  describe("countCompleted", () => {
    it("완료된 할 일 개수를 센다", () => {
      expect(countCompleted(sampleTodos)).toBe(2);
    });
  });
});
