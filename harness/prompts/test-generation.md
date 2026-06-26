# Test Generation Prompt

이 프롬프트는 AI에게 테스트 작성을 맡길 때 사용합니다.

## Required Test Areas

- 날짜 포맷 검증
- 월간 달력 날짜 계산
- 날짜별 할 일 필터링
- 반복 일정 발생일 계산
- 마감일 표시 규칙
- 완료 상태 표시 규칙
- 데이터 저장/불러오기
- 설정 저장/복원

## Fixtures

테스트 작성 시 다음 파일을 참고합니다.

- `harness/fixtures/empty-data.json`
- `harness/fixtures/sample-month.json`
- `harness/fixtures/recurring-sample.json`

## Expectations

- 순수 로직은 단위 테스트로 검증합니다.
- Electron 기능은 가능한 범위에서 통합 테스트 또는 수동 검증 체크리스트로 분리합니다.
- 테스트 이름은 사용자 행동 또는 규칙을 설명해야 합니다.
