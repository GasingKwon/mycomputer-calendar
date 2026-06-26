# Scenario: Window Behavior

## Goal

앱이 Windows 스티커 메모처럼 가볍게 사용될 수 있어야 합니다.

## Scenario A: Restore Window Bounds

1. 사용자가 창 위치와 크기를 변경합니다.
2. 앱을 종료합니다.
3. 앱을 다시 실행합니다.

Expected:

- 마지막 창 위치와 크기가 복원됩니다.

## Scenario B: Always On Top

1. 사용자가 항상 위 설정을 켭니다.

Expected:

- 앱 창이 다른 일반 창보다 위에 표시됩니다.
- 설정은 재실행 후에도 유지됩니다.

## Scenario C: Opacity

1. 사용자가 투명도를 변경합니다.

Expected:

- 앱 창 투명도가 즉시 변경됩니다.
- 설정은 재실행 후에도 유지됩니다.

## Scenario D: Tray Hide

1. 사용자가 트레이 숨기기를 실행합니다.

Expected:

- 창이 화면에서 사라집니다.
- 앱 프로세스는 유지됩니다.
- 트레이 아이콘으로 창을 다시 열 수 있습니다.

## Scenario E: Start At Login

1. 사용자가 Windows 시작 시 자동 실행 옵션을 켭니다.

Expected:

- 다음 로그인부터 앱이 자동 실행됩니다.
- 옵션을 끄면 자동 실행 등록이 제거됩니다.
