// frontend/src/types/virtual.d.ts
declare module "virtual:version" {
  interface VersionInfo {
    version: string;
    buildTime: string;
    nodeEnv: string;
    bunVersion: string;
  }

  const versionInfo: VersionInfo;
  export default versionInfo;
}
