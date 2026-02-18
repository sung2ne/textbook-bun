// frontend/src/utils.ts
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("ko-KR");
}
