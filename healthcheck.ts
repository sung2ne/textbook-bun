// healthcheck.ts - Docker 컨테이너 헬스 체크 스크립트
const response = await fetch("http://localhost:3000/health");
process.exit(response.ok ? 0 : 1);
