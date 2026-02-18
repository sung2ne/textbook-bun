// frontend/src/index.ts
import { formatDate } from "./utils";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch("/api/todos");
  return response.json();
}

async function renderTodos() {
  const todos = await fetchTodos();
  const container = document.getElementById("app");

  if (!container) return;

  container.innerHTML = `
    <h1>BunDo - 할 일 목록</h1>
    <ul>
      ${todos.map(todo => `
        <li class="${todo.completed ? "completed" : ""}">
          ${todo.title}
          <span class="date">${formatDate(todo.createdAt)}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

document.addEventListener("DOMContentLoaded", renderTodos);
