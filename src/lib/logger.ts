type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data }),
    };

    if (process.env.NODE_ENV !== "production") {
      console[level](JSON.stringify(entry, null, 2));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, data?: unknown) { this.log("debug", message, data); }
  info(message: string, data?: unknown) { this.log("info", message, data); }
  warn(message: string, data?: unknown) { this.log("warn", message, data); }
  error(message: string, data?: unknown) { this.log("error", message, data); }
}

export const logger = new Logger();
