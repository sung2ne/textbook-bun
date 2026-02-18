// tests/validator.test.ts
import { describe, it, expect } from "bun:test";
import { validateEmail, validatePassword } from "../src/lib/validator";

describe("validateEmail", () => {
  it("유효한 이메일을 통과시킨다", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@domain.co.kr")).toBe(true);
  });

  it("빈 이메일을 거부한다", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("너무 긴 이메일을 거부한다", () => {
    const longEmail = "a".repeat(250) + "@b.com";
    expect(validateEmail(longEmail)).toBe(false);
  });

  it("잘못된 형식을 거부한다", () => {
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@domain.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
  });
});

describe("validatePassword", () => {
  it("유효한 비밀번호를 통과시킨다", () => {
    const result = validatePassword("Password123");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("짧은 비밀번호를 거부한다", () => {
    const result = validatePassword("Pass1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("비밀번호는 8자 이상이어야 합니다");
  });

  it("대문자 없는 비밀번호를 거부한다", () => {
    const result = validatePassword("password123");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("대문자를 포함해야 합니다");
  });

  it("소문자 없는 비밀번호를 거부한다", () => {
    const result = validatePassword("PASSWORD123");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("소문자를 포함해야 합니다");
  });

  it("숫자 없는 비밀번호를 거부한다", () => {
    const result = validatePassword("Passwordabc");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("숫자를 포함해야 합니다");
  });

  it("여러 조건을 동시에 위반할 수 있다", () => {
    const result = validatePassword("abc");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
