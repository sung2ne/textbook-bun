// frontend/build.ts
const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "browser",
});

if (result.success) {
  console.log("프론트엔드 빌드 완료!");
  for (const output of result.outputs) {
    console.log(`  생성: ${output.path}`);
  }
} else {
  console.error("빌드 실패:");
  for (const log of result.logs) {
    console.error(`  ${log.message}`);
  }
  process.exit(1);
}
