import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Eye,
  EyeOff,
  LayoutGrid,
  ListTodo,
  Maximize2,
  Minus,
  PanelRight,
  Pin,
  Plus,
  Save,
  Tags,
  Trash2,
  X
} from "lucide-react";
import {
  APP_NAME,
  CATEGORY_COLORS,
  DAILY_WATER_GOAL_ML,
  DEFAULT_APP_DATA,
  PRIORITY_LABELS,
  WATER_INCREMENT_ML
} from "../../shared/constants";
import { createMonthGrid, getDayPreview, getTasksForDate } from "../../shared/calendar";
import {
  daysBetween,
  formatDateKey,
  formatMonthLabel,
  getMonthStart,
  getTodayKey,
  parseDateKey
} from "../../shared/date";
import { validateTaskInput } from "../../shared/validation";
import type { AppData, Category, Priority, Task } from "../../shared/types";

type ViewMode = "month" | "today" | "widget";

interface TaskFormState {
  id: string | null;
  title: string;
  date: string;
  time: string;
  categoryId: string;
  priority: Priority;
  dueDate: string;
  repeatEnabled: boolean;
  repeatEveryDays: number;
  notificationEnabled: boolean;
  memo: string;
}

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const defaultForm = (date: string): TaskFormState => ({
  id: null,
  title: "",
  date,
  time: "",
  categoryId: "",
  priority: "normal",
  dueDate: "",
  repeatEnabled: false,
  repeatEveryDays: 7,
  notificationEnabled: true,
  memo: ""
});

