// tests/response-formatter.test.ts
import { describe, it, expect } from "bun:test";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface FormattedTodo {
  id: number;
  title: string;
  status: "완료" | "미완료";
  createdAt: string;
}

function formatTodo(todo: Todo): FormattedTodo {
  return {
    id: todo.id,
    title: todo.title,
    status: todo.completed ? "완료" : "미완료",
    createdAt: todo.createdAt.toISOString().split("T")[0]
  };
}

function formatTodoList(todos: Todo[]): {
  items: FormattedTodo[];
  summary: { total: number; completed: number; active: number };
} {
  const items = todos.map(formatTodo);
  const completed = todos.filter(t => t.completed).length;

  return {
    items,
    summary: {
      total: todos.length,
      completed,
      active: todos.length - completed
    }
  };
}

describe("응답 포맷터", () => {
  const sampleDate = new Date("2024-06-15");

  describe("formatTodo", () => {
    it("완료되지 않은 할 일을 포맷한다", () => {
      const todo: Todo = {
        id: 1,
        title: "Bun 배우기",
        completed: false,
        createdAt: sampleDate
      };

      expect(formatTodo(todo)).toMatchSnapshot();
    });

    it("완료된 할 일을 포맷한다", () => {
      const todo: Todo = {
        id: 2,
        title: "테스트 작성하기",
        completed: true,
        createdAt: sampleDate
      };

      expect(formatTodo(todo)).toMatchSnapshot();
    });
  });

  describe("formatTodoList", () => {
    it("여러 할 일을 포맷한다", () => {
      const todos: Todo[] = [
        { id: 1, title: "첫 번째", completed: false, createdAt: sampleDate },
        { id: 2, title: "두 번째", completed: true, createdAt: sampleDate },
        { id: 3, title: "세 번째", completed: false, createdAt: sampleDate }
      ];

      expect(formatTodoList(todos)).toMatchSnapshot();
    });

    it("빈 목록을 처리한다", () => {
      expect(formatTodoList([])).toMatchSnapshot();
    });
  });
});
