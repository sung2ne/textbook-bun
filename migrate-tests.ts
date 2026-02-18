// migrate-tests.ts - Jest 테스트를 bun:test로 자동 마이그레이션하는 스크립트
import { $ } from "bun";

const testFiles = await $`find . -name "*.test.ts" -o -name "*.spec.ts"`.text();
const files = testFiles.trim().split("\n").filter(Boolean);

for (const file of files) {
  let content = await Bun.file(file).text();

  // 이미 import가 있으면 스킵
  if (content.includes('from "bun:test"')) {
    console.log(`Skip: ${file}`);
    continue;
  }

  // 사용된 함수 찾기
  const functions = ["describe", "it", "test", "expect", "beforeAll", "afterAll", "beforeEach", "afterEach", "mock"];
  const usedFunctions = functions.filter((fn) => content.includes(fn + "("));

  if (usedFunctions.length > 0) {
    const importStatement = `import { ${usedFunctions.join(", ")} } from "bun:test";\n\n`;
    content = importStatement + content;
    await Bun.write(file, content);
    console.log(`Updated: ${file}`);
  }
}

console.log("Migration complete!");
