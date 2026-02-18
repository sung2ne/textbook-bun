// src/lib/alerting.ts - 알림 시스템
interface Alert {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
}

export async function sendAlert(alert: Alert) {
  // Slack 알림
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `[${alert.severity.toUpperCase()}] ${alert.title}\n${alert.description}`,
      }),
    });
  }

  // 이메일, PagerDuty 등 추가 가능
}
