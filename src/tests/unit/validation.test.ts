import { describe, expect, it } from "vitest";
import emptyData from "../../../harness/fixtures/empty-data.json";
import recurringSample from "../../../harness/fixtures/recurring-sample.json";
import sampleMonth from "../../../harness/fixtures/sample-month.json";
import { normalizeAppData, validateTaskInput } from "../../shared/validation";

describe("data validation", () => {
  it("accepts fixture data", () => {
    expect(normalizeAppData(emptyData).schemaVersion).toBe(1);
    expect(normalizeAppData(sampleMonth).tasks).toHaveLength(3);
    expect(normalizeAppData(recurringSample).tasks).toHaveLength(3);
  });

  it("rejects empty titles", () => {
    expect(
      validateTaskInput({
        title: "",
        date: "2026-06-25",
        time: null,
        priority: "normal",
        dueDate: null,
        repeatEveryDays: null
      })
    ).toContain("Title is required.");
  });
});
