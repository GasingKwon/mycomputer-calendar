import { Notification } from "electron";
import { getTodayKey } from "../shared/date";
import { getTasksForDate } from "../shared/calendar";
import type { AppData, Task } from "../shared/types";

const notifiedKeys = new Set<string>();

export function startNotificationScheduler(getData: () => Promise<AppData>) {
  const check = async () => {
    const data = await getData();
    notifyDueTasks(data);
  };

  void check();
  return setInterval(check, 30_000);
}

export function notifyDueTasks(data: AppData) {
  if (!Notification.isSupported()) {
    return;
  }

  const now = new Date();
  const today = getTodayKey();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const dueTasks = getTasksForDate(data.tasks, today).filter((task) =>
    shouldNotify(task, today, currentTime)
  );

  for (const task of dueTasks) {
    const key = `${today}:${task.id}:${task.time ?? "day"}`;

    if (notifiedKeys.has(key)) {
      continue;
    }

    notifiedKeys.add(key);
    new Notification({
      title: task.time ? `${task.time} ${task.title}` : task.title,
      body: task.dueDate === today ? "오늘 마감인 할 일입니다." : "확인할 할 일이 있습니다.",
      silent: false
    }).show();
  }
}

function shouldNotify(task: Task, today: string, currentTime: string) {
  if (task.completed || !task.notificationEnabled) {
    return false;
  }

  if (task.time && task.date === today) {
    return task.time <= currentTime;
  }

  if (task.dueDate === today) {
    return true;
  }

  if (task.priority === "high") {
    return true;
  }

  return Boolean(task.repeatEveryDays);
}
