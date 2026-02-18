// frontend/src/App.tsx
import { Suspense, lazy, useState } from "react";
import versionInfo from "virtual:version";

// 페이지 컴포넌트를 동적 import
const TodoList = lazy(() => import("./pages/TodoList"));
const Settings = lazy(() => import("./pages/Settings"));

type Page = "todos" | "settings";

function Loading() {
  return <div className="loading">페이지 로딩 중...</div>;
}

export function App() {
  const [page, setPage] = useState<Page>("todos");

  return (
    <div className="app">
      <header>
        <h1>BunDo</h1>
        <nav>
          <button
            className={page === "todos" ? "active" : ""}
            onClick={() => setPage("todos")}
          >
            할 일
          </button>
          <button
            className={page === "settings" ? "active" : ""}
            onClick={() => setPage("settings")}
          >
            설정
          </button>
        </nav>
      </header>

      <main>
        <Suspense fallback={<Loading />}>
          {page === "todos" && <TodoList />}
          {page === "settings" && <Settings />}
        </Suspense>
      </main>

      <footer>
        <p>BunDo v{versionInfo.version}</p>
        <p>빌드: {versionInfo.buildTime}</p>
      </footer>
    </div>
  );
}
