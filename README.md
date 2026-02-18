# 소설처럼 읽는 Bun - 실습 코드

[위키독스 교재](https://wikidocs.net/book/18983)의 실습 코드 저장소입니다.

Bun 런타임으로 HTTP 서버, WebSocket, SQLite, 테스트, 번들러, 배포까지 단계별로 구현합니다.

## 사용 방법

원하는 챕터의 브랜치를 체크아웃하면 해당 시점까지의 완성된 프로젝트를 받을 수 있습니다.

```bash
# 저장소 클론
git clone https://github.com/sung2ne/textbook-bun.git
cd textbook-bun

# 원하는 챕터로 이동
git checkout part05/chapter-04   # PART 05의 04장까지 완성된 코드
git checkout part11/chapter-07   # PART 11의 07장까지 완성된 코드 (BunDo 완성본)
```

## 브랜치 목록

각 브랜치는 해당 챕터까지의 코드가 누적 적용되어 독립적으로 실행 가능합니다.

> PART 01~04는 독립적인 예제 코드 위주라 별도 브랜치가 없습니다. PART 05부터 BunDo(할 일 관리 앱) 프로젝트가 시작됩니다.

### PART 05. HTTP 서버

| 브랜치 | 내용 |
|--------|------|
| `part05/chapter-01` | 기본 서버 만들기 (Bun.serve, Request/Response) |
| `part05/chapter-02` | 라우팅 구현하기 (Routes API, 동적 파라미터) |
| `part05/chapter-03` | 정적 파일 서빙 (Bun.file, 캐싱, 보안) |
| `part05/chapter-04` | JSON API 만들기 (REST API, CORS, 유효성 검사) |
| `part05/chapter-05` | 쿠키와 세션 (Cookie, 세션 스토어) |
| `part05/chapter-06` | 에러 핸들링 (커스텀 에러, 표준 응답) |
| `part05/chapter-07` | TLS와 HTTPS 설정 (자체 서명 인증서, 프로덕션 설정) |

### PART 06. 데이터베이스 연동

| 브랜치 | 내용 |
|--------|------|
| `part06/chapter-01` | Bun 내장 SQLite (bun:sqlite, 인메모리 DB) |
| `part06/chapter-02` | 트랜잭션과 Prepared Statements |
| `part06/chapter-03` | PostgreSQL 연동 (postgres 드라이버) |
| `part06/chapter-04` | Drizzle ORM 활용 (스키마 정의, 마이그레이션) |

### PART 07. WebSocket 실시간 통신

| 브랜치 | 내용 |
|--------|------|
| `part07/chapter-01` | WebSocket 서버 만들기 (Bun 내장 WebSocket) |
| `part07/chapter-02` | 채팅 애플리케이션 (룸, 연결 관리) |
| `part07/chapter-03` | Pub/Sub 패턴 (채널, 구독) |
| `part07/chapter-04` | 실시간 알림 시스템 (Heartbeat, 재연결) |

### PART 08. Bun 번들러

| 브랜치 | 내용 |
|--------|------|
| `part08/chapter-01` | 번들러 기초 (Bun.build, 엔트리포인트) |
| `part08/chapter-02` | TypeScript와 JSX 번들링 (React 컴포넌트) |
| `part08/chapter-03` | CSS 처리 (CSS 모듈, 인라인) |
| `part08/chapter-04` | HTML 정적 사이트 (HTML 엔트리포인트) |
| `part08/chapter-05` | 로더와 플러그인 (커스텀 로더) |
| `part08/chapter-06` | 코드 스플리팅 (청크 분리, 지연 로딩) |
| `part08/chapter-07` | 프로덕션 최적화 (minify, sourcemap) |

### PART 09. 테스트 러너

| 브랜치 | 내용 |
|--------|------|
| `part09/chapter-01` | 테스트 시작하기 (bun:test, describe, it) |
| `part09/chapter-02` | 단언문과 매처 (expect, toBe, toEqual) |
| `part09/chapter-03` | Mock과 Spy (mock.module, spyOn) |
| `part09/chapter-04` | 스냅샷 테스트 (toMatchSnapshot) |
| `part09/chapter-05` | 비동기 테스트 (async/await, 타임아웃) |
| `part09/chapter-06` | DOM 테스트 (happy-dom 통합) |
| `part09/chapter-07` | 코드 커버리지 (--coverage, 리포트) |

### PART 10. 쉘과 프로세스

| 브랜치 | 내용 |
|--------|------|
| `part10/chapter-01` | Bun Shell ($ 템플릿 리터럴, 파이프) |
| `part10/chapter-02` | 자식 프로세스 (Bun.spawn, 스트림) |
| `part10/chapter-03` | 스크립트 자동화 (빌드, 배포 스크립트) |

### PART 11. 실전 프로젝트 (BunDo)

| 브랜치 | 내용 |
|--------|------|
| `part11/chapter-01` | 프로젝트 설계 (아키텍처, 폴더 구조) |
| `part11/chapter-02` | 프로젝트 구조 (레이어 분리, 타입 정의) |
| `part11/chapter-03` | 데이터베이스 스키마 (SQLite, 마이그레이션) |
| `part11/chapter-04` | CRUD API 구현 (할 일, 카테고리, 게시글) |
| `part11/chapter-05` | 인증 구현 (JWT, HMAC-SHA256, 세션) |
| `part11/chapter-06` | 테스트 작성 (단위 테스트, 통합 테스트) |
| `part11/chapter-07` | API 문서화 (OpenAPI 3.1, /docs 엔드포인트) |

### PART 12. Node.js에서 마이그레이션

| 브랜치 | 내용 |
|--------|------|
| `part12/chapter-01` | 호환성 확인 (Node.js API 호환성 체크) |
| `part12/chapter-02` | Express.js 마이그레이션 (Bun.serve로 전환) |
| `part12/chapter-03` | 패키지 전환 (GitHub Actions CI, Dockerfile) |
| `part12/chapter-04` | 테스트 마이그레이션 (Jest → bun:test) |
| `part12/chapter-05` | 성능 비교 (벤치마크, 시작 시간, 처리량) |

### PART 13. 배포와 운영

| 브랜치 | 내용 |
|--------|------|
| `part13/chapter-01` | 단일 실행 파일 빌드 (bun build --compile, 크로스 컴파일) |
| `part13/chapter-02` | Docker 배포 (멀티 스테이지 빌드, oven/bun 이미지) |
| `part13/chapter-03` | 클라우드 배포 (Fly.io, Render, Nixpacks) |
| `part13/chapter-04` | 서버리스 배포 (AWS Lambda, Vercel Edge, Cloudflare Workers) |
| `part13/chapter-05` | 모니터링과 로깅 (Prometheus, JSON 구조화 로그, Sentry) |

## 기술 스택

- **런타임**: Bun 1.3.9
- **웹 서버**: Bun.serve (Routes API)
- **데이터베이스**: bun:sqlite (내장), PostgreSQL
- **ORM**: Drizzle ORM
- **인증**: Web Crypto API (HMAC-SHA256 JWT)
- **실시간 통신**: Bun 내장 WebSocket
- **테스트**: bun:test (내장 테스트 러너), happy-dom
- **번들러**: Bun 내장 번들러
- **모니터링**: Prometheus 형식 메트릭, 구조화 JSON 로깅
- **배포**: Docker, AWS Lambda, Cloudflare Workers, Fly.io, Render

## 실행 방법

```bash
# 의존성 설치
bun install

# 개발 서버 실행 (Watch 모드)
bun --watch src/index.ts

# 또는 package.json 스크립트 사용
bun run dev

# 서버 실행 (기본 포트: 3000)
bun run start

# API 문서 확인 (PART 11 이후)
# http://localhost:3000/docs
```

## 테스트

```bash
# 전체 테스트 실행
bun test

# 커버리지 포함
bun test --coverage

# 특정 파일만
bun test src/lib/auth.test.ts
```

## 프로젝트 구조

```
├── src/
│   ├── index.ts                # 엔트리포인트 (Bun.serve)
│   ├── types.ts                # 공통 타입 정의
│   ├── api/
│   │   ├── index.ts            # 라우터 통합, 미들웨어 적용
│   │   ├── auth.ts             # 인증 API (로그인, 회원가입)
│   │   ├── todos.ts            # 할 일 API (CRUD)
│   │   └── docs.ts             # OpenAPI 문서 엔드포인트
│   ├── db/
│   │   ├── index.ts            # DB 연결 및 초기화 (bun:sqlite)
│   │   ├── schema.ts           # Drizzle ORM 스키마
│   │   ├── todos.ts            # 할 일 데이터 접근
│   │   └── users.ts            # 사용자 데이터 접근
│   ├── lib/
│   │   ├── auth.ts             # JWT 생성/검증 (Web Crypto API)
│   │   ├── session.ts          # 세션 관리
│   │   ├── sessionStore.ts     # 세션 스토어
│   │   ├── logger.ts           # 구조화 JSON 로거
│   │   ├── metrics.ts          # Prometheus 메트릭 수집
│   │   ├── alerting.ts         # Slack/PagerDuty 알림
│   │   ├── sentry.ts           # Sentry 에러 트래킹
│   │   ├── errorHandler.ts     # 중앙 에러 핸들러
│   │   ├── errors.ts           # 커스텀 에러 클래스
│   │   ├── response.ts         # 표준 응답 유틸리티
│   │   ├── validator.ts        # 유효성 검사
│   │   └── cookie.ts           # 쿠키 파서
│   ├── middleware/
│   │   └── requestLogger.ts    # HTTP 요청 로깅 미들웨어
│   ├── routes/
│   │   ├── todos.ts            # 할 일 라우트 핸들러
│   │   ├── users.ts            # 사용자 라우트 핸들러
│   │   ├── posts.ts            # 게시글 라우트 핸들러
│   │   ├── categories.ts       # 카테고리 라우트 핸들러
│   │   ├── health.ts           # 헬스체크 엔드포인트
│   │   └── metrics.ts          # 메트릭 엔드포인트
│   ├── ws/
│   │   ├── handler.ts          # WebSocket 이벤트 핸들러
│   │   ├── pubsub.ts           # Pub/Sub 채널 관리
│   │   └── heartbeat.ts        # Heartbeat / 연결 유지
│   ├── cli/
│   │   ├── system.ts           # 시스템 정보 CLI
│   │   └── process-monitor.ts  # 프로세스 모니터 CLI
│   └── lambda.ts               # AWS Lambda 어댑터
├── scripts/
│   ├── build.ts                # 빌드 스크립트
│   ├── build-all.ts            # 크로스 컴파일 (5개 플랫폼)
│   ├── setup.ts                # 프로젝트 초기 설정
│   └── test.ts                 # 테스트 + 커버리지 스크립트
├── examples/
│   ├── migration/              # Node.js → Bun 마이그레이션 예제
│   ├── benchmark/              # 성능 비교 예제
│   └── serverless/cloudflare/  # Cloudflare Workers 예제
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions CI
├── Dockerfile                  # 멀티 스테이지 Docker 빌드
├── docker-compose.yml          # Docker Compose 설정
├── healthcheck.ts              # Docker 헬스체크 스크립트
├── wrangler.toml               # Cloudflare Workers 설정
├── serverless.yml              # AWS Serverless Framework 설정
├── fly.toml                    # Fly.io 배포 설정
├── render.yaml                 # Render.com 배포 설정
└── nixpacks.toml               # Nixpacks 빌드 설정
```

## 라이선스

이 저장소는 [소설처럼 읽는 Bun](https://wikidocs.net/book/18983) 교재의 실습 코드입니다.
