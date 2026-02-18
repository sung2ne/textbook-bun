// frontend/plugins/version.ts
import type { BunPlugin } from "bun";

export const versionPlugin: BunPlugin = {
  name: "version-plugin",
  setup(build) {
    build.onResolve({ filter: /^virtual:version$/ }, () => {
      return {
        path: "virtual:version",
        namespace: "version",
      };
    });

    build.onLoad({ filter: /.*/, namespace: "version" }, async () => {
      // package.json에서 버전 읽기
      const pkg = await Bun.file("../package.json").json();

      const versionInfo = {
        version: pkg.version || "0.0.0",
        buildTime: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || "development",
        bunVersion: Bun.version,
      };

      return {
        contents: `export default ${JSON.stringify(versionInfo)};`,
        loader: "js",
      };
    });
  },
};
