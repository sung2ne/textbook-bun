// scripts/utils/logger.ts - 스크립트용 로거
export const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

export function info(message: string): void {
  console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
}

export function success(message: string): void {
  console.log(`${colors.green}[OK]${colors.reset} ${message}`);
}

export function error(message: string): void {
  console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

export function warn(message: string): void {
  console.warn(`${colors.yellow}[WARN]${colors.reset} ${message}`);
}

export function step(title: string): void {
  console.log(`\n${colors.bold}${colors.cyan}▶ ${title}${colors.reset}`);
}
