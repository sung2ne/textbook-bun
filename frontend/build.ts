// frontend/build.ts
const result = await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./dist",
  target: "browser",
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production" ? "external" : "none",
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});

if (result.success) {
  console.log("BunDo 프론트엔드 빌드 완료!");
  for (const output of result.outputs) {
    const size = (await output.arrayBuffer()).byteLength;
    console.log(`  ${output.path} (${(size / 1024).toFixed(2)} KB)`);
  }
} else {
  console.error("빌드 실패:");
  result.logs.forEach((log) => console.error(`  ${log.message}`));
  process.exit(1);
}
