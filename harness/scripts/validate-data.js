const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node harness/scripts/validate-data.js <data-file.json>");
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
const raw = fs.readFileSync(absolutePath, "utf8");
const data = JSON.parse(raw);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

assert(data.schemaVersion === 1, "schemaVersion must be 1");
assert(Array.isArray(data.tasks), "tasks must be an array");
assert(Array.isArray(data.categories), "categories must be an array");
assert(Array.isArray(data.waterRecords), "waterRecords must be an array");
assert(typeof data.settings === "object" && data.settings !== null, "settings must be an object");

for (const task of data.tasks) {
  assert(typeof task.id === "string" && task.id.length > 0, "task.id is required");
  assert(typeof task.title === "string" && task.title.trim().length > 0, `task.title is required: ${task.id}`);
  assert(isDate(task.date), `task.date must be YYYY-MM-DD: ${task.id}`);
  assert(task.time === null || isTime(task.time), `task.time must be null or HH:mm: ${task.id}`);
  assert(
    task.categoryId === null || typeof task.categoryId === "string",
    `task.categoryId must be null or string: ${task.id}`
  );
  assert(["low", "normal", "high"].includes(task.priority), `invalid priority: ${task.id}`);
  assert(task.dueDate === null || isDate(task.dueDate), `task.dueDate must be null or YYYY-MM-DD: ${task.id}`);
  assert(
    task.repeatEveryDays === null ||
      (Number.isInteger(task.repeatEveryDays) && task.repeatEveryDays >= 1),
    `task.repeatEveryDays must be null or positive integer: ${task.id}`
  );
  assert(typeof task.notificationEnabled === "boolean", `task.notificationEnabled must be boolean: ${task.id}`);
  assert(typeof task.completed === "boolean", `task.completed must be boolean: ${task.id}`);
}

for (const category of data.categories) {
  assert(typeof category.id === "string" && category.id.length > 0, "category.id is required");
  assert(typeof category.name === "string" && category.name.trim().length > 0, `category.name is required: ${category.id}`);
  assert(/^#[0-9a-fA-F]{6}$/.test(category.color), `category.color must be #RRGGBB: ${category.id}`);
}

for (const record of data.waterRecords) {
  assert(isDate(record.date), "waterRecord.date must be YYYY-MM-DD");
  assert(Number.isInteger(record.amountMl) && record.amountMl >= 0, `waterRecord.amountMl must be non-negative integer: ${record.date}`);
}

assert(typeof data.settings.alwaysOnTop === "boolean", "settings.alwaysOnTop must be boolean");
assert(typeof data.settings.startAtLogin === "boolean", "settings.startAtLogin must be boolean");
assert(typeof data.settings.opacity === "number", "settings.opacity must be number");
assert(data.settings.opacity > 0 && data.settings.opacity <= 1, "settings.opacity must be greater than 0 and <= 1");

console.log(`Valid data file: ${absolutePath}`);
