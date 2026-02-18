// src/api/auth.ts - 인증 API (회원가입, 로그인, 토큰 갱신)
import { successResponse, errorResponse, conflict, unauthorized, badRequest } from "../lib/response";
import { generateToken, hashPassword, verifyPassword, verifyJWT, type AuthUser } from "../lib/auth";
import * as userDb from "../db/users";

export const authRoutes = {
  // POST /auth/register - 회원가입
  async register(req: Request): Promise<Response> {
    let body: { email?: string; password?: string; name?: string };
    try {
      body = await req.json();
    } catch {
      return badRequest("유효하지 않은 JSON입니다.");
    }

    if (!body.email || !body.password || !body.name) {
      return badRequest("이메일, 비밀번호, 이름은 필수입니다.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return badRequest("유효하지 않은 이메일 형식입니다.", { field: "email" });
    }

    if (body.password.length < 8) {
      return badRequest("비밀번호는 8자 이상이어야 합니다.", { field: "password" });
    }

    if (userDb.existsByEmail(body.email)) {
      return conflict("이미 사용 중인 이메일입니다.");
    }

    const hashedPassword = await hashPassword(body.password);
    const user = userDb.create({
      email: body.email,
      password: hashedPassword,
      name: body.name,
    });

    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name };
    const token = await generateToken(authUser);

    return successResponse(
      { token, user: { id: user.id, email: user.email, name: user.name } },
      201
    );
  },

  // POST /auth/login - 로그인
  async login(req: Request): Promise<Response> {
    let body: { email?: string; password?: string };
    try {
      body = await req.json();
    } catch {
      return badRequest("유효하지 않은 JSON입니다.");
    }

    if (!body.email || !body.password) {
      return badRequest("이메일과 비밀번호를 입력하세요.");
    }

    const userRecord = userDb.findByEmail(body.email);
    if (!userRecord) {
      return unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const valid = await verifyPassword(body.password, userRecord.password);
    if (!valid) {
      return unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const authUser: AuthUser = { id: userRecord.id, email: userRecord.email, name: userRecord.name };
    const token = await generateToken(authUser);

    return successResponse({
      token,
      user: { id: userRecord.id, email: userRecord.email, name: userRecord.name },
    });
  },

  // POST /auth/refresh - 토큰 갱신
  async refresh(req: Request): Promise<Response> {
    let body: { token?: string };
    try {
      body = await req.json();
    } catch {
      return badRequest("유효하지 않은 JSON입니다.");
    }

    if (!body.token) {
      return badRequest("토큰이 필요합니다.");
    }

    const payload = await verifyJWT(body.token);
    if (!payload) {
      return unauthorized("유효하지 않거나 만료된 토큰입니다.");
    }

    const authUser: AuthUser = { id: payload.userId, email: payload.email, name: payload.name };
    const newToken = await generateToken(authUser);

    return successResponse({ token: newToken });
  },
};
