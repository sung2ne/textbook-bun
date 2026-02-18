// src/lambda.ts - AWS Lambda 핸들러
// Bun.serve 코드를 AWS Lambda에서 실행하기 위한 어댑터
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createServer } from "./api";

// Lambda용 핸들러 함수
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  // Lambda 이벤트를 Request로 변환
  const url = `https://${event.requestContext.domainName}${event.path}`;
  const request = new Request(url, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
    body: event.body,
  });

  // Bun.serve 라우터로 요청 처리
  const server = createServer();
  const response = await server.fetch(request);

  // Response를 Lambda 형식으로 변환
  const body = await response.text();
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    statusCode: response.status,
    headers,
    body,
  };
}
