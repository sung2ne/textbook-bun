// tests/unit/response.test.ts
import { describe, it, expect } from "bun:test";
import {
  successResponse,
  errorResponse,
  unauthorized,
  notFound,
  badRequest,
} from "../../src/lib/response";

describe("Response Helpers", () => {
  describe("successResponse", () => {
    it("데이터를 포함한 성공 응답을 생성한다", async () => {
      const data = { id: 1, name: "Test" };
      const response = successResponse(data);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
    });

    it("커스텀 상태 코드로 응답을 생성한다", async () => {
      const response = successResponse({ created: true }, 201);
      expect(response.status).toBe(201);
    });

    it("메타 정보를 포함한다", async () => {
      const response = successResponse([], 200, { total: 10, page: 1 });
      const body = await response.json();

      expect(body.meta).toEqual({ total: 10, page: 1 });
    });
  });

  describe("errorResponse", () => {
    it("에러 응답을 생성한다", async () => {
      const response = errorResponse("TEST_ERROR", "Something went wrong", 400);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("TEST_ERROR");
      expect(body.error.message).toBe("Something went wrong");
    });

    it("에러 상세 정보를 포함한다", async () => {
      const response = errorResponse("VALIDATION_ERROR", "Invalid input", 400, {
        field: "email",
      });
      const body = await response.json();

      expect(body.error.details).toEqual({ field: "email" });
    });
  });

  describe("단축 함수", () => {
    it("unauthorized는 401을 반환한다", async () => {
      const response = unauthorized();
      expect(response.status).toBe(401);
    });

    it("notFound는 404를 반환한다", async () => {
      const response = notFound();
      expect(response.status).toBe(404);
    });

    it("badRequest는 400을 반환한다", async () => {
      const response = badRequest("Invalid data");
      expect(response.status).toBe(400);
    });
  });
});
