# Progress

이 문서는 **할 일을 기억해라** 구현 진행 상황을 기록합니다.

`harness/prompts/full-mvp.md`를 사용해 Phase 기반으로 구현할 때, 각 Phase의 완료 여부와 검증 결과를 이 파일에 남깁니다.

## Current Status

Status: MVP implementation completed with runtime verification caveats

Current Phase: Phase 8 completed

Last Updated: 2026-06-25

## Phase Checklist

- [x] Phase 0: Project Bootstrap
- [x] Phase 1: Shared Types and Data Contract
- [x] Phase 2: Local Storage
- [x] Phase 3: Calendar Logic
- [x] Phase 4: Main Calendar UI
- [x] Phase 5: Task CRUD Form
- [x] Phase 6: Desktop Window Features
- [x] Phase 7: Notifications
- [x] Phase 8: MVP Hardening

## Log

## 2026-06-25: Phase 0 - Project Bootstrap

Status: Completed

Implemented:
- Added Electron + React + TypeScript project configuration.
- Added Electron main, preload, and renderer entry points.
- Added development, build, typecheck, test, and fixture validation scripts.

Verified:
- `npm run typecheck` passed from ASCII verification path.
- `npm run build` passed from ASCII verification path.

Changed Files:
- `package.json`
- `package-lock.json`
- `electron.vite.config.mts`
- `tsconfig.json`
- `src/main/main.ts`
- `src/preload/preload.ts`
- `src/renderer/index.html`
- `src/renderer/src/main.tsx`

Risks:
- npm postinstall scripts failed directly from the non-ASCII workspace path in this Codex environment, so dependency installation and build verification were performed from `C:\tmp\remember-tasks-calendar-deps`.

Next:
- Phase 1 shared types and data contract.

## 2026-06-25: Phase 1 - Shared Types and Data Contract

Status: Completed

Implemented:
- Added `Task`, `AppSettings`, `AppData`, and calendar-related shared types.
- Added priority constants and default app data.
- Added date/time validation and app data normalization.

Verified:
- Fixture validation passed.
- Unit tests for validation passed.

Changed Files:
- `src/shared/types.ts`
- `src/shared/constants.ts`
- `src/shared/date.ts`
- `src/shared/validation.ts`
- `src/tests/unit/validation.test.ts`

Risks:
- Fixture strings are ASCII to avoid Windows console encoding issues during automated checks.

Next:
- Phase 2 local storage.

## 2026-06-25: Phase 2 - Local Storage

Status: Completed

Implemented:
- Added AppData JSON storage under Electron `userData`.
- Added default data creation when the data file is missing.
- Added broken JSON backup and fallback behavior.
- Added IPC handlers for loading, saving, upserting, and deleting tasks.

Verified:
- Typecheck passed.
- Build passed.

Changed Files:
- `src/main/storage.ts`
- `src/main/window.ts`
- `src/preload/preload.ts`
- `src/renderer/src/global.d.ts`

Risks:
- Broken JSON handling is build-verified but should be manually tested in the packaged Windows runtime.

Next:
- Phase 3 calendar logic.

## 2026-06-25: Phase 3 - Calendar Logic

Status: Completed

Implemented:
- Added month grid generation.
- Added date-based task filtering.
- Added N-day recurrence calculation.
- Added due-date display rule.
- Added day preview calculation with hidden count.

Verified:
- Unit tests passed for date utilities, recurrence, and calendar preview logic.

Changed Files:
- `src/shared/recurrence.ts`
- `src/shared/calendar.ts`
- `src/tests/unit/date.test.ts`
- `src/tests/unit/recurrence.test.ts`
- `src/tests/unit/calendar.test.ts`

Risks:
- Recurring task completion is global per task, matching the MVP scenario note.

Next:
- Phase 4 main calendar UI.

## 2026-06-25: Phase 4 - Main Calendar UI

Status: Completed

Implemented:
- Added month calendar UI.
- Added today and selected-date highlighting.
- Added date-cell task preview with `+N개`.
- Added right-side detail panel.
- Added Google Calendar-inspired clean layout.

Verified:
- Typecheck passed.
- Build passed.

Changed Files:
- `src/renderer/src/App.tsx`
- `src/renderer/src/styles.css`

Risks:
- Visual verification with a live Electron window remains manual.

Next:
- Phase 5 task CRUD form.

