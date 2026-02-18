// tests/unit/auth.test.ts
import { describe, it, expect } from "bun:test";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyToken,
} from "../../src/lib/auth";

describe("Auth Utilities", () => {
  describe("Password Hashing", () => {
    it("비밀번호를 해싱한다", async () => {
      const password = "mySecurePassword123";
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash).toStartWith("$argon2id$");
    });

    it("올바른 비밀번호를 검증한다", async () => {
      const password = "mySecurePassword123";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("잘못된 비밀번호를 거부한다", async () => {
      const password = "mySecurePassword123";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword("wrongPassword", hash);
      expect(isValid).toBe(false);
    });

    it("같은 비밀번호라도 다른 해시를 생성한다", async () => {
      const password = "mySecurePassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("JWT Token", () => {
    const testUser = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
    };

    it("유효한 토큰을 생성한다", async () => {
      const token = await generateAccessToken(testUser);

      expect(token).toBeDefined();
      expect(token.split(".")).toHaveLength(3);
    });

    it("유효한 토큰을 검증한다", async () => {
      const token = await generateAccessToken(testUser);
      const payload = await verifyToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(testUser.id);
      expect(payload?.email).toBe(testUser.email);
      expect(payload?.name).toBe(testUser.name);
    });

    it("잘못된 토큰을 거부한다", async () => {
      const payload = await verifyToken("invalid.token.here");
      expect(payload).toBeNull();
    });

    it("변조된 토큰을 거부한다", async () => {
      const token = await generateAccessToken(testUser);
      const parts = token.split(".");
      parts[1] = parts[1] + "tampered";
      const tamperedToken = parts.join(".");

      const payload = await verifyToken(tamperedToken);
      expect(payload).toBeNull();
    });

    it("만료 시간을 포함한다", async () => {
      const token = await generateAccessToken(testUser);
      const payload = await verifyToken(token);

      expect(payload?.exp).toBeDefined();
      expect(payload?.iat).toBeDefined();
      expect(payload!.exp).toBeGreaterThan(payload!.iat);
    });
  });
});
