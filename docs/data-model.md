# Data Model

## 1. Storage File

앱 데이터는 사용자 AppData 폴더의 JSON 파일에 저장합니다.

예상 위치:

```text
%APPDATA%/remember-tasks-calendar/data.json
```

정확한 폴더명은 Electron 앱 식별자 결정 후 확정합니다.

## 2. Root Shape

```json
{
  "schemaVersion": 1,
  "tasks": [],
  "categories": [],
  "waterRecords": [],
  "settings": {}
}
```

## 3. Task

```json
{
  "id": "uuid",
  "title": "보고서 작성",
  "date": "2026-06-25",
  "time": "14:00",
  "categoryId": "study",
  "priority": "high",
  "dueDate": "2026-06-28",
  "repeatEveryDays": 7,
  "notificationEnabled": true,
  "completed": false,
  "memo": "초안 먼저 정리하기",
  "createdAt": "2026-06-25T10:00:00+09:00",
  "updatedAt": "2026-06-25T10:00:00+09:00"
}
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | 고유 ID. UUID 사용 |
| `title` | string | yes | 할 일 제목 |
| `date` | string | yes | 기준 날짜. `YYYY-MM-DD` |
| `time` | string or null | no | 시간 일정. `HH:mm` |
| `categoryId` | string or null | no | 연결된 카테고리 ID |
| `priority` | string | yes | `low`, `normal`, `high` |
| `dueDate` | string or null | no | 마감일. `YYYY-MM-DD` |
| `repeatEveryDays` | number or null | no | N일마다 반복. 반복 없음은 `null` |
| `notificationEnabled` | boolean | yes | 알림 사용 여부 |
| `completed` | boolean | yes | 완료 여부 |
| `memo` | string | no | 추가 메모 |
| `createdAt` | string | yes | ISO 날짜시간 |
| `updatedAt` | string | yes | ISO 날짜시간 |

## 4. Category

```json
{
  "id": "study",
  "name": "공부",
  "color": "#1a73e8"
}
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | 고유 ID |
| `name` | string | yes | 사용자에게 표시되는 카테고리 이름 |
| `color` | string | yes | `#RRGGBB` 형식의 표시 색상 |

## 5. Water Record

```json
{
  "date": "2026-06-25",
  "amountMl": 1200
}
```

Daily water goal is `2000ml`. Clicking the water cup adds `100ml` to today's record.

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | string | yes | 물 섭취 기록 날짜. `YYYY-MM-DD` |
| `amountMl` | number | yes | 해당 날짜의 물 섭취량 ml |

## 6. Settings

```json
{
  "alwaysOnTop": false,
  "opacity": 1,
  "startAtLogin": false,
  "windowBounds": {
    "x": 100,
    "y": 100,
    "width": 1100,
    "height": 720
  }
}
```

### Fields

| Field | Type | Description |
| --- | --- | --- |
| `alwaysOnTop` | boolean | 항상 위에 고정 여부 |
| `opacity` | number | 창 투명도. 권장 범위 `0.5`-`1` |
| `startAtLogin` | boolean | Windows 시작 시 자동 실행 여부 |
| `windowBounds` | object | 마지막 창 위치와 크기 |

## 7. Date Rules

- 날짜는 `YYYY-MM-DD` 형식으로 저장합니다.
- 시간은 `HH:mm` 24시간 형식으로 저장합니다.
- 날짜 계산은 로컬 시간 기준으로 처리합니다.
- `createdAt`, `updatedAt`은 ISO 문자열로 저장합니다.

## 8. Recurrence Rules

반복 여부는 `repeatEveryDays`로 판단합니다.

- `null`: 반복 없음
- `1` 이상 정수: 기준 날짜부터 N일마다 반복

발생일 판정:

1. 선택 날짜가 `date`보다 이전이면 발생하지 않습니다.
2. 선택 날짜와 `date`의 차이를 일수로 계산합니다.
3. 차이 일수가 `repeatEveryDays`로 나누어 떨어지면 발생합니다.

## 9. Calendar Display Rules

특정 날짜에 표시할 항목은 다음 조건 중 하나를 만족하는 작업입니다.

- `task.date`가 해당 날짜와 같습니다.
- `repeatEveryDays`가 있고 해당 날짜가 반복 발생일입니다.
- `dueDate`가 해당 날짜와 같습니다.

동일 작업이 같은 날짜에 여러 조건으로 걸릴 경우 한 번만 표시합니다.

## 10. Validation Rules

- `title`은 비어 있을 수 없습니다.
- `categoryId`는 `null` 또는 존재하는 카테고리 ID여야 합니다.
- `priority`는 `low`, `normal`, `high` 중 하나여야 합니다.
- `repeatEveryDays`는 `null` 또는 1 이상의 정수여야 합니다.
- `opacity`는 0보다 크고 1 이하의 숫자여야 합니다.
- 날짜/시간 문자열은 지정 형식을 따라야 합니다.
