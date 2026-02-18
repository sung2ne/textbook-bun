import { HttpError, InternalServerError } from "./errors";
import { logger } from "./logger";

export function handleError(error: unknown, request?: Request): Response {
  const path = request ? new URL(request.url).pathname : undefined;

  if (error instanceof HttpError) {
    if (error.statusCode >= 500) {
      logger.error("Server error", {
        code: error.code,
        message: error.message,
        path,
        stack: error.stack,
      });
    } else {
      logger.warn("Client error", {
        code: error.code,
        message: error.message,
        path,
      });
    }
    return error.toResponse(path);
  }

  if (error instanceof Error) {
    logger.error("Unhandled error", {
      message: error.message,
      path,
      stack: error.stack,
    });
  } else {
    logger.error("Unknown error", { error, path });
  }

  return new InternalServerError().toResponse(path);
}
