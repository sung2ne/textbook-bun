// frontend/build.ts
import { existsSync, mkdirSync, rmSync } from "fs";

const DIST_DIR = "./dist";

// dist 폴더 초기화
if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true });
}
mkdirSync(DIST_DIR);

// HTML을 엔트리 포인트로 빌드
const result = await Bun.build({
  entrypoints: ["./public/index.html"],
  outdir: DIST_DIR,
  target: "browser",
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production" ? "external" : "none",
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});

if (!result.success) {
  console.error("빌드 실패:");
  result.logs.forEach((log) => console.error(`  ${log.message}`));
  process.exit(1);
}

// favicon 복사
if (existsSync("./public/favicon.ico")) {
  await Bun.write(
    Bun.file(`${DIST_DIR}/favicon.ico`),
    Bun.file("./public/favicon.ico")
  );
}

console.log("BunDo 정적 사이트 빌드 완료!");
for (const output of result.outputs) {
  const size = (await output.arrayBuffer()).byteLength;
  const sizeKB = (size / 1024).toFixed(2);
  console.log(`  ${output.path} (${sizeKB} KB)`);
}
