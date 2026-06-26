# Implementation Prompt

이 프롬프트는 AI에게 기능 구현을 맡길 때 사용합니다.

## Context

프로젝트는 Windows용 로컬 스티커 캘린더 앱 **할 일을 기억해라**입니다.

구현 전에 다음 문서를 반드시 확인하세요.

- `docs/product-spec.md`
- `docs/data-model.md`
- `docs/ux-flow.md`
- `docs/decisions.md`
- `harness/checklists/mvp-acceptance.md`

## Implementation Rules

- Electron + React + TypeScript 기준으로 구현합니다.
- 사용자 데이터는 로컬 JSON 파일에만 저장합니다.
- 네트워크, 로그인, 서버 기능을 추가하지 않습니다.
- 날짜/반복/저장 로직은 UI와 분리하여 테스트 가능하게 작성합니다.
- MVP 범위 밖의 기능은 구현하지 말고 `docs/decisions.md` 또는 별도 TODO에 기록합니다.

## Output Expectations

- 변경한 파일 목록
- 구현한 기능 요약
- 실행/검증 명령
- 미완성 항목 또는 리스크
