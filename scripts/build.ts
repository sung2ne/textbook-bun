// scripts/build.ts - 빌드 자동화 스크립트
import { info, success, error, step } from "./utils/logger";

interface BuildOptions {
  minify: boolean;
  sourcemap: boolean;
  target: "bun" | "node" | "browser";
  outdir: string;
}

const defaultOptions: BuildOptions = {
  minify: false,
  sourcemap: true,
  target: "bun",
  outdir: "./dist",
};

function parseArgs(): Partial<BuildOptions> {
  const args = process.argv.slice(2);
  const options: Partial<BuildOptions> = {};

  for (const arg of args) {
    if (arg === "--minify") options.minify = true;
    if (arg === "--no-sourcemap") options.sourcemap = false;
    if (arg.startsWith("--target=")) {
      options.target = arg.split("=")[1] as BuildOptions["target"];
    }
    if (arg.startsWith("--outdir=")) {
      options.outdir = arg.split("=")[1];
    }
  }

  return options;
}

async function typeCheck(): Promise<boolean> {
  step("타입 검사");
  const proc = Bun.spawn(["bunx", "tsc", "--noEmit"], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    error("타입 오류 발견:");
    console.error(stderr || stdout);
    return false;
  }

  success("타입 검사 통과");
  return true;
}

async function buildProject(options: BuildOptions): Promise<boolean> {
  step(`빌드 시작 (target: ${options.target})`);

  const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: options.outdir,
    minify: options.minify,
    sourcemap: options.sourcemap ? "external" : "none",
    target: options.target,
  });

  if (!result.success) {
    error("빌드 실패:");
    for (const log of result.logs) {
      console.error(log);
    }
    return false;
  }

  success(`빌드 완료 → ${options.outdir}`);
  info(`빌드된 파일: ${result.outputs.length}개`);
  return true;
}

async function main() {
  const args = parseArgs();
  const options = { ...defaultOptions, ...args };

  info(`빌드 옵션: ${JSON.stringify(options)}`);

  const typeCheckPassed = await typeCheck();
  if (!typeCheckPassed) {
    process.exit(1);
  }

  const buildSuccess = await buildProject(options);
  if (!buildSuccess) {
    process.exit(1);
  }

  success("모든 빌드 단계 완료!");
}

main();
