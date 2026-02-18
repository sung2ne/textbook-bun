// frontend/src/App.tsx
import { useState, useEffect } from "react";
import versionInfo from "virtual:version";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("할 일 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      const todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo("");
    } catch (error) {
      console.error("할 일 추가에 실패했습니다:", error);
    }
  }

  async function toggleTodo(id: number) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error("할 일 수정에 실패했습니다:", error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("할 일 삭제에 실패했습니다:", error);
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>BunDo</h1>
        <p>Bun으로 만든 할 일 관리</p>
      </header>

      <main>
        <div className="add-todo">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="새로운 할 일..."
          />
          <button onClick={addTodo}>추가</button>
        </div>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty">할 일이 없습니다. 새로운 할 일을 추가하세요!</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="title">{todo.title}</span>
                <button
                  className="delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  삭제
                </button>
              </li>
            ))
          )}
        </ul>
      </main>

      <footer>
        <p>총 {todos.length}개 / 완료 {todos.filter((t) => t.completed).length}개</p>
        <p>BunDo v{versionInfo.version}</p>
        <p>빌드: {versionInfo.buildTime}</p>
      </footer>
    </div>
  );
}
