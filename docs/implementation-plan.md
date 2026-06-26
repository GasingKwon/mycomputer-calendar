# Implementation Plan

이 문서는 **할 일을 기억해라**를 AI와 함께 구현할 때 사용할 단계별 작업 계획입니다.

목표는 한 번에 앱 전체를 만들지 않고, 작은 단위로 구현하고 검증하는 것입니다. 각 단계는 관련 명세, 구현 범위, 검증 기준, 다음 단계로 넘어가기 전 확인 사항을 포함합니다.

## 1. Principles

- 한 단계는 가능한 한 하나의 관심사만 다룹니다.
- 구현 전에 관련 문서를 먼저 확인합니다.
- 구현 후에는 관련 harness 시나리오나 체크리스트를 갱신 또는 확인합니다.
- 데이터 구조 변경이 필요하면 `docs/data-model.md`와 `docs/decisions.md`를 함께 수정합니다.
- MVP 범위 밖의 기능은 구현하지 않고 후속 작업으로 기록합니다.

## 2. Phase 0: Project Bootstrap

### Goal

Electron + React + TypeScript 앱이 Windows에서 실행되는 최소 상태를 만듭니다.

### Inputs

- `docs/product-spec.md`
- `docs/decisions.md`
- `AGENTS.md`

### Scope

- Electron 프로젝트 설정
- React renderer 설정
- TypeScript 설정
- 개발 실행 명령 추가
- 기본 앱 창 표시

### Done When

- 개발 명령으로 앱 창이 열린다.
- renderer 화면에 기본 앱 이름이 표시된다.
- main, preload, renderer 경계가 만들어져 있다.

### Out of Scope

- 실제 캘린더 UI
- 저장 로직
- 알림
- 트레이

## 3. Phase 1: Shared Types and Data Contract

### Goal

앱 전체에서 사용할 타입과 데이터 검증 기준을 코드로 옮깁니다.

### Inputs

- `docs/data-model.md`
- `harness/fixtures/empty-data.json`
- `harness/fixtures/sample-month.json`
- `harness/fixtures/recurring-sample.json`

### Scope

- `Task`, `AppSettings`, `AppData` 타입 정의
- priority 상수 정의
- 날짜/시간 포맷 유틸리티 초안
- fixture 검증 흐름 정리

### Done When

- 데이터 모델 타입이 `docs/data-model.md`와 일치한다.
- fixture 데이터가 타입과 검증 규칙을 통과한다.
- 날짜/시간 형식 검증 함수가 있다.

### Out of Scope

- UI 렌더링
- 실제 파일 저장
- 반복 일정 계산

## 4. Phase 2: Local Storage

### Goal

로컬 JSON 파일을 읽고 쓰는 저장 계층을 구현합니다.

### Inputs

- `docs/data-model.md`
- `harness/fixtures/empty-data.json`

### Scope

- AppData 폴더 경로 결정
- 데이터 파일 생성
- 데이터 읽기/쓰기
- 기본 데이터 초기화
- 손상된 JSON 처리 전략

### Done When

- 데이터 파일이 없으면 기본 데이터로 생성된다.
- 저장된 할 일과 설정이 재실행 후 복원된다.
- 잘못된 JSON이 앱 전체를 중단시키지 않는다.

### Out of Scope

- 캘린더 UI
- 알림 예약
- 트레이 동작

## 5. Phase 3: Calendar Logic

### Goal

월간 달력과 날짜별 할 일 표시를 위한 순수 로직을 구현합니다.

### Inputs

- `docs/data-model.md`
- `harness/scenarios/recurring-tasks.md`
- `harness/fixtures/recurring-sample.json`

### Scope

- 월간 달력 날짜 배열 생성
- 특정 날짜의 작업 필터링
- 반복 일정 발생일 계산
- 마감일 기준 표시 규칙
- 날짜칸 3개 미리보기와 `+N개` 계산

### Done When

- 반복 없음 항목은 기준 날짜에만 표시된다.
- N일 반복 항목은 기준 날짜 이후 N일 간격으로 표시된다.
- 마감일이 선택 날짜인 작업도 표시된다.
- 날짜칸 미리보기 개수 계산이 가능하다.

### Out of Scope

- 화면 디자인
- Electron 창 기능
- Windows 알림

## 6. Phase 4: Main Calendar UI

### Goal

기본 화면인 월간 달력 + 오른쪽 상세 패널을 구현합니다.

### Inputs

- `docs/product-spec.md`
- `docs/ux-flow.md`
- `harness/scenarios/task-crud.md`
- `harness/checklists/ui-review.md`

### Scope

