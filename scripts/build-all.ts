// scripts/build-all.ts - 모든 플랫폼용 단일 실행 파일 빌드
import { $ } from "bun";

const targets = [
  { target: "linux-x64", output: "bundo-linux-x64" },
  { target: "linux-arm64", output: "bundo-linux-arm64" },
  { target: "darwin-x64", output: "bundo-darwin-x64" },
  { target: "darwin-arm64", output: "bundo-darwin-arm64" },
  { target: "windows-x64", output: "bundo-windows-x64.exe" },
];

console.log("Building for all platforms...\n");

for (const { target, output } of targets) {
  console.log(`Building for ${target}...`);

  await $`bun build --compile --target=${target} --minify ./src/index.ts --outfile ./dist/${output}`;

  const file = Bun.file(`./dist/${output}`);
  const size = (await file.size) / 1024 / 1024;
  console.log(`  -> ${output} (${size.toFixed(2)} MB)\n`);
}

console.log("Build complete!");
