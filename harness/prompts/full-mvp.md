# Full MVP Execution Prompt

이 프롬프트는 **할 일을 기억해라** 앱을 Phase 0부터 Phase 8까지 순서대로 구현하기 위한 마스터 지침입니다.

목표는 한 번에 무작정 전체 앱을 만드는 것이 아니라, `docs/implementation-plan.md`의 Phase를 순서대로 진행하고 각 Phase의 완료 기준을 통과한 뒤 다음 Phase로 넘어가는 것입니다.

## Required Reading

작업을 시작하기 전에 반드시 다음 문서를 확인합니다.

- `AGENTS.md`
- `README.md`
- `docs/product-spec.md`
- `docs/data-model.md`
- `docs/ux-flow.md`
- `docs/decisions.md`
- `docs/implementation-plan.md`
- `docs/progress.md`
- `harness/checklists/mvp-acceptance.md`
- `harness/prompts/implementation.md`
- `harness/prompts/review.md`
- `harness/prompts/test-generation.md`

## Execution Rule

`docs/implementation-plan.md`의 Phase 0부터 Phase 8까지 순서대로 진행합니다.

각 Phase는 다음 순서를 따릅니다.

1. 해당 Phase의 `Inputs` 문서를 읽습니다.
2. 해당 Phase의 `Goal`, `Scope`, `Done When`, `Out of Scope`를 확인합니다.
3. `Scope` 안의 항목만 구현합니다.
4. `Out of Scope` 항목은 구현하지 않습니다.
5. 구현 후 `Done When` 기준으로 검증합니다.
6. 검증 실패 시 다음 Phase로 넘어가지 않고 현재 Phase 안에서 수정합니다.
7. Phase 완료 후 `docs/progress.md`에 진행 기록을 남깁니다.

## Stop Conditions

다음 상황에서는 임의로 우회하지 말고 작업을 멈추고 사용자에게 보고합니다.

- 명세끼리 충돌하는 경우
- 데이터 모델 변경이 필요한데 영향 범위가 큰 경우
- 의존성 설치나 네트워크 접근 승인이 필요한 경우
- Windows/Electron 기능이 현재 환경에서 검증 불가능한 경우
- 사용자 데이터 손실 가능성이 있는 변경이 필요한 경우
- Phase의 `Done When`을 충족하지 못하는 문제가 3회 이상 반복되는 경우

보고할 때는 다음을 포함합니다.

- 현재 Phase
- 막힌 이유
- 확인한 문서
- 시도한 방법
- 가능한 선택지
- 추천 선택지

## Progress Recording

각 Phase를 완료할 때 `docs/progress.md`에 다음 형식으로 기록합니다.

```text
## YYYY-MM-DD: Phase N - 이름

Status: Completed

Implemented:
- ...

Verified:
- ...

Changed Files:
- ...

Risks:
- ...

Next:
- ...
```

Phase를 완료하지 못한 경우에는 다음 형식을 사용합니다.

```text
## YYYY-MM-DD: Phase N - 이름

Status: Blocked

Reason:
- ...

Tried:
- ...

Needs:
- ...
```

## Verification Expectations

가능한 경우 자동 검증을 먼저 실행합니다.

- fixture 검증
- 단위 테스트
- 타입 검사
- lint
- 앱 개발 실행
- UI 동작 확인

자동 검증이 불가능한 항목은 수동 검증 기준을 명확히 적습니다.

검증하지 못한 항목은 성공한 것처럼 쓰지 않습니다.

## Scope Guard

다음 기능은 MVP 범위 밖입니다.

- 클라우드 동기화
- 계정/로그인
- 모바일 앱
- Google Calendar 연동
- 자연어 일정 입력
- 복잡한 반복 규칙
- 협업 기능
- 커스텀 알림 소리

이 기능들이 필요해 보이더라도 구현하지 말고 후속 아이디어로 기록합니다.

## Final MVP Completion

Phase 8까지 완료한 뒤 다음을 수행합니다.

1. `harness/checklists/mvp-acceptance.md` 기준으로 전체 상태를 확인합니다.
2. `harness/checklists/ui-review.md` 기준으로 UI 상태를 확인합니다.
3. `harness/checklists/release-check.md` 중 현재 가능한 항목을 확인합니다.
4. `docs/progress.md`에 최종 요약을 기록합니다.
5. 사용자에게 다음을 보고합니다.

- 완료한 Phase
- 주요 구현 기능
- 실행 방법
- 검증 결과
- 남은 리스크
- 다음 추천 작업

## User Command Template

사용자는 다음처럼 짧게 지시할 수 있습니다.

```text
harness/prompts/full-mvp.md 기준으로 MVP를 끝까지 진행해줘.
Phase 0부터 Phase 8까지 순서대로 진행하고,
각 Phase의 Done When을 통과해야 다음 Phase로 넘어가.
진행 상황은 docs/progress.md에 기록해줘.
```
