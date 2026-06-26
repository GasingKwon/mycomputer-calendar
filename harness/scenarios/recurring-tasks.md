# Scenario: Recurring Tasks

## Goal

N일마다 반복되는 할 일이 올바른 날짜에 표시되어야 합니다.

## Rule

반복 항목은 기준 날짜부터 시작해 `repeatEveryDays` 간격으로 발생합니다.

## Scenario A: Weekly-Like Repetition

Given:

- `date`: `2026-06-01`
- `repeatEveryDays`: `7`

Expected:

- `2026-06-01`에 표시됩니다.
- `2026-06-08`에 표시됩니다.
- `2026-06-15`에 표시됩니다.
- `2026-06-02`에는 표시되지 않습니다.

## Scenario B: Daily Repetition

Given:

- `date`: `2026-06-01`
- `repeatEveryDays`: `1`

Expected:

- `2026-06-01` 이후 모든 날짜에 표시됩니다.
- `2026-05-31`에는 표시되지 않습니다.

## Scenario C: Non-Repeating Task

Given:

- `date`: `2026-06-10`
- `repeatEveryDays`: `null`

Expected:

- `2026-06-10`에만 표시됩니다.

## Scenario D: Completed Recurring Task

MVP에서는 반복 항목의 완료 상태를 원본 작업 단위로 봅니다.

Expected:

- 반복 작업을 완료 처리하면 이후 발생일에서도 완료 상태로 표시됩니다.
- 향후 날짜별 완료 상태가 필요하면 별도 모델 확장이 필요합니다.
