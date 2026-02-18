import type { ServerWebSocket } from "bun";

export interface ClientData {
  id: string;
  username: string;
  room: string;
  connectedAt: Date;
}

// 전체 클라이언트 (DM용)
const allClients = new Map<string, ServerWebSocket<ClientData>>();

// 방별 클라이언트
const rooms = new Map<string, Set<ServerWebSocket<ClientData>>>();

function addToRoom(ws: ServerWebSocket<ClientData>) {
  if (!rooms.has(ws.data.room)) {
    rooms.set(ws.data.room, new Set());
  }
  rooms.get(ws.data.room)!.add(ws);
}

function removeFromRoom(ws: ServerWebSocket<ClientData>) {
  rooms.get(ws.data.room)?.delete(ws);
  if (rooms.get(ws.data.room)?.size === 0) {
    rooms.delete(ws.data.room);
  }
}

function getRoomUsers(room: string) {
  const clients = rooms.get(room);
  if (!clients) return [];
  return Array.from(clients).map((ws) => ({
    id: ws.data.id,
    username: ws.data.username,
  }));
}

export function getRoomList() {
  return Array.from(rooms.entries()).map(([name, clients]) => ({
    name,
    userCount: clients.size,
  }));
}

export function createWebSocketHandler() {
  return {
    open(ws: ServerWebSocket<ClientData>) {
      // 등록
      allClients.set(ws.data.id, ws);
      ws.subscribe(ws.data.room);
      addToRoom(ws);

      // 입장 알림
      const users = getRoomUsers(ws.data.room);

      ws.publish(ws.data.room, JSON.stringify({
        type: "join",
        user: { id: ws.data.id, username: ws.data.username },
        userCount: users.length,
      }));

      ws.send(JSON.stringify({
        type: "init",
        yourId: ws.data.id,
        room: ws.data.room,
        users,
      }));

      console.log(`${ws.data.username} 입장 (${ws.data.room})`);
    },

    message(ws: ServerWebSocket<ClientData>, message: string | Buffer) {
      if (typeof message !== "string") return;

      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case "message": {
            const msgPayload = JSON.stringify({
              type: "message",
              user: { id: ws.data.id, username: ws.data.username },
              content: data.content,
              timestamp: Date.now(),
            });
            ws.publish(ws.data.room, msgPayload);
            ws.send(msgPayload);
            break;
          }

          case "dm": {
            const target = allClients.get(data.targetId);
            if (target) {
              target.send(JSON.stringify({
                type: "dm",
                from: { id: ws.data.id, username: ws.data.username },
                content: data.content,
              }));
            }
            break;
          }

          case "join_room": {
            // 현재 방 퇴장
            ws.publish(ws.data.room, JSON.stringify({
              type: "leave",
              user: { id: ws.data.id, username: ws.data.username },
            }));
            ws.unsubscribe(ws.data.room);
            removeFromRoom(ws);

            // 새 방 입장
            ws.data.room = data.room;
            ws.subscribe(ws.data.room);
            addToRoom(ws);

            const newUsers = getRoomUsers(ws.data.room);
            ws.publish(ws.data.room, JSON.stringify({
              type: "join",
              user: { id: ws.data.id, username: ws.data.username },
              userCount: newUsers.length,
            }));

            ws.send(JSON.stringify({
              type: "room_changed",
              room: ws.data.room,
              users: newUsers,
            }));
            break;
          }
        }
      } catch (error) {
        console.error("메시지 처리 오류:", error);
      }
    },

    close(ws: ServerWebSocket<ClientData>, code: number) {
      // 정리
      allClients.delete(ws.data.id);
      removeFromRoom(ws);

      ws.publish(ws.data.room, JSON.stringify({
        type: "leave",
        user: { id: ws.data.id, username: ws.data.username },
        userCount: getRoomUsers(ws.data.room).length,
      }));

      ws.unsubscribe(ws.data.room);

      console.log(`${ws.data.username} 퇴장 (${ws.data.room}) 코드: ${code}`);
    },
  };
}
