import type { ServerWebSocket } from "bun";
import { TOPICS } from "./pubsub";
import { registerClient, unregisterClient, handlePong } from "./heartbeat";

export interface ClientData {
  id: string;
  connectedAt: Date;
  subscribedTodos: number[];
  lastActivity: number;
}

// 연결된 클라이언트 목록
export const clients = new Map<string, ServerWebSocket<ClientData>>();

export function createWebSocketHandler() {
  return {
    open(ws: ServerWebSocket<ClientData>) {
      clients.set(ws.data.id, ws);
      registerClient(ws.data.id);

      // 기본 구독
      ws.subscribe(TOPICS.TODO_ALL);

      ws.send(JSON.stringify({
        type: "connected",
        id: ws.data.id,
        message: "BunDo에 연결되었습니다!",
      }));

      console.log(`클라이언트 연결: ${ws.data.id}`);
    },

    message(ws: ServerWebSocket<ClientData>, message: string | Buffer) {
      if (typeof message !== "string") return;

      try {
        const data = JSON.parse(message);
        ws.data.lastActivity = Date.now();

        switch (data.type) {
          // 하트비트 응답
          case "pong":
            handlePong(ws.data.id);
            break;

          // 특정 할 일 구독
          case "subscribe_todo":
            ws.subscribe(TOPICS.todoItem(data.todoId));
            ws.data.subscribedTodos.push(data.todoId);
            ws.send(JSON.stringify({
              type: "subscribed",
              todoId: data.todoId,
            }));
            break;

          // 구독 해제
          case "unsubscribe_todo":
            ws.unsubscribe(TOPICS.todoItem(data.todoId));
            ws.data.subscribedTodos = ws.data.subscribedTodos.filter(
              (id) => id !== data.todoId
            );
            break;

          default:
            console.log("알 수 없는 메시지 타입:", data.type);
        }
      } catch (error) {
        ws.send(JSON.stringify({
          type: "error",
          message: "메시지 처리 중 오류가 발생했습니다.",
        }));
      }
    },

    close(ws: ServerWebSocket<ClientData>, code: number, reason: string) {
      clients.delete(ws.data.id);
      unregisterClient(ws.data.id);

      console.log(`클라이언트 연결 종료: ${ws.data.id} (${code})`);
    },

    drain(ws: ServerWebSocket<ClientData>) {
      // 버퍼가 비워지면 대기 중인 메시지 전송 가능
    },
  };
}
