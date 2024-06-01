import { scheduleSchema } from "./cron";

describe("cronParamSchema", () => {
  it("should validate a daily cron parameter", () => {
    const validParam = {
      time: "12:30",
      frequency: "daily",
    };

    const result = scheduleSchema.safeParse(validParam);

    expect(result.success).toBe(true);
    expect(result.data).toEqual("30 12 * * *");
  });

  it("should validate a weekly cron parameter", () => {
    const validParam = {
      time: "09:00",
      frequency: "weekly",
      weekday: 3,
    };

    const result = scheduleSchema.safeParse(validParam);
    expect(result.success).toBe(true);
    expect(result.data).toEqual("00 09 * * 2");
  });

  it("should validate for an daily schedule with weekday param", () => {
    const invalidParam = {
      time: "08:45",
      frequency: "daily",
      weekday: 4,
    };

    const result = scheduleSchema.safeParse(invalidParam);
    expect(result.success).toBe(true);
    expect(result.data).toEqual("45 08 * * *");
  });

  it("should validate for an daily schedule with invalid weekday param", () => {
    const invalidParam = {
      time: "08:45",
      frequency: "daily",
      weekday: 12,
    };

    const result = scheduleSchema.safeParse(invalidParam);
    expect(result.success).toBe(true);
    expect(result.data).toEqual("45 08 * * *");
  });

  it("should fail validation for an weekly schedule without weekday param", () => {
    const invalidParam = {
      time: "08:45",
      frequency: "weekly",
      weekday: undefined,
    };

    const result = scheduleSchema.safeParse(invalidParam);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Weekday is required for weekly schedules and must be between 1 and 7"
    );
  });

  it("should fail validation for an invalid weekday", () => {
    const invalidParam = {
      time: "08:45",
      frequency: "weekly",
      weekday: 8,
    };

    const result = scheduleSchema.safeParse(invalidParam);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Weekday is required for weekly schedules and must be between 1 and 7"
    );
  });

  it("should fail validation for an invalid time format", () => {
    const invalidParam = {
      time: "12:00:00",
      frequency: "daily",
    };

    const result = scheduleSchema.safeParse(invalidParam);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid time format, expected HH:MM");
  });
});