## 2026-06-25: Phase 5 - Task CRUD Form

Status: Completed

Implemented:
- Added task add/edit form.
- Added title, date, time, priority, due date, recurrence, notification, and memo fields.
- Added completion toggle.
- Added delete confirmation.
- Connected task changes to local storage IPC.

Verified:
- Typecheck passed.
- Build passed.

Changed Files:
- `src/renderer/src/App.tsx`
- `src/renderer/src/styles.css`

Risks:
- CRUD behavior should be manually tested in the running Electron app.

Next:
- Phase 6 desktop window features.

## 2026-06-25: Phase 6 - Desktop Window Features

Status: Completed

Implemented:
- Added window bounds restore and persistence.
- Added always-on-top setting.
- Added opacity control.
- Added tray hide and tray reopen support.
- Added Windows start-at-login setting.

Verified:
- Typecheck passed.
- Build passed.

Changed Files:
- `src/main/window.ts`
- `src/main/tray.ts`
- `src/renderer/src/App.tsx`

Risks:
- Tray, always-on-top, opacity, and login-item behavior require manual Windows runtime verification.

Next:
- Phase 7 notifications.

## 2026-06-25: Phase 7 - Notifications

Status: Completed

Implemented:
- Added Windows notification scheduler.
- Added notification filtering for time, due date, high priority, recurrence, completion, and disabled notifications.
- Added app user model ID for Windows notification identity.

Verified:
- Typecheck passed.
- Build passed.

Changed Files:
- `src/main/notifications.ts`
- `src/main/main.ts`

Risks:
- Windows notification display and sound require manual runtime verification.

Next:
- Phase 8 hardening.

## 2026-06-25: Phase 8 - MVP Hardening

Status: Completed

Implemented:
- Added unit tests for core date, recurrence, calendar, and validation behavior.
- Added README development and verification instructions.
- Added note for non-ASCII path dependency installation workaround.
- Ran full automated verification from ASCII path.

Verified:
- `npm run validate:fixtures` passed.
- `npm run typecheck` passed.
- `npm run test` passed: 4 test files, 12 tests.
- `npm run build` passed.

Changed Files:
- `README.md`
- `docs/progress.md`
- `src/tests/unit/date.test.ts`
- `src/tests/unit/recurrence.test.ts`
- `src/tests/unit/calendar.test.ts`
- `src/tests/unit/validation.test.ts`

Risks:
- Live Electron UI, tray, auto-launch, and Windows notifications were not visually verified inside this Codex runtime.
- Direct dependency installation in the non-ASCII workspace path failed; the current workspace has `node_modules` copied from an ASCII install path.

Next:
- Run the app manually with `npm run dev`.
- Perform the MVP acceptance checklist in the live Windows UI.

## 2026-06-25: Harness Setup

Status: Completed

Implemented:
- Added product and harness documentation.
- Added Phase-based implementation plan.
- Added fixture files for empty, sample month, and recurring task data.
- Added validation and seed helper scripts.
- Added full MVP execution prompt.

Verified:
- Fixture JSON files parse successfully with PowerShell JSON parser.
- Documentation structure exists under `docs/` and `harness/`.

Changed Files:
- `AGENTS.md`
- `README.md`
- `package.json`
- `docs/product-spec.md`
- `docs/data-model.md`
- `docs/ux-flow.md`
- `docs/decisions.md`
- `docs/implementation-plan.md`
- `docs/progress.md`
- `harness/prompts/full-mvp.md`
- `harness/prompts/implementation.md`
- `harness/prompts/review.md`
- `harness/prompts/test-generation.md`
- `harness/scenarios/task-crud.md`
- `harness/scenarios/recurring-tasks.md`
- `harness/scenarios/notifications.md`
- `harness/scenarios/window-behavior.md`
- `harness/checklists/mvp-acceptance.md`
- `harness/checklists/ui-review.md`
- `harness/checklists/release-check.md`
- `harness/fixtures/empty-data.json`
- `harness/fixtures/sample-month.json`
- `harness/fixtures/recurring-sample.json`
- `harness/scripts/validate-data.js`
- `harness/scripts/seed-sample-data.js`

Risks:
- Node script execution was blocked by the current sandbox path permissions during initial verification.
- Git status is currently blocked by repository ownership safety settings.

Next:
- Start Phase 0: Project Bootstrap when implementation begins.