export function App() {
  const today = getTodayKey();
  const [data, setData] = useState<AppData>(DEFAULT_APP_DATA);
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(getMonthStart(new Date()));
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [form, setForm] = useState<TaskFormState>(() => defaultForm(today));
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState(CATEGORY_COLORS[0]);
  const [error, setError] = useState("");
  const [dataPath, setDataPath] = useState("");

  useEffect(() => {
    void window.rememberTasks.loadData().then((loaded) => {
      setData(loaded);
      setForm(defaultForm(today));
    });
    void window.rememberTasks.getDataPath().then(setDataPath);
  }, [today]);

  useEffect(() => {
    void window.rememberTasks.setWidgetMode(viewMode === "widget");
  }, [viewMode]);

  const days = useMemo(() => createMonthGrid(currentMonth), [currentMonth]);
  const selectedTasks = useMemo(() => getTasksForDate(data.tasks, selectedDate), [data.tasks, selectedDate]);
  const todayTasks = useMemo(() => getTasksForDate(data.tasks, today), [data.tasks, today]);
  const importantTodayTasks = todayTasks.filter((task) => !task.completed && (task.priority === "high" || task.dueDate));
  const completedTodayCount = todayTasks.filter((task) => task.completed).length;
  const todayWater = getWaterAmount(today);
  const waterRatio = Math.min(todayWater / DAILY_WATER_GOAL_ML, 1);

  function setMode(nextMode: ViewMode) {
    setViewMode(nextMode);
    if (nextMode !== "month") {
      goToday();
    }
  }

  function moveMonth(offset: number) {
    setCurrentMonth((value) => new Date(value.getFullYear(), value.getMonth() + offset, 1));
  }

  function goToday() {
    const now = new Date();
    setCurrentMonth(getMonthStart(now));
    selectDate(formatDateKey(now));
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setForm(defaultForm(date));
    setError("");
  }

  function editTask(task: Task) {
    setForm({
      id: task.id,
      title: task.title,
      date: task.date,
      time: task.time ?? "",
      categoryId: task.categoryId ?? "",
      priority: task.priority,
      dueDate: task.dueDate ?? "",
      repeatEnabled: Boolean(task.repeatEveryDays),
      repeatEveryDays: task.repeatEveryDays ?? 7,
      notificationEnabled: task.notificationEnabled,
      memo: task.memo
    });
    setSelectedDate(task.date);
    setError("");
    if (viewMode === "widget") {
      setMode("today");
    }
  }

  async function saveTask() {
    const taskBase = {
      title: form.title.trim(),
      date: form.date,
      time: form.time.trim() ? form.time : null,
      categoryId: form.categoryId || null,
      priority: form.priority,
      dueDate: form.dueDate || null,
      repeatEveryDays: form.repeatEnabled ? Number(form.repeatEveryDays) : null
    };
    const errors = validateTaskInput(taskBase);

    if (errors.length) {
      setError(errors[0]);
      return;
    }

    const now = new Date().toISOString();
    const existing = form.id ? data.tasks.find((task) => task.id === form.id) : null;
    const task: Task = {
      id: form.id ?? crypto.randomUUID(),
      title: taskBase.title,
      date: taskBase.date,
      time: taskBase.time,
      categoryId: taskBase.categoryId,
      priority: taskBase.priority,
      dueDate: taskBase.dueDate,
      repeatEveryDays: taskBase.repeatEveryDays,
      notificationEnabled: form.notificationEnabled,
      completed: existing?.completed ?? false,
      memo: form.memo,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    const next = await window.rememberTasks.upsertTask(task);
    setData(next);
    setSelectedDate(task.date);
    setCurrentMonth(getMonthStart(parseDateKey(task.date)));
    setForm(defaultForm(task.date));
    setError("");
  }

  async function toggleComplete(task: Task) {
    const next = await window.rememberTasks.upsertTask({
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    });
    setData(next);
  }

  async function removeTask(task: Task) {
    if (!window.confirm(`"${task.title}" 할 일을 삭제할까요?`)) {
      return;
    }

    const next = await window.rememberTasks.deleteTask(task.id);
    setData(next);

    if (form.id === task.id) {
      setForm(defaultForm(selectedDate));
    }
  }

  async function updateSettings(patch: Partial<AppData["settings"]>) {
    const next = await window.rememberTasks.updateSettings(patch);
    setData(next);
  }

  async function saveData(nextData: AppData) {
    const next = await window.rememberTasks.saveData(nextData);
    setData(next);
  }

  async function updateTodayWater(amountMl: number) {
    const nextAmount = Math.max(0, Math.min(amountMl, DAILY_WATER_GOAL_ML));
    const existing = data.waterRecords.find((record) => record.date === today);
    const waterRecords = existing
      ? data.waterRecords.map((record) => (record.date === today ? { ...record, amountMl: nextAmount } : record))
      : [...data.waterRecords, { date: today, amountMl: nextAmount }];

    await saveData({ ...data, waterRecords });
  }

  async function addWater() {
    await updateTodayWater(todayWater + WATER_INCREMENT_ML);
  }

  async function subtractWater() {
    await updateTodayWater(todayWater - WATER_INCREMENT_ML);
  }

  async function saveCategories(categories: Category[]) {
    const next = await window.rememberTasks.saveCategories(categories);
    setData(next);

    if (form.categoryId && !next.categories.some((category) => category.id === form.categoryId)) {
      setForm({ ...form, categoryId: "" });
    }
  }

  async function addCategory() {
    const name = categoryName.trim();

    if (!name) {
      return;
    }

    await saveCategories([
      ...data.categories,
      {
        id: crypto.randomUUID(),
        name,
        color: categoryColor
      }
    ]);
    setCategoryName("");
    setCategoryColor(CATEGORY_COLORS[(data.categories.length + 1) % CATEGORY_COLORS.length]);
  }

  async function updateCategory(categoryId: string, patch: Partial<Category>) {
    await saveCategories(
      data.categories.map((category) =>
        category.id === categoryId ? { ...category, ...patch, name: patch.name?.trim() || category.name } : category
      )
    );
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`"${category.name}" 카테고리를 삭제할까요? 기존 할 일에서는 카테고리만 제거됩니다.`)) {
      return;
    }

    await saveCategories(data.categories.filter((item) => item.id !== category.id));
  }

  function getCategory(categoryId: string | null) {
    return data.categories.find((category) => category.id === categoryId) ?? null;
  }

  function getWaterAmount(date: string) {
    return data.waterRecords.find((record) => record.date === date)?.amountMl ?? 0;
  }

  function getWaterStatus(date: string) {
    const amount = getWaterAmount(date);

    if (amount >= DAILY_WATER_GOAL_ML) {
      return "done";
    }

    if (daysBetween(date, today) > 0) {
      return "missed";
    }

    return "pending";
  }

  function renderTaskRow(task: Task, compact = false) {
    const category = getCategory(task.categoryId);

    return (
      <article className={`task-row ${compact ? "compact" : ""} ${task.completed ? "completed" : ""}`} key={task.id}>
        <input type="checkbox" checked={task.completed} onChange={() => void toggleComplete(task)} aria-label="완료" />
        <button className="task-main" onClick={() => editTask(task)} type="button">
          <span className="task-title">{task.title}</span>
          <span className="task-meta">
            {task.time && `${task.time} · `}
            {category?.name && `${category.name} · `}
            {PRIORITY_LABELS[task.priority]}
            {task.dueDate && ` · 마감 ${task.dueDate}`}
            {task.repeatEveryDays && ` · ${task.repeatEveryDays}일마다`}
          </span>
        </button>
        {!compact && (
          <button className="icon-button danger" onClick={() => void removeTask(task)} title="삭제" type="button">
            <Trash2 size={16} />
          </button>
        )}
      </article>
    );
  }

  function renderWaterPanel(compact = false) {
    return (
      <aside className={`water-panel ${compact ? "compact" : ""}`} aria-label="오늘 물 마시기">
        <div className="water-copy">
          <p className="eyebrow">오늘 물</p>
          <h2>{todayWater}ml</h2>
          <p>{DAILY_WATER_GOAL_ML}ml 목표</p>
        </div>
        <button
          className={`water-cup ${todayWater >= DAILY_WATER_GOAL_ML ? "complete" : ""}`}
          onClick={() => void addWater()}
          title={`${WATER_INCREMENT_ML}ml 추가`}
          type="button"
        >
          <span className="water-fill" style={{ height: `${waterRatio * 100}%` }} />
          <span className="water-gloss" />
          <span className="water-label">{Math.round(waterRatio * 100)}%</span>
        </button>
        <div className="water-actions">
          {!compact && <span>컵을 클릭하면 {WATER_INCREMENT_ML}ml 추가</span>}
          <div className="water-buttons">
            <button
              className="icon-button"
              type="button"
              onClick={() => void subtractWater()}
              disabled={todayWater <= 0}
              title={`${WATER_INCREMENT_ML}ml 빼기`}
            >
              <Minus size={15} />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => void addWater()}
              disabled={todayWater >= DAILY_WATER_GOAL_ML}
              title={`${WATER_INCREMENT_ML}ml 추가`}
            >
              <Droplet size={15} />
            </button>
          </div>
          <progress value={todayWater} max={DAILY_WATER_GOAL_ML} />
        </div>
      </aside>
    );
  }

  function renderCalendar() {
    return (
      <section className="calendar" aria-label="월간 달력">
        {weekdays.map((day) => (
          <div className="weekday" key={day}>
            {day}
          </div>
        ))}

        {days.map((day) => {
          const preview = getDayPreview(data.tasks, day.date, 3);
          const isSelected = selectedDate === day.date;

          return (
            <button
              className={`day-cell ${day.inCurrentMonth ? "" : "muted"} ${day.isToday ? "today" : ""} ${
                isSelected ? "selected" : ""
              }`}
              key={day.date}
              onClick={() => selectDate(day.date)}
              type="button"
            >
              <span className="day-head">
                <span className="day-number">{day.dayNumber}</span>
                {getWaterStatus(day.date) === "done" && (
                  <span className="water-day-icon done" title="물 목표 달성">
                    <Check size={11} />
                  </span>
                )}
                {getWaterStatus(day.date) === "missed" && (
                  <span className="water-day-icon missed" title="물 목표 미달성">
                    <X size={11} />
                  </span>
                )}
              </span>
              <div className="task-preview-list">
                {preview.visible.map((task) => (
                  <span
                    className={`task-pill priority-${task.priority} ${task.completed ? "completed" : ""}`}
                    style={{ borderLeftColor: getCategory(task.categoryId)?.color ?? "transparent" }}
                    key={task.id}
                  >
                    {task.time && <strong>{task.time}</strong>}
                    {task.title}
                  </span>
                ))}
                {preview.hiddenCount > 0 && <span className="more-count">+{preview.hiddenCount}개</span>}
              </div>
            </button>
          );
        })}
      </section>
    );
  }

  function renderTaskForm() {
    return (
      <form
        className="task-form"
        onSubmit={(event) => {
          event.preventDefault();
          void saveTask();
        }}
      >
        <h3>{form.id ? "할 일 수정" : "할 일 추가"}</h3>
        <label>
          제목
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="할 일을 입력하세요"
          />
        </label>
        <div className="form-grid">
          <label>
            날짜
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          </label>
          <label>
            시간
            <input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
          </label>
        </div>
        <div className="form-grid">
          <label>
            카테고리
            <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
              <option value="">없음</option>
              {data.categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            중요도
            <select
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })}
            >
              <option value="low">낮음</option>
              <option value="normal">보통</option>
              <option value="high">높음</option>
            </select>
          </label>
          <label>
            마감일
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            />
          </label>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={form.repeatEnabled}
            onChange={(event) => setForm({ ...form, repeatEnabled: event.target.checked })}
          />
          N일마다 반복
        </label>
        {form.repeatEnabled && (
          <label>
            반복 간격
            <input
              type="number"
              min="1"
              value={form.repeatEveryDays}
              onChange={(event) => setForm({ ...form, repeatEveryDays: Number(event.target.value) })}
            />
          </label>
        )}
        <label className="toggle">
          <input
            type="checkbox"
            checked={form.notificationEnabled}
            onChange={(event) => setForm({ ...form, notificationEnabled: event.target.checked })}
          />
          <Bell size={16} />
          알림 사용
        </label>
        <label>
          메모
          <textarea rows={3} value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">
          <Save size={16} />
          저장
        </button>
      </form>
    );
  }

  function renderCategoryManager() {
    return (
      <section className="category-manager" aria-label="카테고리 관리">
        <div className="category-title">
          <Tags size={16} />
          <h3>카테고리</h3>
        </div>
        <div className="category-add">
          <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="예: 공부, 집안일" />
          <select value={categoryColor} onChange={(event) => setCategoryColor(event.target.value)}>
            {CATEGORY_COLORS.map((color) => (
              <option value={color} key={color}>
                {color}
              </option>
            ))}
          </select>
          <button className="icon-button" type="button" onClick={() => void addCategory()} title="카테고리 추가">
            <Plus size={16} />
          </button>
        </div>
        <div className="category-list">
          {data.categories.map((category) => (
            <div className="category-row" key={category.id}>
              <input
                type="color"
                value={category.color}
                onChange={(event) => void updateCategory(category.id, { color: event.target.value })}
                aria-label={`${category.name} 색상`}
              />
              <input
                value={category.name}
                onChange={(event) => void updateCategory(category.id, { name: event.target.value })}
                aria-label="카테고리 이름"
              />
              <button
                className="icon-button danger"
                type="button"
                onClick={() => void deleteCategory(category)}
                title="카테고리 삭제"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderDetailPanel() {
    return (
      <aside className="detail-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">선택 날짜</p>
            <h2>{selectedDate}</h2>
          </div>
          <button className="text-button" onClick={() => setForm(defaultForm(selectedDate))} type="button">
            <Plus size={16} />
            새 할 일
          </button>
        </div>

        <div className="task-list">
          {selectedTasks.length === 0 && <p className="empty">이 날짜에 등록한 할 일이 없습니다.</p>}
          {selectedTasks.map((task) => renderTaskRow(task))}
        </div>

        {renderTaskForm()}
        {renderCategoryManager()}
      </aside>
    );
  }

  function renderTodayFocus() {
    return (
      <section className="today-focus">
        <div className="today-summary">
          <div>
            <p className="eyebrow">오늘 집중</p>
            <h2>{today}</h2>
          </div>
          <div className="summary-chips">
            <span>{todayTasks.length}개</span>
            <span>{completedTodayCount}개 완료</span>
            <span>{todayWater}ml</span>
          </div>
        </div>

        <div className="focus-grid">
          {renderWaterPanel(true)}
          <section className="focus-list">
            <div className="section-title">
              <ListTodo size={17} />
              <h3>오늘 할 일</h3>
            </div>
            {todayTasks.length === 0 && <p className="empty">오늘 등록한 할 일이 없습니다.</p>}
            {todayTasks.map((task) => renderTaskRow(task))}
          </section>
          <section className="focus-list priority">
            <div className="section-title">
              <Bell size={17} />
              <h3>중요/마감</h3>
            </div>
            {importantTodayTasks.length === 0 && <p className="empty">급한 항목이 없습니다.</p>}
            {importantTodayTasks.map((task) => renderTaskRow(task, true))}
          </section>
        </div>
      </section>
    );
  }

  function renderWidget() {
    const visibleTasks = todayTasks.slice(0, 5);

    return (
      <section className="widget-view">
        <div className="widget-top">
          <div>
            <p className="eyebrow">오늘</p>
            <h2>{today}</h2>
          </div>
          <button className="icon-button" type="button" onClick={() => setMode("month")} title="전체 화면">
            <Maximize2 size={16} />
          </button>
        </div>
        {renderWaterPanel(true)}
        <div className="widget-tasks">
          <div className="section-title">
            <ListTodo size={16} />
            <h3>할 일</h3>
          </div>
          {visibleTasks.length === 0 && <p className="empty">오늘 할 일이 없습니다.</p>}
          {visibleTasks.map((task) => renderTaskRow(task, true))}
          {todayTasks.length > visibleTasks.length && <span className="more-count">+{todayTasks.length - visibleTasks.length}개 더 있음</span>}
        </div>
      </section>
    );
  }

  return (
    <main className={`app mode-${viewMode}`}>
      <header className="toolbar">
        <div className="brand">
          <CalendarDays size={24} />
          <div>
            <h1>{APP_NAME}</h1>
            <p>{viewMode === "month" ? formatMonthLabel(currentMonth) : "오늘 할 일"}</p>
          </div>
        </div>

        <div className="toolbar-actions">
          {viewMode === "month" && (
            <>
              <button className="icon-button" onClick={() => moveMonth(-1)} title="이전 달" type="button">
                <ChevronLeft size={18} />
              </button>
              <button className="text-button" onClick={goToday} type="button">
                오늘
              </button>
              <button className="icon-button" onClick={() => moveMonth(1)} title="다음 달" type="button">
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div className="segmented" aria-label="보기 전환">
            <button className={viewMode === "month" ? "active" : ""} onClick={() => setMode("month")} title="월간 달력" type="button">
              <LayoutGrid size={16} />
            </button>
            <button className={viewMode === "today" ? "active" : ""} onClick={() => setMode("today")} title="오늘 집중" type="button">
              <ListTodo size={16} />
            </button>
            <button className={viewMode === "widget" ? "active" : ""} onClick={() => setMode("widget")} title="작은 위젯" type="button">
              <PanelRight size={16} />
            </button>
          </div>

          <button
            className={`icon-button ${data.settings.alwaysOnTop ? "active" : ""}`}
            onClick={() => void updateSettings({ alwaysOnTop: !data.settings.alwaysOnTop })}
            title="항상 위에 고정"
            type="button"
          >
            <Pin size={18} />
          </button>
          <button className="icon-button" onClick={() => window.rememberTasks.hideToTray()} title="트레이로 숨기기" type="button">
            <EyeOff size={18} />
          </button>
        </div>
      </header>

      {viewMode !== "widget" && (
        <section className="settings-strip">
          <label>
            <Eye size={16} />
            투명도
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={data.settings.opacity}
              onChange={(event) => void updateSettings({ opacity: Number(event.target.value) })}
            />
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={data.settings.startAtLogin}
              onChange={(event) => void updateSettings({ startAtLogin: event.target.checked })}
            />
            Windows 시작 시 실행
          </label>
          {dataPath && <span className="data-path">{dataPath}</span>}
        </section>
      )}

      {viewMode === "month" && (
        <section className="workspace">
          {renderWaterPanel()}
          {renderCalendar()}
          {renderDetailPanel()}
        </section>
      )}

      {viewMode === "today" && (
        <section className="today-workspace">
          {renderTodayFocus()}
          {renderDetailPanel()}
        </section>
      )}

      {viewMode === "widget" && renderWidget()}
    </main>
  );
}
