import type { ServerWebSocket } from "bun";

export interface ClientData {
  id: string;
  connectedAt: Date;
}

export function createWebSocketHandler() {
  return {
    open(ws: ServerWebSocket<ClientData>) {
      console.log(`클라이언트 연결: ${ws.data.id}`);
      ws.send(JSON.stringify({
        type: "connected",
        id: ws.data.id,
      }));
    },

    message(ws: ServerWebSocket<ClientData>, message: string | Buffer) {
      if (typeof message !== "string") return;

      try {
        const data = JSON.parse(message);
        console.log(`[${ws.data.id}] 메시지:`, data);

        // 다음 장에서 메시지 처리 로직 추가 예정
        ws.send(JSON.stringify({
          type: "echo",
          data,
        }));
      } catch {
        ws.send(JSON.stringify({
          type: "error",
          message: "잘못된 JSON 형식입니다.",
        }));
      }
    },

    close(ws: ServerWebSocket<ClientData>, code: number, reason: string) {
      console.log(`클라이언트 연결 종료: ${ws.data.id} (${code})`);
    },
  };
}
