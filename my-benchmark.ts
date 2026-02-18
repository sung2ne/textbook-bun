// my-benchmark.ts - 간단한 성능 측정 유틸리티
// 실행: bun run my-benchmark.ts
const results: Record<string, number[]> = {};

function bench(name: string, fn: () => void, iterations = 1000) {
  const times: number[] = [];

  // 워밍업
  for (let i = 0; i < 100; i++) fn();

  // 측정
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`${name}:`);
  console.log(`  avg: ${avg.toFixed(4)}ms`);
  console.log(`  min: ${min.toFixed(4)}ms`);
  console.log(`  max: ${max.toFixed(4)}ms`);
}

// 테스트할 기능 추가
bench("JSON parse", () => {
  JSON.parse('{"name":"test","value":123}');
});

bench("JSON stringify", () => {
  JSON.stringify({ name: "test", value: 123 });
});
