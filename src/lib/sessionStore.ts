import type { SessionData } from "./session";

export interface SessionStore {
  get(sessionId: string): Promise<SessionData | null>;
  set(sessionId: string, data: SessionData): Promise<void>;
  delete(sessionId: string): Promise<boolean>;
}

// 메모리 저장소 구현
export class MemorySessionStore implements SessionStore {
  private sessions = new Map<string, SessionData>();

  async get(sessionId: string): Promise<SessionData | null> {
    return this.sessions.get(sessionId) || null;
  }

  async set(sessionId: string, data: SessionData): Promise<void> {
    this.sessions.set(sessionId, data);
  }

  async delete(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }
}

// 파일 기반 저장소
export class FileSessionStore implements SessionStore {
  constructor(private directory: string) {}

  private getFilePath(sessionId: string): string {
    return `${this.directory}/${sessionId}.json`;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const file = Bun.file(this.getFilePath(sessionId));
    if (!(await file.exists())) return null;
    return file.json();
  }

  async set(sessionId: string, data: SessionData): Promise<void> {
    await Bun.write(this.getFilePath(sessionId), JSON.stringify(data));
  }

  async delete(sessionId: string): Promise<boolean> {
    const file = Bun.file(this.getFilePath(sessionId));
    if (!(await file.exists())) return false;
    const { unlink } = await import("fs/promises");
    await unlink(this.getFilePath(sessionId));
    return true;
  }
}
