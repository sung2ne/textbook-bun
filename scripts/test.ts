// scripts/test.ts - 테스트 자동화 스크립트
import { info, success, error, step, warn } from "./utils/logger";

interface TestOptions {
  coverage: boolean;
  watch: boolean;
  pattern?: string;
  bail: boolean;
}

function parseArgs(): TestOptions {
  const args = process.argv.slice(2);
  return {
    coverage: args.includes("--coverage"),
    watch: args.includes("--watch"),
    bail: args.includes("--bail"),
    pattern: args.find((a) => !a.startsWith("--")),
  };
}

async function runTests(options: TestOptions): Promise<boolean> {
  step("테스트 실행");

  const cmd = ["bun", "test"];

  if (options.coverage) cmd.push("--coverage");
  if (options.watch) cmd.push("--watch");
  if (options.bail) cmd.push("--bail");
  if (options.pattern) cmd.push(options.pattern);

  info(`명령어: ${cmd.join(" ")}`);

  const proc = Bun.spawn(cmd, {
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  return exitCode === 0;
}

async function main() {
  const options = parseArgs();

  info("BunDo 테스트 스크립트 시작");
  if (options.coverage) info("커버리지 측정 활성화");
  if (options.pattern) info(`테스트 패턴: ${options.pattern}`);

  const passed = await runTests(options);

  if (passed) {
    success("모든 테스트 통과!");
  } else {
    error("테스트 실패");
    process.exit(1);
  }
}

main();
