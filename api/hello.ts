// api/hello.ts - Vercel Edge Function 예제
export const config = {
  runtime: "edge",
};

export default function handler(request: Request): Response {
  return new Response(
    JSON.stringify({
      message: "Hello from Vercel Edge!",
      timestamp: Date.now(),
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
