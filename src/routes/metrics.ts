// src/routes/metrics.ts - Prometheus 형식 메트릭 엔드포인트
interface Counter {
  name: string;
  help: string;
  values: Map<string, number>;
}

class MetricsRegistry {
  private counters = new Map<string, Counter>();

  incCounter(name: string, labels: Record<string, string> = {}) {
    const key = this.labelsToString(labels);
    let counter = this.counters.get(name);

    if (!counter) {
      counter = { name, help: "", values: new Map() };
      this.counters.set(name, counter);
    }

    const current = counter.values.get(key) || 0;
    counter.values.set(key, current + 1);
  }

  private labelsToString(labels: Record<string, string>): string {
    return Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
  }

  toPrometheusFormat(): string {
    const lines: string[] = [];

    for (const [name, counter] of this.counters) {
      lines.push(`# HELP ${name} ${counter.help}`);
      lines.push(`# TYPE ${name} counter`);
      for (const [labels, value] of counter.values) {
        const labelStr = labels ? `{${labels}}` : "";
        lines.push(`${name}${labelStr} ${value}`);
      }
    }

    return lines.join("\n");
  }
}

export const registry = new MetricsRegistry();

export function metricsHandler(): Response {
  return new Response(registry.toPrometheusFormat(), {
    headers: { "Content-Type": "text/plain" },
  });
}
