import { handleError } from "./errorHandler";

type Handler = (request: Request) => Response | Promise<Response>;

// 동기/비동기 핸들러를 에러 핸들링으로 래핑
export function wrapHandler(handler: Handler): Handler {
  return async (request) => {
    try {
      const response = handler(request);
      return response instanceof Promise ? await response : response;
    } catch (error) {
      return handleError(error, request);
    }
  };
}

// 라우트 객체 전체를 래핑
export function wrapRoutes(
  routes: Record<string, Handler | Record<string, Handler>>
): Record<string, Handler | Record<string, Handler>> {
  const wrapped: Record<string, Handler | Record<string, Handler>> = {};

  for (const [path, handler] of Object.entries(routes)) {
    if (typeof handler === "function") {
      wrapped[path] = wrapHandler(handler);
    } else {
      const wrappedMethods: Record<string, Handler> = {};
      for (const [method, methodHandler] of Object.entries(handler)) {
        wrappedMethods[method] = wrapHandler(methodHandler);
      }
      wrapped[path] = wrappedMethods;
    }
  }

  return wrapped;
}
