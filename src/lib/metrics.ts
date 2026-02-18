// src/lib/metrics.ts - 메트릭 수집 유틸리티
interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: number;
}

const metrics: Metric[] = [];

export function recordMetric(
  name: string,
  value: number,
  tags: Record<string, string> = {}
) {
  metrics.push({
    name,
    value,
    tags,
    timestamp: Date.now(),
  });

  // 주기적으로 외부 서비스로 전송
  if (metrics.length >= 100) {
    flushMetrics();
  }
}

async function flushMetrics() {
  const toSend = metrics.splice(0, 100);
  // Datadog, Prometheus 등으로 전송
  console.log("Flushing metrics:", toSend.length);
}

// 응답 시간 측정 예시
export function measureResponseTime(
  route: string,
  method: string,
  duration: number,
  status: number
) {
  recordMetric("http_request_duration_ms", duration, {
    route,
    method,
    status: String(status),
  });
}
