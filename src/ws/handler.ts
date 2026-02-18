import type { ServerWebSocket } from "bun";
import { TOPICS } from "./pubsub";

export interface ClientData {
  id: string;
  connectedAt: Date;
  subscribedTodos: number[];
}

export function createWebSocketHandler() {
  return {
    open(ws: ServerWebSocket<ClientData>) {
      // 기본적으로 전체 알림 구독
      ws.subscribe(TOPICS.TODO_ALL);

      ws.send(JSON.stringify({
        type: "connected",
        id: ws.data.id,
      }));
    },

    message(ws: ServerWebSocket<ClientData>, message: string | Buffer) {
      if (typeof message !== "string") return;

      try {
        const data = JSON.parse(message);

        // 특정 할 일 구독
        if (data.type === "subscribe_todo") {
          const todoId = data.todoId;
          ws.subscribe(TOPICS.todoItem(todoId));
          ws.data.subscribedTodos.push(todoId);

          ws.send(JSON.stringify({
            type: "subscribed",
            topic: `todo:${todoId}`,
          }));
          return;
        }

        // 특정 할 일 구독 해제
        if (data.type === "unsubscribe_todo") {
          const todoId = data.todoId;
          ws.unsubscribe(TOPICS.todoItem(todoId));
          ws.data.subscribedTodos = ws.data.subscribedTodos.filter(
            (id) => id !== todoId
          );

          ws.send(JSON.stringify({
            type: "unsubscribed",
            topic: `todo:${todoId}`,
          }));
          return;
        }

      } catch (error) {
        ws.send(JSON.stringify({
          type: "error",
          message: "잘못된 메시지 형식",
        }));
      }
    },

    close(ws: ServerWebSocket<ClientData>) {
      // 연결 종료 시 자동으로 모든 구독 해제됨
    },
  };
}
