import type { ServerWebSocket } from "bun";
import type { ClientData } from "./handler";

// 연결된 클라이언트와 마지막 응답 시간
const clientHeartbeats = new Map<string, number>();

export function initHeartbeat(
  clients: Map<string, ServerWebSocket<ClientData>>,
  interval = 30000 // 30초
) {
  setInterval(() => {
    const now = Date.now();

    for (const [id, ws] of clients) {
      const lastPong = clientHeartbeats.get(id) || 0;

      // 마지막 응답이 2배 간격 이상 오래되면 연결 끊김으로 판단
      if (now - lastPong > interval * 2) {
        console.log(`클라이언트 ${id} 응답 없음, 연결 종료`);
        ws.close(1000, "No heartbeat response");
        clients.delete(id);
        clientHeartbeats.delete(id);
        continue;
      }

      // 핑 전송
      ws.send(JSON.stringify({ type: "ping", timestamp: now }));
    }
  }, interval);
}

export function handlePong(clientId: string) {
  clientHeartbeats.set(clientId, Date.now());
}

export function registerClient(clientId: string) {
  clientHeartbeats.set(clientId, Date.now());
}

export function unregisterClient(clientId: string) {
  clientHeartbeats.delete(clientId);
}
