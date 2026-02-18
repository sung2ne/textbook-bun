import type { Server } from "bun";

// 토픽 정의
export const TOPICS = {
  // 전체 변경 알림
  TODO_ALL: "todo:all",

  // 특정 할 일 변경 (동적 생성)
  todoItem: (id: number) => `todo:item:${id}`,

  // 사용자별 알림
  userNotifications: (userId: string) => `user:${userId}:notifications`,
};

export class PubSubManager {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  // 모든 클라이언트에게 발행 (서버 레벨)
  broadcast(topic: string, data: any) {
    if (!this.server) return;
    this.server.publish(topic, JSON.stringify(data));
  }

  // 할 일 생성 알림
  notifyTodoCreated(todo: any) {
    this.broadcast(TOPICS.TODO_ALL, {
      type: "todo:created",
      todo,
      timestamp: Date.now(),
    });
  }

  // 할 일 수정 알림
  notifyTodoUpdated(todo: any) {
    this.broadcast(TOPICS.TODO_ALL, {
      type: "todo:updated",
      todo,
      timestamp: Date.now(),
    });

    // 해당 할 일을 구독하는 클라이언트에게도 알림
    this.broadcast(TOPICS.todoItem(todo.id), {
      type: "todo:updated",
      todo,
      timestamp: Date.now(),
    });
  }

  // 할 일 삭제 알림
  notifyTodoDeleted(id: number) {
    this.broadcast(TOPICS.TODO_ALL, {
      type: "todo:deleted",
      todoId: id,
      timestamp: Date.now(),
    });

    this.broadcast(TOPICS.todoItem(id), {
      type: "todo:deleted",
      todoId: id,
      timestamp: Date.now(),
    });
  }
}

// 싱글톤 인스턴스
export const pubsub = new PubSubManager();
