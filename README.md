# 할 일을 기억해라

Windows에서 실행되는 로컬 전용 스티커 캘린더 앱입니다.

구글 캘린더처럼 깔끔한 월간 달력 화면을 기본으로 제공하고, 오른쪽 상세 패널에서 날짜별 할 일을 빠르게 추가하고 관리합니다. 계정, 서버, 인터넷 연결 없이 내 PC의 로컬 파일에만 데이터를 저장합니다.

## Project Goals

- Windows에서 가볍게 실행되는 데스크톱 앱
- 월간 달력 중심의 할 일 관리
- 스티커 메모처럼 항상 위에 띄워두는 사용감
- 로컬 JSON 파일 저장
- AI 구현과 검증을 위한 하네스 문서/시나리오 포함

## Planned Stack

- Electron
- React
- TypeScript
- Local JSON storage
- Windows notifications

## Structure

```text
docs/       제품 명세, 데이터 모델, UX 흐름, 의사결정 기록
harness/    AI 구현 프롬프트, 검증 시나리오, 테스트 데이터, 체크리스트
src/        실제 앱 코드가 들어갈 영역
```

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run test
npm run build
npm run validate:fixtures
```

Create a Windows installer:

```bash
npm run dist
```

The installer is written to `release/`.

Publish a GitHub Release for auto-update:

```bash
$env:GH_TOKEN="your_github_token"
npm version patch
npm run dist:publish
```

Auto-update uses GitHub Releases from `GasingKwon/mycomputer-calendar`. The app checks for updates only after it is installed as a packaged app.

If dependency postinstall scripts fail from a non-ASCII Windows path, install from an ASCII path such as `C:\tmp` and copy the resulting `node_modules` and `package-lock.json` back into the project. This workspace currently uses that workaround for verification.

## Current Phase

MVP implementation is in progress using the Phase-based harness in `docs/implementation-plan.md` and `harness/prompts/full-mvp.md`.
