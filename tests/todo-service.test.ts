// tests/todo-service.test.ts
import { describe, it, expect, mock, beforeEach } from "bun:test";

// Todo 저장소 인터페이스
interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: number): Promise<Todo | null>;
  create(todo: CreateTodoInput): Promise<Todo>;
  update(id: number, todo: UpdateTodoInput): Promise<Todo>;
  delete(id: number): Promise<boolean>;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface CreateTodoInput {
  title: string;
}

interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

// Todo 서비스
class TodoService {
  constructor(private repository: TodoRepository) {}

  async getAllTodos() {
    return this.repository.findAll();
  }

  async getTodoById(id: number) {
    const todo = await this.repository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return todo;
  }

  async createTodo(title: string) {
    if (!title.trim()) {
      throw new Error("Title is required");
    }
    return this.repository.create({ title: title.trim() });
  }

  async toggleTodo(id: number) {
    const todo = await this.repository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return this.repository.update(id, { completed: !todo.completed });
  }
}

describe("TodoService", () => {
  let mockRepository: TodoRepository;
  let service: TodoService;

  const sampleTodos: Todo[] = [
    { id: 1, title: "첫 번째 할 일", completed: false },
    { id: 2, title: "두 번째 할 일", completed: true }
  ];

  beforeEach(() => {
    // mock 저장소 생성
    mockRepository = {
      findAll: mock().mockResolvedValue(sampleTodos),
      findById: mock().mockImplementation(async (id: number) => {
        return sampleTodos.find(t => t.id === id) || null;
      }),
      create: mock().mockImplementation(async (input: CreateTodoInput) => {
        return { id: 3, title: input.title, completed: false };
      }),
      update: mock().mockImplementation(async (id: number, input: UpdateTodoInput) => {
        const todo = sampleTodos.find(t => t.id === id);
        return { ...todo!, ...input };
      }),
      delete: mock().mockResolvedValue(true)
    };

    service = new TodoService(mockRepository);
  });

  describe("getAllTodos", () => {
    it("모든 할 일을 반환한다", async () => {
      const todos = await service.getAllTodos();

      expect(todos).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTodoById", () => {
    it("ID로 할 일을 찾는다", async () => {
      const todo = await service.getTodoById(1);

      expect(todo.title).toBe("첫 번째 할 일");
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it("없는 ID면 에러를 던진다", async () => {
      await expect(service.getTodoById(999)).rejects.toThrow("Todo not found");
    });
  });

  describe("createTodo", () => {
    it("새 할 일을 생성한다", async () => {
      const todo = await service.createTodo("새로운 할 일");

      expect(todo.id).toBe(3);
      expect(todo.title).toBe("새로운 할 일");
      expect(mockRepository.create).toHaveBeenCalledWith({ title: "새로운 할 일" });
    });

    it("빈 제목이면 에러를 던진다", async () => {
      await expect(service.createTodo("")).rejects.toThrow("Title is required");

      // 저장소가 호출되지 않았음을 확인
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("toggleTodo", () => {
    it("할 일의 완료 상태를 토글한다", async () => {
      const todo = await service.toggleTodo(1);

      expect(todo.completed).toBe(true); // false에서 true로
      expect(mockRepository.update).toHaveBeenCalledWith(1, { completed: true });
    });
  });
});
