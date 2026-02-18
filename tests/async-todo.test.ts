// tests/async-todo.test.ts
import { describe, it, expect, mock } from "bun:test";

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      await Bun.sleep(100 * (i + 1)); // 점진적 대기
    }
  }

  throw lastError;
}

describe("fetchWithRetry", () => {
  it("첫 번째 시도에 성공하면 바로 반환한다", async () => {
    const mockFn = mock().mockResolvedValue("success");

    const result = await fetchWithRetry(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("실패 후 재시도에 성공한다", async () => {
    const mockFn = mock()
      .mockRejectedValueOnce(new Error("First fail"))
      .mockRejectedValueOnce(new Error("Second fail"))
      .mockResolvedValue("success");

    const result = await fetchWithRetry(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("모든 재시도가 실패하면 에러를 던진다", async () => {
    const mockFn = mock().mockRejectedValue(new Error("Always fail"));

    await expect(fetchWithRetry(mockFn, 3)).rejects.toThrow("Always fail");
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
}, 10000);
