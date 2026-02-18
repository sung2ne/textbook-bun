import { getSessionFromRequest, type SessionData } from "./session";

type Handler = (request: Request) => Response | Promise<Response>;
type AuthenticatedHandler = (
  request: Request,
  session: SessionData
) => Response | Promise<Response>;

// 인증 필요 래퍼
export function requireAuth(handler: AuthenticatedHandler): Handler {
  return (request) => {
    const session = getSessionFromRequest(request);

    if (!session) {
      return Response.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }

    return handler(request, session);
  };
}
