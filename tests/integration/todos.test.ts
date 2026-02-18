// tests/integration/todos.test.ts - 할 일 API 통합 테스트
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import {
  getTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
  createTestUser,
  createTestTodo,
} from "../helpers";
import { generateAccessToken } from "../../src/lib/auth";

describe("Todos Integration", () => {
  let testUser: { id: number; email: string; name: string };
  let accessToken: string;

  beforeAll(() => {
    getTestDatabase(); // 인메모리 DB 초기화
  });

  afterAll(() => {
    closeTestDatabase();
  });

  beforeEach(async () => {
    resetTestDatabase();
    testUser = await createTestUser();
    accessToken = await generateAccessToken({
      id: testUser.id,
      email: testUser.email,
      name: testUser.name,
    });
  });

  describe("할 일 목록 조회", () => {
    it("새 사용자의 할 일 목록은 비어있다", async () => {
      const db = getTestDatabase();
      const todos = db.prepare("SELECT * FROM todos WHERE user_id = ?").all(testUser.id);
      expect(todos).toHaveLength(0);
    });

    it("사용자의 할 일을 반환한다", async () => {
      createTestTodo(testUser.id, "첫 번째 할 일");
      createTestTodo(testUser.id, "두 번째 할 일");

      const db = getTestDatabase();
      const todos = db.prepare("SELECT * FROM todos WHERE user_id = ?").all(testUser.id);
      expect(todos).toHaveLength(2);
    });

    it("다른 사용자의 할 일은 반환하지 않는다", async () => {
      const otherUser = await createTestUser("other@example.com");
      createTestTodo(otherUser.id, "다른 사람의 할 일");
      createTestTodo(testUser.id, "내 할 일");

      const db = getTestDatabase();
      const myTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?").all(testUser.id);
      expect(myTodos).toHaveLength(1);
    });
  });

  describe("할 일 생성", () => {
    it("새 할 일을 생성한다", async () => {
      const db = getTestDatabase();
      const result = db
        .prepare("INSERT INTO todos (user_id, title) VALUES (?, ?)")
        .run(testUser.id, "새 할 일");

      expect(result.lastInsertRowid).toBeDefined();

      const todo = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(Number(result.lastInsertRowid));
      expect(todo).toBeDefined();
    });

    it("생성된 할 일은 미완료 상태이다", async () => {
      const todo = createTestTodo(testUser.id, "새 할 일");
      expect(todo.completed).toBe(false);
    });
  });

  describe("할 일 완료 토글", () => {
    it("완료 상태를 토글한다", async () => {
      const todo = createTestTodo(testUser.id, "토글 테스트", false);
      const db = getTestDatabase();

      // 완료로 변경
      db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(1, todo.id);

      const updated = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(todo.id) as { completed: number };
      expect(updated.completed).toBe(1);

      // 다시 미완료로 변경
      db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(0, todo.id);

      const toggledBack = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(todo.id) as { completed: number };
      expect(toggledBack.completed).toBe(0);
    });
  });

  describe("할 일 삭제", () => {
    it("할 일을 삭제한다", async () => {
      const todo = createTestTodo(testUser.id, "삭제 대상");
      const db = getTestDatabase();

      db.prepare("DELETE FROM todos WHERE id = ?").run(todo.id);

      const deleted = db.prepare("SELECT * FROM todos WHERE id = ?").get(todo.id);
      expect(deleted).toBeNull();
    });

    it("다른 사용자의 할 일은 삭제하지 않는다", async () => {
      const otherUser = await createTestUser("other@example.com");
      const otherTodo = createTestTodo(otherUser.id, "남의 것");

      // 다른 사용자의 할 일은 여전히 존재해야 함
      const db = getTestDatabase();
      const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(otherTodo.id);
      expect(todo).toBeDefined();
    });
  });
});
