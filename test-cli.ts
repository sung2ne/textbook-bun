// test-cli.ts
import { showSystemInfo, checkDependencies } from "./src/cli/system";

await showSystemInfo();
console.log("");
await checkDependencies();
