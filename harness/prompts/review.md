# Review Prompt

이 프롬프트는 AI에게 코드 리뷰를 맡길 때 사용합니다.

## Review Focus

- `docs/product-spec.md`와 구현이 일치하는가
- `docs/data-model.md`의 저장 구조와 검증 규칙을 지키는가
- 반복 일정 계산이 정확한가
- 완료된 항목이 알림에서 제외되는가
- 로컬 파일 저장 실패 시 사용자 데이터가 손상되지 않는가
- Electron main/preload/renderer 경계가 안전한가
- Windows 창 기능이 설정과 동기화되는가

## Response Format

리뷰 결과는 심각도 순서로 작성합니다.

- Critical: 데이터 손실, 앱 실행 불가, 보안 경계 위반
- High: 핵심 기능 오작동
- Medium: 사용성 저하 또는 누락
- Low: 유지보수성, 스타일, 작은 개선

각 항목은 파일/라인, 문제 설명, 재현 방법, 수정 제안을 포함합니다.
