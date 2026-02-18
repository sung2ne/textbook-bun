# 빌드 스테이지
FROM oven/bun:1.1 AS builder

WORKDIR /app

# 패키지 파일 복사
COPY package.json bun.lock ./

# 모든 의존성 설치 (개발 의존성 포함)
RUN bun install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN bun build ./src/index.ts --outdir ./dist --target bun

# 프로덕션 스테이지
FROM oven/bun:1.1-alpine AS production

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist

# 데이터 디렉토리 생성
RUN mkdir -p /app/data

# 비루트 사용자로 실행 (보안)
USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["bun", "run", "healthcheck.ts"]

CMD ["bun", "run", "dist/index.js"]