- 월간 달력 UI
- 날짜 선택
- 오늘 날짜 강조
- 선택 날짜 강조
- 날짜칸 할 일 미리보기
- 오른쪽 상세 패널

### Done When

- 앱 첫 화면에서 월간 달력이 보인다.
- 날짜를 클릭하면 오른쪽 패널 내용이 바뀐다.
- 날짜칸에 최대 3개 미리보기와 `+N개`가 표시된다.
- 완료 항목은 회색과 취소선으로 보인다.

### Out of Scope

- 실제 알림 동작
- 트레이 숨기기
- 자동 실행

## 7. Phase 5: Task CRUD Form

### Goal

오른쪽 상세 패널에서 할 일을 추가, 수정, 완료, 삭제할 수 있게 합니다.

### Inputs

- `harness/scenarios/task-crud.md`
- `harness/checklists/mvp-acceptance.md`

### Scope

- 할 일 추가 폼
- 제목, 날짜, 시간, 중요도, 마감일, 반복, 알림, 메모 입력
- 수정 모드
- 삭제 확인
- 완료 토글
- 저장 계층 연동

### Done When

- 사용자가 날짜별 할 일을 추가할 수 있다.
- 수정/삭제/완료 토글이 가능하다.
- 변경 내용이 JSON 파일에 저장된다.
- 제목이 비어 있으면 저장되지 않는다.

### Out of Scope

- Windows 알림
- 설정 화면
- 패키징

## 8. Phase 6: Desktop Window Features

### Goal

스티커 메모처럼 사용할 수 있는 Windows 창 기능을 구현합니다.

### Inputs

- `harness/scenarios/window-behavior.md`
- `docs/product-spec.md`

### Scope

- 창 위치/크기 저장
- 항상 위에 고정
- 투명도 조절
- 트레이 숨기기
- 트레이에서 다시 열기
- Windows 시작 시 자동 실행 옵션

### Done When

- 창 위치와 크기가 재실행 후 복원된다.
- 항상 위에 고정이 동작한다.
- 투명도 조절이 동작한다.
- 창을 트레이로 숨기고 다시 열 수 있다.
- 자동 실행 옵션을 켜고 끌 수 있다.

### Out of Scope

- 설치 파일 생성
- 클라우드 동기화

## 9. Phase 7: Notifications

### Goal

알림 대상 작업을 Windows 기본 알림으로 표시합니다.

### Inputs

- `harness/scenarios/notifications.md`
- `docs/product-spec.md`

### Scope

- 시간 일정 알림
- 마감일 알림
- 중요도 높음 알림
- 반복 일정 발생일 알림
- 완료/알림 꺼짐 항목 제외

### Done When

- 시간이 있는 작업은 지정 시간에 알림이 표시된다.
- 마감일이 오늘인 작업은 알림 대상이 된다.
- 중요도 높음 작업은 알림 대상이 된다.
- 완료된 작업과 알림 꺼진 작업은 제외된다.

### Out of Scope

- 커스텀 알림 소리
- 모바일 푸시
- 클라우드 알림

## 10. Phase 8: MVP Hardening

### Goal

MVP 기준을 통과하도록 품질을 다듬습니다.

### Inputs

- `harness/checklists/mvp-acceptance.md`
- `harness/checklists/ui-review.md`
- `harness/checklists/release-check.md`

### Scope

- 체크리스트 기반 누락 기능 확인
- 기본 오류 처리
- 작은 창 크기에서 UI 점검
- 샘플 데이터 기반 화면 검증
- README 실행 방법 보강

### Done When

- MVP acceptance checklist가 통과된다.
- fixture 기반 검증을 완료했다.
- 알려진 제한 사항이 문서화되어 있다.
- 다음 릴리즈 후보 작업이 정리되어 있다.

## 11. Suggested AI Task Pattern

AI에게 구현을 맡길 때는 다음 형식을 사용합니다.

```text
docs/implementation-plan.md의 Phase N을 진행해줘.
관련 Inputs 문서를 먼저 확인하고,
Scope 안의 항목만 구현해줘.
구현 후 Done When 기준으로 검증하고,
Out of Scope 항목은 건드리지 마.
```

예시:

```text
docs/implementation-plan.md의 Phase 3: Calendar Logic을 진행해줘.
docs/data-model.md와 harness/scenarios/recurring-tasks.md를 기준으로 구현하고,
UI는 만들지 말고 순수 로직과 테스트만 추가해줘.
```

## 12. Phase Completion Record

각 단계를 완료할 때 아래 형식으로 `docs/decisions.md` 또는 별도 진행 문서에 기록합니다.

```text
## YYYY-MM-DD: Phase N 완료

- 구현한 범위:
- 검증한 항목:
- 남은 리스크:
- 다음 단계:
```
