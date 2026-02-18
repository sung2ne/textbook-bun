// src/lib/sentry.ts - Sentry 에러 추적 연동
const SENTRY_DSN = process.env.SENTRY_DSN;

export async function captureException(
  error: Error,
  context?: Record<string, unknown>
) {
  if (!SENTRY_DSN) return;

  const payload = {
    exception: {
      values: [
        {
          type: error.name,
          value: error.message,
          stacktrace: {
            frames: parseStack(error.stack),
          },
        },
      ],
    },
    extra: context,
    timestamp: Date.now() / 1000,
  };

  try {
    await fetch(SENTRY_DSN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to send to Sentry:", err);
  }
}

function parseStack(stack?: string) {
  if (!stack) return [];
  // 스택 트레이스 파싱 로직
  return stack.split("\n").map((line) => ({ filename: line }));
}
