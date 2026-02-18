// file-benchmark.ts - 파일 읽기 성능 측정
// 실행: bun run file-benchmark.ts
const iterations = 10000;
const filePath = "package.json";

const start = performance.now();

for (let i = 0; i < iterations; i++) {
  // Bun 네이티브 파일 API
  await Bun.file(filePath).text();

  // Node.js 방식 비교 시:
  // fs.readFileSync(filePath, "utf-8");
}

const end = performance.now();
console.log(`${iterations} reads: ${(end - start).toFixed(2)}ms`);
