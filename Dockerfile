FROM oven/bun:1 as base
WORKDIR /app

# 의존성 설치
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# 소스 복사
COPY . .

# 실행
CMD ["bun", "run", "src/index.ts"]
