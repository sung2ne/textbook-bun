// tests/dom-todo.test.ts
import { describe, it, expect, beforeEach, mock } from "bun:test";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function createTodoItem(todo: Todo): HTMLLIElement {
  const li = document.createElement("li");
  li.className = `todo-item ${todo.completed ? "completed" : ""}`;
  li.dataset.id = String(todo.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  const span = document.createElement("span");
  span.textContent = todo.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "delete-btn";

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

async function loadAndRenderTodos(container: HTMLElement, fetchTodos: () => Promise<{ id: number; title: string }[]>) {
  container.innerHTML = "<p>로딩 중...</p>";

  try {
    const todos = await fetchTodos();

    if (todos.length === 0) {
      container.innerHTML = "<p>할 일이 없습니다.</p>";
    } else {
      container.innerHTML = `
        <ul>
          ${todos.map((t) => `<li data-id="${t.id}">${t.title}</li>`).join("")}
        </ul>
      `;
    }
  } catch (error) {
    container.innerHTML = "<p class='error'>로드 실패</p>";
  }
}

describe("Todo 컴포넌트", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("createTodoItem", () => {
    it("할 일 아이템을 생성한다", () => {
      const todo: Todo = { id: 1, title: "Bun 배우기", completed: false };
      const item = createTodoItem(todo);

      expect(item.tagName).toBe("LI");
      expect(item.dataset.id).toBe("1");
      expect(item.querySelector("span")?.textContent).toBe("Bun 배우기");
    });

    it("완료된 할 일에 completed 클래스를 추가한다", () => {
      const todo: Todo = { id: 1, title: "완료된 일", completed: true };
      const item = createTodoItem(todo);

      expect(item.classList.contains("completed")).toBe(true);
    });

    it("미완료 할 일에는 completed 클래스가 없다", () => {
      const todo: Todo = { id: 1, title: "미완료 일", completed: false };
      const item = createTodoItem(todo);

      expect(item.classList.contains("completed")).toBe(false);
    });

    it("체크박스 상태가 completed와 일치한다", () => {
      const completedTodo: Todo = { id: 1, title: "완료", completed: true };
      const activeTodo: Todo = { id: 2, title: "미완료", completed: false };

      const completedItem = createTodoItem(completedTodo);
      const activeItem = createTodoItem(activeTodo);

      const completedCheckbox = completedItem.querySelector("input") as HTMLInputElement;
      const activeCheckbox = activeItem.querySelector("input") as HTMLInputElement;

      expect(completedCheckbox.checked).toBe(true);
      expect(activeCheckbox.checked).toBe(false);
    });
  });
});

describe("비동기 DOM 업데이트", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.innerHTML = "";
    document.body.appendChild(container);
  });

  it("로딩 상태를 표시한다", async () => {
    const fetchTodos = () => new Promise<never>(() => {}); // 영원히 대기

    // 비동기 함수 시작 (await 없이)
    loadAndRenderTodos(container, fetchTodos);

    expect(container.innerHTML).toBe("<p>로딩 중...</p>");
  });

  it("할 일 목록을 렌더링한다", async () => {
    const todos = [
      { id: 1, title: "첫 번째" },
      { id: 2, title: "두 번째" }
    ];
    const fetchTodos = () => Promise.resolve(todos);

    await loadAndRenderTodos(container, fetchTodos);

    expect(container.querySelectorAll("li").length).toBe(2);
    expect(container.querySelector('[data-id="1"]')?.textContent).toBe("첫 번째");
  });

  it("빈 목록 메시지를 표시한다", async () => {
    const fetchTodos = () => Promise.resolve([]);

    await loadAndRenderTodos(container, fetchTodos);

    expect(container.textContent).toContain("할 일이 없습니다");
  });

  it("에러 메시지를 표시한다", async () => {
    const fetchTodos = () => Promise.reject(new Error("Network error"));

    await loadAndRenderTodos(container, fetchTodos);

    expect(container.querySelector(".error")).not.toBeNull();
    expect(container.textContent).toContain("로드 실패");
  });
});
