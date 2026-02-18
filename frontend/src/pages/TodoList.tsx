// frontend/src/pages/TodoList.tsx
import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">할 일 목록 로딩 중...</div>;
  }

  return (
    <div className="todo-list-page">
      <h2>할 일 목록</h2>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
