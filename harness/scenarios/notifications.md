# Scenario: Notifications

## Goal

알림 대상 작업이 Windows 기본 알림으로 표시되어야 합니다.

## Notification Targets

- 시간이 있는 일정
- 마감일이 오늘인 할 일
- 중요도 `high`인 할 일
- 반복 일정의 오늘 발생분

## Exclusions

- 완료된 할 일
- `notificationEnabled`가 `false`인 할 일

## Scenario A: Timed Task

Given:

- 오늘 날짜의 작업
- `time`: 현재 시각 이후
- `notificationEnabled`: `true`

Expected:

- 지정 시간에 Windows 알림이 표시됩니다.

## Scenario B: Due Date

Given:

- `dueDate`: 오늘
- `notificationEnabled`: `true`

Expected:

- 앱 실행 중 당일 알림이 표시됩니다.

## Scenario C: Completed Task

Given:

- 알림 조건을 만족하는 작업
- `completed`: `true`

Expected:

- 알림이 표시되지 않습니다.

## Scenario D: Notification Disabled

Given:

- 알림 조건을 만족하는 작업
- `notificationEnabled`: `false`

Expected:

- 알림이 표시되지 않습니다.
