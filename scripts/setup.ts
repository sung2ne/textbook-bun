// scripts/setup.ts - 개발 환경 설정 스크립트
import { info, success, error, step, warn } from "./utils/logger";
import { existsSync } from "fs";

const REQUIRED_TOOLS = ["git", "bun"];
const OPTIONAL_TOOLS = ["node", "docker"];

async function checkTool(tool: string): Promise<boolean> {
  const proc = Bun.spawn(["which", tool], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const exitCode = await proc.exited;
  return exitCode === 0;
}

async function checkRequiredTools(): Promise<boolean> {
  step("필수 도구 확인");
  let allFound = true;

  for (const tool of REQUIRED_TOOLS) {
    const found = await checkTool(tool);
    if (found) {
      success(`${tool} 설치됨`);
    } else {
      error(`${tool} 미설치 - 필수 도구입니다`);
      allFound = false;
    }
  }

  for (const tool of OPTIONAL_TOOLS) {
    const found = await checkTool(tool);
    if (found) {
      success(`${tool} 설치됨`);
    } else {
      warn(`${tool} 미설치 (선택 사항)`);
    }
  }

  return allFound;
}

async function installDependencies(): Promise<boolean> {
  step("의존성 설치");

  const proc = Bun.spawn(["bun", "install"], {
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode === 0) {
    success("의존성 설치 완료");
    return true;
  } else {
    error("의존성 설치 실패");
    return false;
  }
}

async function setupEnvFile(): Promise<void> {
  step(".env 파일 설정");

  if (existsSync(".env")) {
    info(".env 파일이 이미 존재합니다");
    return;
  }

  if (existsSync(".env.example")) {
    const example = await Bun.file(".env.example").text();
    await Bun.write(".env", example);
    success(".env.example → .env 복사 완료");
  } else {
    const defaultEnv = [
      "PORT=3000",
      "NODE_ENV=development",
      "DATABASE_URL=./data/bundо.db",
      "",
    ].join("\n");
    await Bun.write(".env", defaultEnv);
    success(".env 파일 생성 완료 (기본값)");
  }
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  info("BunDo 개발 환경 설정 시작");
  if (isDryRun) warn("DRY RUN 모드 - 실제 변경사항 없음");

  const toolsOk = await checkRequiredTools();
  if (!toolsOk) {
    error("필수 도구가 없습니다. 설치 후 재실행하세요.");
    process.exit(1);
  }

  if (!isDryRun) {
    await installDependencies();
    await setupEnvFile();
  }

  success("개발 환경 설정 완료!");
  info("다음 명령어로 서버를 시작하세요: bun run dev");
}

main();
