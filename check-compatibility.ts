// check-compatibility.ts - Bun 호환성 빠른 확인 스크립트
const issues: string[] = [];

// package.json 읽기
const pkg = await Bun.file("package.json").json();

// 위험한 의존성 확인
const riskyDeps = ["cluster", "node-gyp", "node-pre-gyp"];
const allDeps = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
};

for (const dep of Object.keys(allDeps)) {
  if (riskyDeps.some((r) => dep.includes(r))) {
    issues.push(`주의 필요: ${dep}`);
  }
}

// 결과 출력
if (issues.length === 0) {
  console.log("호환성 문제가 발견되지 않았습니다.");
  console.log("bun install && bun run <entry> 로 직접 테스트해보세요.");
} else {
  console.log("다음 항목을 확인하세요:");
  issues.forEach((issue) => console.log(`  - ${issue}`));
}
