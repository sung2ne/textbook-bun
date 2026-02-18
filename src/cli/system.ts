// src/cli/system.ts
import { $ } from "bun";

export async function showSystemInfo() {
  console.log("=== BunDo 시스템 정보 ===\n");

  // Bun 버전
  const bunVersion = await $`bun --version`.text();
  console.log("Bun 버전:", bunVersion.trim());

  // 운영체제 정보
  const os = await $`uname -s`.text();
  console.log("운영체제:", os.trim());

  // 현재 디렉토리
  const cwd = await $`pwd`.text();
  console.log("작업 디렉토리:", cwd.trim());

  // 디스크 사용량 (macOS/Linux)
  try {
    const disk = await $`df -h . | tail -1`.text();
    const parts = disk.trim().split(/\s+/);
    console.log("디스크 사용량:", parts[4]);
  } catch {
    console.log("디스크 정보를 가져올 수 없습니다.");
  }

  console.log("\n=========================");
}

export async function checkDependencies() {
  console.log("=== 의존성 검사 ===\n");

  const commands = ["git", "node", "bun"];

  for (const cmd of commands) {
    const result = await $`which ${cmd}`.nothrow().quiet();

    if (result.exitCode === 0) {
      const version = await $`${cmd} --version`.quiet().text();
      console.log(`[OK] ${cmd}: ${version.trim().split("\n")[0]}`);
    } else {
      console.log(`[X] ${cmd}: 설치되지 않음`);
    }
  }

  console.log("\n====================");
}
