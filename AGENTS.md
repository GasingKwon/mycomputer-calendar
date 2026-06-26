# AGENTS.md

이 프로젝트는 AI를 통해 Windows용 로컬 스티커 캘린더 앱 **할 일을 기억해라**를 구현하기 위한 작업 공간입니다.

## Working Principles

- 구현 전에 `docs/`와 `harness/`의 명세를 먼저 확인합니다.
- 기존 명세와 충돌하는 변경은 임의로 진행하지 않고 `docs/decisions.md`에 결정 사항을 남깁니다.
- 사용자 데이터는 계정, 서버, 외부 동기화 없이 로컬 파일에 저장합니다.
- Windows 데스크톱 사용성을 우선합니다.
- 하네스 문서는 실제 구현 품질을 검증하기 위한 기준으로 취급합니다.

## Product Summary

- 앱 이름: 할 일을 기억해라
- 플랫폼: Windows
- 기본 화면: 월간 달력 + 오른쪽 상세 패널
- 저장 방식: 로컬 JSON 파일
- UI 방향: 깔끔한 Google Calendar 계열의 정보 중심 디자인
- 핵심 기능: 날짜별 할 일, 시간 일정, 중요도, 마감일, N일 반복, Windows 알림

## Implementation Expectations

- Electron main process는 창, 트레이, 알림, 로컬 파일 저장, 자동 실행 설정을 담당합니다.
- React renderer는 달력, 상세 패널, 할 일 폼, 설정 UI를 담당합니다.
- shared 영역에는 타입, 날짜 계산, 반복 일정 계산처럼 main/renderer 양쪽에서 재사용 가능한 로직을 둡니다.
- 중요한 날짜/반복/저장 로직은 단위 테스트가 가능하도록 UI와 분리합니다.

## Harness Workflow

1. `docs/product-spec.md`에서 제품 범위를 확인합니다.
2. `docs/data-model.md`에서 데이터 구조와 저장 규칙을 확인합니다.
3. `harness/scenarios/`의 사용자 시나리오를 구현 단위로 사용합니다.
4. `harness/fixtures/`의 샘플 데이터로 화면과 로직을 검증합니다.
5. `harness/checklists/mvp-acceptance.md`로 MVP 완료 여부를 판정합니다.
