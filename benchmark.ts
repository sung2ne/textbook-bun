// benchmark.ts - 시작 시간과 테스트 실행 속도 비교
// 실행: bun run benchmark.ts
import { $ } from "bun";

async function benchmark(name: string, command: string) {
  const runs = 5;
  const times: number[] = [];

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await $`${command}`.quiet();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / runs;
  console.log(`${name}: ${avg.toFixed(2)}ms (avg of ${runs} runs)`);
}

console.log("=== Startup Time ===");
await benchmark("Node.js", "node --loader ts-node/esm src/index.ts");
await benchmark("Bun", "bun run src/index.ts");

console.log("\n=== Test Execution ===");
await benchmark("Jest", "npx jest --silent");
await benchmark("bun test", "bun test");
