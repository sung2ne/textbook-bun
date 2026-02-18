// frontend/build.ts
import { existsSync, mkdirSync, rmSync } from "fs";
import { gzipSync } from "bun";
import { versionPlugin } from "./plugins/version";

const DIST_DIR = "./dist";
const isDev = process.env.NODE_ENV !== "production";

// 빌드 시작 시간
const startTime = performance.now();

console.log(`빌드 모드: ${isDev ? "개발" : "프로덕션"}`);
console.log("");

// dist 폴더 초기화
if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true });
}
mkdirSync(DIST_DIR);

// 빌드 실행
const result = await Bun.build({
  entrypoints: ["./public/index.html"],
  outdir: DIST_DIR,
  target: "browser",

  // 프로덕션 최적화
  minify: !isDev,
  splitting: true,
  sourcemap: isDev ? "linked" : "external",

  // 환경 변수
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "process.env.API_URL": JSON.stringify(
      process.env.API_URL || "http://localhost:3000"
    ),
  },

  // 플러그인
  plugins: [versionPlugin],
});

if (!result.success) {
  console.error("빌드 실패:");
  for (const log of result.logs) {
    console.error(`  ${log.message}`);
  }
  process.exit(1);
}

// 정적 자원 복사
const staticFiles = ["favicon.ico", "robots.txt", "manifest.json"];
for (const file of staticFiles) {
  const src = `./public/${file}`;
  if (existsSync(src)) {
    await Bun.write(Bun.file(`${DIST_DIR}/${file}`), Bun.file(src));
  }
}

// 빌드 결과 출력
const duration = (performance.now() - startTime).toFixed(0);
console.log("빌드 완료!");
console.log(`소요 시간: ${duration}ms`);
console.log("");

console.log("출력 파일:");
console.log("-".repeat(60));

let totalSize = 0;
let totalGzipSize = 0;

for (const output of result.outputs) {
  const content = await output.arrayBuffer();
  const size = content.byteLength;
  totalSize += size;

  const fileName = output.path.replace(DIST_DIR + "/", "");

  if (!isDev) {
    const compressed = gzipSync(new Uint8Array(content));
    const gzipSize = compressed.byteLength;
    totalGzipSize += gzipSize;

    console.log(
      `  ${fileName.padEnd(30)} ` +
      `${(size / 1024).toFixed(2).padStart(8)} KB → ` +
      `${(gzipSize / 1024).toFixed(2).padStart(8)} KB (gzip)`
    );
  } else {
    console.log(
      `  ${fileName.padEnd(30)} ${(size / 1024).toFixed(2).padStart(8)} KB`
    );
  }
}

console.log("-".repeat(60));

if (!isDev) {
  console.log(
    `  ${"총계".padEnd(30)} ` +
    `${(totalSize / 1024).toFixed(2).padStart(8)} KB → ` +
    `${(totalGzipSize / 1024).toFixed(2).padStart(8)} KB (gzip)`
  );
} else {
  console.log(
    `  ${"총계".padEnd(30)} ${(totalSize / 1024).toFixed(2).padStart(8)} KB`
  );
}

console.log("");
console.log(`출력 디렉토리: ${DIST_DIR}`);
